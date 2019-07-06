import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nw-pickem';

  constructor(private http: HttpClient) {
    http
      .post('/api/auth/login', {
        email: 'osubucks13@gmail.com',
        password: 'password',
      })
      .subscribe();
  }
}
