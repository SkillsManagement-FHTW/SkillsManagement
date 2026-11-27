import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Notification } from '../../../models/notification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../../../models/enums/user-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class LecturerNotificationsService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  openNotificationsCount$ = this.notifications$.pipe(
    map(notifications =>
      notifications.filter(notification =>
        notification.status === 'open'
      ).length
    )
  );

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUser.pipe(
      switchMap(user => user?.role === UserRole.LECTURER
        ? this.loadNotifications()
        : of([] as Notification[])
      )
    ).subscribe({
      next: notifications => this.notificationsSubject.next(notifications),
      error: error => console.error('Failed to load notifications:', error)
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.token;
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  loadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.notifications.all}`,
      { headers: this.getAuthHeaders() }
    );
  }

  markAsRead(id: string): void {
    this.http.patch<Notification>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.notifications.markAsRead(id)}`,
      {},
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: updatedNotification => {
        const updatedNotifications = this.notificationsSubject.value.map(notification =>
          notification._id === updatedNotification._id ? updatedNotification : notification
        );
        this.notificationsSubject.next(updatedNotifications);
      },
      error: error => console.error('Failed to mark notification as read:', error)
    });
  }
}
