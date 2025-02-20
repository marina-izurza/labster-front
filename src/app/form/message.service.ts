import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MessageStatus} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl: string = 'http://localhost:8000';

  constructor(private http: HttpClient) {
  }

  getAllMessages(): Observable<MessageStatus[]> {
    return this.http.get<MessageStatus[]>(this.apiUrl + "/messages");
  }

  sendMessage(message: string): Observable<MessageStatus> {
    return this.http.post<MessageStatus>(this.apiUrl + "/message", {message});
  }

  validateMessage(messageId: string): Observable<MessageStatus> {
    return this.http.post<MessageStatus>(this.apiUrl + "/validate", {messageId});
  }
}
