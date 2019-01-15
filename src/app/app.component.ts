import { UserService } from 'projects/visla-auth/src/public_api';
import { Component } from '@angular/core';
import { AuthService } from 'projects/visla-auth/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'visla-auth';
  constructor(private auth: AuthService, private user: UserService) {
    console.log(this.auth.isLoggedIn);
  }

  // logout() {
  //     this.auth.logout(false);
  // }

  // login() {
  //   const dummyData = {
  //     email: 'admin@gmail.com',
  //     password: 'admin123'
  //   };
  //   this.auth.login(dummyData).subscribe((x) => {
  //     this.auth.getMe().subscribe((me) => {
  //       console.log(me);
  //     });
  //   });
  // }
}
