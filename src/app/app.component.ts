import {Component, OnInit} from '@angular/core';
import {MessageService} from './form/message.service';
import {MessageStatus} from './models/message.model';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, NgClass],
  template: `
    <div class="h-screen flex justify-center items-center">
      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mx-auto">
        <span class="text-2xl font-semibold text-center text-gray-800 mb-6">Send us your message</span>

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
          <h3 class="text-lg font-semibold">Messages:</h3>
          <ul>
            <li *ngFor="let message of messages">
              <p>{{ message.content }} -
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
export class AppComponent implements OnInit {
  message: string = '';
  alertStatus: string = 'Ready to send!';
  messages: MessageStatus[] = [];
  userToken: string = '12345';
  completedMessages: MessageStatus[] = [];

  constructor(private readonly messageService: MessageService) {
  }

  ngOnInit(): void {
    this.checkMessageStatus();
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

  checkMessageStatus(): void {
    this.messageService.getMessageStatus(this.userToken).subscribe({
      next: (messages: MessageStatus[]) => {
        console.log('Current Messages:', messages);
        this.completedMessages = messages.filter(msg => msg.status === 'completed');
      },
      error: (error: any) => {
        console.error('Error checking message status:', error);
      }
    });
  }

}
