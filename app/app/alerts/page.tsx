'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/Tabs'
import { useAuth } from '@/hooks/useAuth'
import { getNotificationsByUserId, getUnreadCount } from '@/data/notifications'
import { formatRelativeTime } from '@/domain/utils/formatters'
import { EmptyState, NoNotificationsIcon } from '@/components/ui/EmptyState'
import type { Notification, NotificationType } from '@/domain/types'

type FilterType = 'all' | 'unread'

const typeIcons: Record<NotificationType, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

const typeColors: Record<NotificationType, string> = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-orange-100 text-orange-600',
  alert: 'bg-red-100 text-red-600',
}

export default function AlertsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    if (user) {
      setNotifications(getNotificationsByUserId(user.id))
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SegmentedControl
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'unread', label: `Non lues (${unreadCount})` },
          ]}
          value={filter}
          onChange={setFilter}
        />
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Tout marquer lu
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<NoNotificationsIcon />}
          title="Aucune notification"
          description={
            filter === 'unread'
              ? 'Vous avez lu toutes vos notifications.'
              : "Vous n'avez pas encore de notifications."
          }
        />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                    {typeIcons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium text-text ${!notif.read ? 'font-semibold' : ''}`}>
                          {notif.title}
                        </p>
                        <p className="text-sm text-text-muted mt-0.5">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                      {notif.actionUrl && (
                        <Link
                          href={notif.actionUrl}
                          className="text-xs text-primary font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
