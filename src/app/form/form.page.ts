import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'form-page',
  imports: [RouterOutlet],
  standalone: true,
  template: `
    <div>
      <h1>Home</h1>
    </div>
  `,
})
export class AppComponent {
}
