import { Routes } from '@angular/router';
import {HomePage} from './home-page';
import {UserChatPage} from './user-chat.page';
import {AdminPanelComponent} from './admin-panel.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'user-chat', component: UserChatPage },
  { path: 'admin-panel', component: AdminPanelComponent },
];
