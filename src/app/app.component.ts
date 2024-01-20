import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recipe-bank';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
  // We will default to recipe
  // loadedFeature = 'recipe'

  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  // }

}
