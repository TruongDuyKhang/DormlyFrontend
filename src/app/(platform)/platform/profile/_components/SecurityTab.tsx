// app/(platform)/platform/profile/_components/SecurityTab.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Eye, EyeOff, Laptop, Smartphone, Globe, Clock, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/_components/ui/button';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export function SecurityTab() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Windows PC',
      browser: 'Chrome',
      location: 'Ho Chi Minh City, Vietnam',
      ipAddress: '192.168.1.1',
      lastActive: 'Just now',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro',
      browser: 'Safari',
      location: 'Ho Chi Minh City, Vietnam',
      ipAddress: '192.168.1.2',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'iPhone 15',
      browser: 'Safari',
      location: 'Hanoi, Vietnam',
      ipAddress: '192.168.1.3',
      lastActive: 'Yesterday at 8:30 PM',
      isCurrent: false,
    },
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setMessage({ type: 'success', text: 'Session has been revoked. The device will be signed out.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    setMessage({ type: 'success', text: 'All other sessions have been revoked. You are now only logged in on this device.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('windows') || device.toLowerCase().includes('pc')) {
      return <Laptop className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('mac')) {
      return <Laptop className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Laptop className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Change Password Section - Chuyển sang trang riêng */}
      <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
            <Key className="h-5 w-5 text-[#c3a26c]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">Change Password</h3>
            <p className="text-sm text-stone-500">Update your password regularly to keep your account secure</p>
          </div>
        </div>

        <div className="rounded-xl bg-stone-50 p-4 mb-4">
          <p className="text-sm text-stone-600">
            For security reasons, password changes are handled on a dedicated secure page.
          </p>
        </div>

        <Button
          onClick={handleChangePassword}
          className="rounded-xl bg-[#c3a26c] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition inline-flex items-center gap-2"
        >
          Change Password
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Sessions Section */}
      <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
            <Globe className="h-5 w-5 text-[#c3a26c]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">Active Sessions</h3>
            <p className="text-sm text-stone-500">Manage where you're currently logged in across all your devices</p>
          </div>
        </div>

        {message && (
          <div className={cn(
            "rounded-lg p-3 text-sm flex items-center gap-2 mb-4",
            message.type === 'success' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl transition",
                session.isCurrent ? "bg-[#c3a26c]/10 border border-[#c3a26c]/30" : "bg-white/40"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  session.isCurrent ? "bg-[#c3a26c]/20" : "bg-stone-200"
                )}>
                  {getDeviceIcon(session.device)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-stone-800">
                      {session.browser} on {session.device}
                    </p>
                    {session.isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Current session
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span>IP: {session.ipAddress}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last active: {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>

        {sessions.filter(s => !s.isCurrent).length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200">
            <button
              onClick={handleRevokeAllOtherSessions}
              className="w-full rounded-lg py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              Sign out all other sessions ({sessions.filter(s => !s.isCurrent).length} devices)
            </button>
          </div>
        )}

        <p className="text-xs text-stone-400 mt-4">
          If you don't recognize a device or location, revoke the session immediately and consider changing your password.
        </p>
      </div>
    </div>
  );
}