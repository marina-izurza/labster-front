export interface Message {
  id: string;
  status: 'pending' | 'completed';
  content: string;
}

