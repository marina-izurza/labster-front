import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MessageStatus} from './models/message.model';
import {MessageService} from './form/message.service';
import {Router} from '@angular/router';

@Component({
  selector: 'user-chat-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, NgClass],
  template: `
    <div class="h-screen flex justify-center items-center bg-gray-50">
      <button (click)="goBack()" class="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 mb-4 self-start">
        Volver
      </button>

      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mx-auto">
        <span class="text-3xl font-bold text-center text-gray-800 mb-6">Send us your message</span>

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
      <span class="text-sm text-gray-600">
        {{ alertStatus }}
      </span>
        </div>

        <div *ngIf="messages.length > 0" class="mt-4">
          <h3 class="text-lg font-semibold text-gray-700">Messages:</h3>
          <ul class="space-y-2">
            <li *ngFor="let message of messages" class="p-2 bg-gray-100 rounded-md flex justify-between items-center">
              <p class="text-gray-800">{{ message.content }} -
                <span [ngClass]="{
              'text-yellow-600': message.status === 'pending',
              'text-green-600': message.status === 'completed'
            }">
              {{ message.status }}
            </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>

  `
})
export class UserChatPage implements OnInit, OnDestroy {
  message: string = '';
  alertStatus: string = 'Ready to send!';
  messages: MessageStatus[] = [];
  private intervalId!: any;

  constructor(private readonly messageService: MessageService, private readonly router: Router) {}

  ngOnInit(): void {

  }

  submitForm(): void {
    if (this.message) {
      this.alertStatus = 'Processing...';

      this.messageService.sendMessage(this.message).subscribe({
        next: (response: MessageStatus): void => {
          console.log('Message sent:', response);
          this.alertStatus = 'Message Sent!';
          this.message = '';
        },
        error: (error: any): void => {
          console.error('Error sending message:', error);
          this.alertStatus = 'Error sending message!';
        }
      });
    }
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
