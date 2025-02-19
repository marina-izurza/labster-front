export interface Message {
  content: string;
}

export interface MessageStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed';
  message: Message;
}
