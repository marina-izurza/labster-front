import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {interval, Observable, switchMap} from 'rxjs';
import {Message} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl: string = 'http://localhost:8000';

  constructor(private http: HttpClient) {
  }

  sendMessage(message: string): Observable<Message> {
    return this.http.post<Message>(this.apiUrl + "/message", {message});
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl + "/messages");
  }

  watchMessageStatus(): Observable<Message[]> {
    return interval(5000).pipe(
      switchMap((): Observable<Message[]> => this.getMessages())
    );
  }
}
