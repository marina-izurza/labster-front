import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { MessageStatus } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl: string = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<MessageStatus> {
    return this.http.post<MessageStatus>(`${this.apiUrl}/message`, { message });
  }

  getMessages(): Observable<MessageStatus[]> {
    return this.http.get<MessageStatus[]>(`${this.apiUrl}/messages`);
  }

  watchMessageStatus(): Observable<MessageStatus[]> {
    return interval(5000).pipe(
      switchMap(() => this.getMessages())
    );
  }
}
