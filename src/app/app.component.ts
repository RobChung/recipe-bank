import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { useDevice } from './shared/interfaces/device-state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recipe-bank';

  isMobile: boolean;
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.isMobile = useDevice().isMobile

    this.userSubscription = this.authService.user$.subscribe((user) => {
      // this.isAuthenticated = !user ? false : true;
      // above can be written as
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });

    console.log(this.isAuthenticated)
    console.log(this.isMobile)
  }
  // We will default to recipe
  // loadedFeature = 'recipe'

  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  // }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
