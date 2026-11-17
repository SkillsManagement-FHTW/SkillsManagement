import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LecturerNotificationsService } from '../../core/services/lecturer-notifications/lecturer-notifications.service';
import { Notification } from '../../models/notification.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  notifications$;
  selectedNotification: Notification | null = null;

  constructor(
    private notificationsService: LecturerNotificationsService
  ) {
    this.notifications$ = this.notificationsService.notifications$;
  }

  openNotification(notification: Notification): void {
    this.selectedNotification = notification;

    if (notification.status === 'open') {
    this.notificationsService.markAsRead(notification.id);
    }
  }

  closeNotification(): void {
    this.selectedNotification = null;
  }
}
