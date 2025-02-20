export interface MessageStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed';
  content?: string;
}

