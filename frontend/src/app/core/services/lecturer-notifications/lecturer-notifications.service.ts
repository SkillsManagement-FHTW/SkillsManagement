import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Notification } from '../../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class LecturerNotificationsService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      type: 'survey',
      title: 'Evaluierung des Studiengangs',
      deadline: '2026-11-30',
      status: 'open',
      description: 'Bitte nehmen Sie an der Evaluierung teil.'
    },
    {
      id: 2,
      type: 'info',
      title: 'Neue Lehrveranstaltungsrichtlinien',
      deadline: '2026-11-25',
      status: 'read',
      description: 'Informationen zu den neuen Richtlinien.'
    },
    {
      id: 3,
      type: 'survey',
      title: 'Feedback zur Lernplattform',
      deadline: '2026-12-05',
      status: 'open',
      description: 'Bitte geben Sie Feedback zur Lernplattform.'
    },
    {
      id: 4,
      type: 'survey',
      title: 'Evaluierung der Lehrveranstaltung',
      deadline: '2026-11-15',
      status: 'expired',
      description: 'Die Teilnahmefrist ist bereits abgelaufen.'
    }
  ]);

  notifications$ = this.notificationsSubject.asObservable();

  openNotificationsCount$ = this.notifications$.pipe(
    map(notifications =>
      notifications.filter(notification =>
        notification.status === 'open'
      ).length
    )
  );

  markAsRead(id: number): void {
    const updatedNotifications = this.notificationsSubject.value.map(
      notification =>
        notification.id === id
          ? { ...notification, status: 'read' as const }
          : notification
    );

    this.notificationsSubject.next(updatedNotifications);
  }
}
