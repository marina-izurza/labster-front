import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MessageService} from './form/message.service';
import {MessageStatus} from './models/message.model';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  standalone: true,
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
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  message: string = '';
  alertStatus: string = 'Ready to send!';
  completedMessages: MessageStatus[] = [];
  userToken: string = '12345'; // Token único por usuario, puede generarse dinámicamente
  pollingSubscription: Subscription = new Subscription();

  constructor(private readonly messageService: MessageService) {
  }

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    //this.pollingSubscription.unsubscribe();
  }

  submitForm(): void {
    if (this.message) {
      this.alertStatus = 'Sending...';

      this.messageService.sendMessage(this.message).subscribe({
        next: (response: MessageStatus): void => {
          console.log('Message sent:', response);
          this.alertStatus = 'Message Sent!';
          this.message = '';
        },
        error: (error: any): void => {
          console.error('Error sending message:', error);
          this.alertStatus = 'Error sending message!';
        },
        complete: (): void => {
          console.log('Request completed.');
        }
      });
    }
  }

  startPolling(): void {
    console.log('Polling...');
    /*this.pollingSubscription = interval(5000).subscribe((): void => {
      //this.checkCompletedMessages();
    });*/
  }
  /*
   checkCompletedMessages(): void {
     this.messageService.getMessages(this.userToken).subscribe({
       next: (messages: MessageStatus[]): void => {
         this.completedMessages = messages;
         if (this.completedMessages.length > 0) {
           this.alertStatus = 'Messages processed!';
         }
       },
       error: (error: any): void => {
         console.error('Error checking messages:', error);
         this.alertStatus = 'Error checking messages!';
       }
     });
   }
   */
}

