// admin-panel.component.ts
import {Component, OnInit} from '@angular/core';
import {MessageService} from './form/message.service';
import {MessageStatus} from './models/message.model';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen flex flex-col">
      <button (click)="goBack()" class="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 mb-4 self-start">
        Volver
      </button>

      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Panel</h1>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Pending Messages:</h3>
        <div *ngIf="messages.length > 0; else noMessages">
          <ul class="space-y-4">
            <li *ngFor="let message of messages" class="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200">
              <div>
                <p class="text-gray-800">{{ message.content }}</p>
                <span class="text-yellow-600">{{ message.status }}</span>
              </div>
              <button (click)="validateMessage(message.id)"
                      class="py-1 px-3 bg-indigo-600 cursor-pointer text-white rounded hover:bg-indigo-700 transition duration-200">
                Validate
              </button>
            </li>
          </ul>
        </div>
        <ng-template #noMessages>
          <div class="mt-4 text-gray-600 text-center">
            No pending messages.
          </div>
        </ng-template>
      </div>
    </div>

  `
})
export class AdminPanelComponent implements OnInit {
  messages: MessageStatus[] = [];

  constructor(private readonly messageService: MessageService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getAllMessages().subscribe({
      next: (messages: MessageStatus[]): void => {
        console.log('Messages fetched:', messages);
        this.messages = messages.filter(message => message.status === 'pending');
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      }
    });
  }


  validateMessage(messageId: string): void {
    console.log(`Validating message with ID: ${messageId}`);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
