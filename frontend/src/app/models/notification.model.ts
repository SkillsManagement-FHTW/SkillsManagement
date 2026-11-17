export interface Notification {
  id: number;
  type: 'survey' | 'info';
  title: string;
  deadline: string;
  status: 'open' | 'read' | 'expired';
  description: string;
}