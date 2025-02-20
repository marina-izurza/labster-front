import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [],
  template: `
    <div class="h-screen flex justify-center items-center bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mx-auto text-center">
        <h1 class="text-3xl font-semibold mb-6">Welcome to the Messaging App</h1>
        <div class="space-y-4">
          <button
            (click)="goToUserPanel()"
            class="w-full py-3 bg-indigo-600 text-white cursor-pointer font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
          >
            User Panel
          </button>
          <button
            (click)="goToAdminPanel()"
            class="w-full py-3 bg-red-600 text-white cursor-pointer font-semibold rounded-md hover:bg-red-700 transition duration-200"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>

  `
})
export class HomePage {

  constructor(private router: Router) {
  }

  goToUserPanel(): void {
    this.router.navigate(['/user-chat']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin-panel']);
  }
}
