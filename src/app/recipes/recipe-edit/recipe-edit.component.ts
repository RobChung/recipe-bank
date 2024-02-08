import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, map, switchMap } from 'rxjs';
import { RecipeService } from '../service/recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  subscription: Subscription;
  recipeEditForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        // we want to check if params has an id property
        // if so, we must be in edit mode as the recipe exists, and we
        // are not trying to add a new recipe
        this.editMode = params['id'] != null;
        // We call initForm whenever the params change
        this.initForm()

      }
    )

    // this.initForm()
  }


  // do we need this using FormBuilder?
  // Yes, as we have an 'Edit Mode' where the form requires
  // to be initialized with values from an existing Recipe
  private initForm() {

    let recipeName = '';
    let imgUrl = '';
    let description = '';
    let recipeIngredients = new FormArray([]);
    // let recipeIngredients = [];

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.store.select('recipes')
        .pipe(
          map(recipeState => {
            // we want a single recipe for the given id
            return recipeState.recipes[this.id]
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          imgUrl = recipe.imagePath;
          description = recipe.description;
          // Theoretically, we can currently create a Recipe without Ingredients, so do a check
          if (recipe.ingredients) {
            // console.log('ingredients exist')
            recipe.ingredients.forEach(ingredient => {

              // Check if using FB works
              recipeIngredients.push(
                this.fb.group({
                  name: [ingredient.name, Validators.required],
                  quantity: [ingredient.quantity, [Validators.required, Validators.min(1)]]
                })
              )
            });
          }
        })
    }

    this.recipeEditForm = this.fb.group({
      name: [recipeName, Validators.required],
      imagePath: [imgUrl, Validators.required],
      description: [description, Validators.required],
      ingredients: recipeIngredients,
    })
  }

  onSubmit() {

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeEditForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeEditForm.value);
    }

    this.navigateBack();

  }

  onCancel() {
    this.navigateBack();
  }

  additionalIngredient() {
    // we have more than 1 control to push
    // const control = new FormControl(null, Validators.required);
    (<FormArray>this.recipeEditForm.get('ingredients')).push(
      this.fb.group({
        name: [null, Validators.required],
        quantity: [1, Validators.min(1)]
      })
    )
  }

  get controls() {
    return (<FormArray>this.recipeEditForm.get('ingredients')).controls;
    // Method below if we rename controls() to something like ingredients()
    // then in the HTML, let x of ingredients.controls;
    // return this.recipeEditForm.controls['ingredients'] as FormArray;
  }

  deleteIngredient(index: number) {
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
