import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from './form/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="h-screen flex justify-center items-center bg-gray-50">
      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mx-auto">
        <span class="text-3xl font-bold text-center text-gray-800 mb-6">
          Send us your message
        </span>

        <form (ngSubmit)="submitForm()">
          <div class="mb-6">
            <label for="message" class="block text-sm font-medium text-gray-600">Message</label>
            <textarea
              id="message"
              name="message"
              [(ngModel)]="message"
              rows="4"
              class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your message"
              required
            ></textarea>
          </div>

          <div class="flex justify-center">
            <button
              type="submit"
              class="w-full py-3 bg-indigo-600 cursor-pointer text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Send
            </button>
          </div>
        </form>

        <div class="mt-4 text-center">
          <span class="text-sm text-gray-600">{{ alertStatus }}</span>
        </div>
      </div>
    </div>
  `
})
export class HomePage {
  message: string = '';
  alertStatus: string = 'Ready to send!';

  constructor(private readonly messageService: MessageService, private readonly router: Router) {}

  submitForm(): void {
    if (this.message) {
      this.alertStatus = 'Processing...';

      this.messageService.sendMessage(this.message).subscribe({
        next: (response) => {
          console.log('Message sent:', response);
          this.alertStatus = 'Message Sent!';
          this.message = '';
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.alertStatus = 'Error sending message!';
        }
      });
    }
  }
}
