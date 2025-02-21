import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MessageService} from './form/message.service';
import {Subscription} from 'rxjs';
import {NgIf} from '@angular/common';
import {MessageStatus} from './models/message.model';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [FormsModule, NgIf],
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
              *ngIf="isInitialized"
              id="message"
              name="message"
              [(ngModel)]="message"
              rows="4"
              class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your message"
              required
              [disabled]="isMessageInputDisabled"
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
export class HomePage implements OnInit {
  message: string = '';
  alertStatus: string = 'Ready to send 🖋️️';
  lastMessageId: string | null = null;
  messageSubscription: Subscription | null = null;

  isMessageInputDisabled: boolean = false;
  isInitialized: boolean = false;

  constructor(private readonly messageService: MessageService) {
  }

  ngOnInit(): void {
    this.isInitialized = true;
  }

  submitForm(): void {
    if (!this.message) return;

    this.alertStatus = 'Sending message 📨';
    this.isMessageInputDisabled = true;

    this.messageService.sendMessage(this.message).subscribe({
      next: (response: MessageStatus): void => {
        this.lastMessageId = response.id;
        this.message = '';

        // quito suscripcion previa
        if (this.messageSubscription) this.messageSubscription.unsubscribe();

        // empiezo a escuchar
        this.messageSubscription = this.messageService.watchMessageStatus().subscribe((messagesObj: MessageStatus[]) => {
          if (!messagesObj || typeof messagesObj !== 'object') {
            console.error("Error: The API did not return a valid object.", messagesObj);
            return;
          }

          const messages: MessageStatus[] = Object.values(messagesObj);

          const userMessage: MessageStatus | undefined = messages.find((msg: MessageStatus): boolean => msg.id === this.lastMessageId);
          if (userMessage) {
            if (userMessage.status === 'completed') {
              this.alertStatus = 'Message successfully processed! 🎉';
              this.isMessageInputDisabled = false;
              this.messageSubscription?.unsubscribe(); // paro la suscripcion al validar el mensajee
              setTimeout(() => {
                this.alertStatus = "Ready to send 🖋️️";
              }, 3000);
            } else {
              this.alertStatus = 'Message pending processing ⏳';
            }
          }
        });
      },
      error: (): void => {
        this.alertStatus = 'Error sending the message ⚠️';
        this.isMessageInputDisabled = false;
      }
    });
  }

}

