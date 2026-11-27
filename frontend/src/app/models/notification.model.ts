export interface Notification {
  _id: string;
  type: 'survey' | 'info';
  title: string;
  deadline?: string | Date;
  status: 'open' | 'read' | 'expired';
  description: string;
}
