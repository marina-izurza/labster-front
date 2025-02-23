import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from './services/message.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Message } from './models/message.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [FormsModule, NgIf, LottieComponent],
  animations: [
    trigger('bounce', [
      transition('void => *', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div class="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg mx-auto">
        <span class="text-2xl font-bold text-center text-gray-800 flex justify-center items-center" [@bounce]>
          <ng-container>{{ alertStatus }}</ng-container>
        </span>

        <ng-container *ngIf="!isMessageInputDisabled && !showNewMessageButton">
          <form (ngSubmit)="submitForm()">
            <div class="mt-6">
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

            <span *ngIf="!message" class="text-red-500 text-sm font-medium">Please enter a message before sending ⚠️</span>

            <div class="flex justify-center mt-6">
              <button
                type="submit"
                class="w-full py-3 bg-indigo-600 cursor-pointer text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
                [disabled]="isMessageInputDisabled"
              >
                Send
              </button>
            </div>
          </form>
        </ng-container>

        <ng-container *ngIf="isMessageInputDisabled">
          <ng-lottie *ngIf="alertStatus.includes('Sending')" [options]="sendingMessageOptions" class="w-32 h-32 mx-auto"></ng-lottie>
          <ng-lottie *ngIf="alertStatus.includes('pending')" [options]="pendingMessageOptions" class="w-32 h-32 mx-auto"></ng-lottie>
          <ng-container *ngIf="alertStatus.includes('successfully')">
            <ng-lottie [options]="successfullyMessageOptions" class="w-32 h-32 mx-auto"></ng-lottie>
            <button
              (click)="resetForm()"
              class="mt-4 w-full py-3 bg-indigo-600 cursor-pointer text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Send another message
            </button>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `
})
export class HomePage implements OnInit, OnDestroy {
  message: string = '';
  alertStatus: string = 'Send a message 🖋️️';
  lastMessageId: string | null = null;
  private messageSubscription: Subscription | null = null;
  isMessageInputDisabled: boolean = false;
  isInitialized: boolean = false;
  showNewMessageButton: boolean = false;

  readonly sendingMessageOptions: AnimationOptions = { path: 'plane-sending-message.json' };
  readonly pendingMessageOptions: AnimationOptions = { path: 'pending-message.json' };
  readonly successfullyMessageOptions: AnimationOptions = { path: 'success-message.json' };

  constructor(private readonly messageService: MessageService) {}

  ngOnInit(): void {
    this.isInitialized = true;
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }

  submitForm(): void {
    if (!this.message) return;

    this.updateAlertStatus('Sending message');
    this.isMessageInputDisabled = true;

    this.messageService.sendMessage(this.message).subscribe({
      next: (response: Message) => {
        this.lastMessageId = response.id;
        this.message = '';
        this.messageSubscription?.unsubscribe();

        this.messageSubscription = this.messageService.watchMessageStatus().subscribe((messagesObj: Message[]) => {
          const messages: Message[] = Object.values(messagesObj);
          const userMessage = messages.find((msg) => msg.id === this.lastMessageId);

          if (userMessage) {
            this.updateAlertStatus(userMessage.status === 'completed' ? 'Message successfully processed!' : 'Message pending processing');
            if (userMessage.status === 'completed') {
              this.showNewMessageButton = true;
              this.messageSubscription?.unsubscribe();
            }
          }
        });
      },
      error: () => {
        this.updateAlertStatus('Error sending the message ⚠️');
        this.isMessageInputDisabled = false;
      }
    });
  }

  resetForm(): void {
    this.updateAlertStatus('Send a message 🖋️️');
    this.message = '';
    this.isMessageInputDisabled = false;
    this.showNewMessageButton = false;
  }

  private updateAlertStatus(status: string): void {
    this.alertStatus = status;
  }
}
