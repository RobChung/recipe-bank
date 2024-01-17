import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../service/recipe.service';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/service/shopping-list.service';
import { DataStorageService } from 'src/app/shared/data-storage-service';

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
    private dataService: DataStorageService) { }

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
      const recipe = this.recipeService.getRecipe(this.id);
      // console.log(recipe)
      recipeName = recipe.name;
      imgUrl = recipe.imagePath;
      description = recipe.description;
      // ingredients = recipe.ingredients;
      // Theoretically, we can currently create a Recipe without Ingredients, so do a check
        //recipe.ingredients?? recipe['ingredients']??
      if (recipe.ingredients) {
        // console.log('ingredients exist')
        recipe.ingredients.forEach(ingredient => {
          // console.log(ingredient)
          
          // Instead of pushing an ingredient, we need to push a FormGroup
          // This is because we have two Controls that will control a single Ingredient
          // recipeIngredients.push(ingredient);

          // recipeIngredients.push(
          //   new FormGroup({
          //     'ingredientName': new FormControl(ingredient.name),
          //     'ingredientQty': new FormControl(ingredient.quantity)
          //   })
          // )

          // Check if using FB works
          recipeIngredients.push(
            this.fb.group({
              name: [ingredient.name, Validators.required],
              quantity: [ingredient.quantity, [Validators.required, Validators.min(1)]]
            })
          )

        });
      }
    }

    this.recipeEditForm = this.fb.group({
      name: [recipeName, Validators.required],
      imagePath: [imgUrl, Validators.required],
      description: [description, Validators.required],
      // Why is [] not required here??
        // Because we're passing a FormArray??
      ingredients: recipeIngredients,

      // Tried a bunch of bs here to validate input for name/qty, but the correct location was above where we create the form. This is because if recipe->ingredients exist, then those existing inputs need validation in them.
      // In addition, we validate it in the 'add' function as new inputs rendered need the validation properties as well.
      // ingredients: [recipeIngredients]
      // ingredientName: ['', Validators.required],
      // ingredientQty: [0, Validators.min(1)]
      // ingredients:
      //   this.fb.array(ingredientName, ingredientQty)
      
      // ingredients: this.fb.group({
      //   data: this.fb.array([

      //   ])
      // })
  
    })
  }

  onSubmit() {

    // If the value of the form has the exact same format as the Recipe model, we can simply:
    // this.recipeService.addRecipe(this.recipeEditForm.value)

    // const recipeName = this.recipeEditForm.value.recipeName;
    // const imgUrl = this.recipeEditForm.value.imgUrl;
    // const description = this.recipeEditForm.value.recipeDescription;

    // const formArrayData = this.recipeEditForm.value.ingredients;
    
    // const ingredientList: Ingredient[] = []
    
    // formArrayData.forEach(ingredient => {
    //   let item = new Ingredient(ingredient.ingredientName, ingredient.ingredientQty)

    //   ingredientList.push(item);
    // });

    // const recipe = new Recipe(recipeName, description, imgUrl, ingredientList);

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeEditForm.value);
      // See note in DataService Class
      // this.dataService.updateRecipe(this.id, this.recipeEditForm.value);
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
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
