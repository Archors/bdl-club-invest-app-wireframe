export type NotificationType = 'info' | 'success' | 'warning' | 'alert'
export type NotificationCategory = 'transaction' | 'document' | 'performance' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  contractId?: string
}

export interface NotificationFilters {
  read?: boolean
  category?: NotificationCategory
}
