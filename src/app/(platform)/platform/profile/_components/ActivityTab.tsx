// app/(platform)/platform/profile/_components/ActivityTab.tsx
'use client';

import { useState } from 'react';
import { History, LogIn, Key, Settings, Shield, ChevronRight, AlertCircle, CheckCircle, Clock, MapPin, Monitor } from 'lucide-react';
import { ActivityItem } from './types';
import { cn } from '@/lib/utils';

const mockActivities: ActivityItem[] = [
  { id: '1', action: 'Successful Login', description: 'Logged in successfully from a new device', timestamp: '2025-05-31T09:30:00Z', ipAddress: '192.168.1.1', status: 'success' },
  { id: '2', action: 'Password Changed', description: 'Account password was updated for security reasons', timestamp: '2025-05-30T14:20:00Z', ipAddress: '192.168.1.1', status: 'success' },
  { id: '3', action: 'Profile Updated', description: 'Updated personal information including phone number and location', timestamp: '2025-05-28T11:45:00Z', ipAddress: '192.168.1.1', status: 'success' },
  { id: '4', action: 'Failed Login Attempt', description: 'Unsuccessful login attempt with incorrect password', timestamp: '2025-05-25T22:15:00Z', ipAddress: '203.0.113.45', status: 'failed' },
  { id: '5', action: 'Notification Settings Changed', description: 'Updated email and push notification preferences', timestamp: '2025-05-22T16:30:00Z', ipAddress: '192.168.1.1', status: 'success' },
  { id: '6', action: 'Session Revoked', description: 'Manually signed out a remote session from MacBook Pro', timestamp: '2025-05-20T10:15:00Z', ipAddress: '192.168.1.1', status: 'success' },
];

const getActionIcon = (action: string) => {
  if (action.includes('Login')) return <LogIn className="h-3.5 w-3.5" />;
  if (action.includes('Password')) return <Key className="h-3.5 w-3.5" />;
  if (action.includes('Profile') || action.includes('Notification')) return <Settings className="h-3.5 w-3.5" />;
  if (action.includes('Session')) return <Monitor className="h-3.5 w-3.5" />;
  return <Shield className="h-3.5 w-3.5" />;
};

const getStatusIcon = (status: string) => {
  return status === 'success' 
    ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
    : <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export function ActivityTab() {
  const [activities] = useState<ActivityItem[]>(mockActivities);
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-white/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
            <History className="h-5 w-5 text-[#c3a26c]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">Account Activity Log</h3>
            <p className="text-sm text-stone-500">Track all important actions and security events on your account</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-200">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-white/20 transition">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shrink-0 mt-0.5",
                activity.status === 'success' ? "bg-emerald-100" : "bg-red-100"
              )}>
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-stone-800">{activity.action}</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(activity.status)}
                    <span className={cn(
                      "text-xs font-medium",
                      activity.status === 'success' ? "text-emerald-600" : "text-red-600"
                    )}>
                      {activity.status === 'success' ? 'Successful' : 'Failed'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-stone-600 mt-1">{activity.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(activity.timestamp)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    IP: {activity.ipAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 5 && !showAll && (
        <div className="p-4 border-t border-white/40 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm font-medium text-[#c3a26c] hover:underline inline-flex items-center gap-1"
          >
            View all {activities.length} activities
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {showAll && (
        <div className="p-4 border-t border-white/40 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}