// app/(platform)/platform/_components/header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BellRing,
  LogOut,
  Menu,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar';
import { Button } from '@/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/_components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover';
import { LanguageSwitcher } from '@/_components/LanguageSwitcher';
import { tokenService, decodeJWT } from '@/services/tokenService';
import { useAuth } from '@/app/(auth)/context/auth-context';

interface HeaderProps {
  onMenuClick?: () => void;
}

import { announcementService } from '@/services/announcementService';

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [liveNotifs, setLiveNotifs] = useState<Array<{ title: string; message: string; time: string; urgent: boolean }>>([
    {
      title: 'Hệ thống vận hành',
      message: 'Toàn bộ 3 Tòa nhà A, B, C và 120 phòng đang hoạt động bình thường.',
      time: 'Vừa xong',
      urgent: false,
    },
    {
      title: 'Tiếp nhận hồ sơ sinh viên',
      message: 'Hệ thống sẵn sàng duyệt hồ sơ và phân phòng tự động.',
      time: '15 phút trước',
      urgent: false,
    }
  ]);
  const [language, setLanguage] = useState({ code: 'en', label: 'English' });
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    role: string;
    initials: string;
  }>({
    fullName: 'Administrator',
    email: 'admin@dormly.com',
    role: 'System Administrator',
    initials: 'AD',
  });

  useEffect(() => {
    announcementService.getAll().then((data: any) => {
      if (data && data.length > 0) {
        setLiveNotifs(
          data.map((item: any) => ({
            title: item.title || 'Thông báo KTX',
            message: item.content || item.description || 'Thông báo mới từ Ban Quản trị',
            time: new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            urgent: item.priority === 'CRITICAL' || item.priority === 'HIGH',
          }))
        );
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('dormly_language');
    if (savedLang) {
      setLanguage(savedLang === 'en' ? { code: 'en', label: 'English' } : { code: 'vi', label: 'Tiếng Việt' });
    }

    try {
      const token = tokenService.getAccessToken();
      const decoded = token ? decodeJWT(token) : null;
      const stored = localStorage.getItem('session.user') || localStorage.getItem('user');
      const sessionObj = stored ? JSON.parse(stored) : null;

      const name = sessionObj?.fullName || decoded?.fullname || 'Admin';
      const email = sessionObj?.email || decoded?.email || 'admin@dormly.com';
      const roleStr = Array.isArray(sessionObj?.roles)
        ? sessionObj.roles[0]?.replace('ROLE_', '')
        : Array.isArray(decoded?.roles)
        ? decoded.roles[0]?.replace('ROLE_', '')
        : 'Administrator';

      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD';

      setUserData({
        fullName: name,
        email,
        role: roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase(),
        initials,
      });
    } catch (e) {
      console.warn('Could not read user profile for header:', e);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode === 'en' ? { code: 'en', label: 'English' } : { code: 'vi', label: 'Tiếng Việt' });
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    router.push('/platform/profile');
  };

  const formattedDate = mounted
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <header className="sticky top-0 z-30 border-b border-white/45 bg-[#e8e2d8]/78 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-3 sm:px-5 lg:px-7">
        {/* Left section */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-stone-600 hover:bg-white/45 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
              <ShieldCheck className="h-3.5 w-3.5 text-[#b08b59]" />
              <span className="truncate">Admin Operations</span>
            </div>
            <p className="truncate text-xs font-medium text-stone-700 sm:text-sm">
              Command Center &bull; {formattedDate}
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher variant="header" />

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full border border-white/45 bg-white/28 text-stone-700 hover:bg-white/45"
              >
                <BellRing className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#c3a26c]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 border-white/60 bg-[#f3eee6]/95 p-0 text-stone-800 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-stone-200/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Operations Feed
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-800">Operational Updates</p>
              </div>
              <div className="divide-y divide-stone-200/70 max-h-80 overflow-y-auto">
                {liveNotifs.map((notif, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-3 text-left transition hover:bg-white/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-stone-800">{notif.title}</p>
                        {notif.urgent && (
                          <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-400">{notif.time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-stone-500">{notif.message}</p>
                  </button>
                ))}
              </div>
              <div className="mt-2 px-3 py-2 border-t border-stone-200">
                <button className="w-full text-center text-xs font-semibold text-[#c3a26c] hover:underline">
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 gap-2 rounded-full border border-white/45 bg-white/28 px-2 pr-3 text-stone-700 hover:bg-white/45"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=9d7443&color=fff&size=64`} alt={userData.fullName} />
                  <AvatarFallback className="bg-stone-800 text-xs font-semibold text-stone-100">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left md:block">
                  <span className="block text-sm font-semibold leading-none text-stone-800">
                    {userData.fullName}
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">{userData.role}</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/60 bg-[#f3eee6]/95 text-stone-800 shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-stone-800 text-xs font-semibold text-stone-100">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{userData.fullName}</p>
                  <p className="text-xs text-stone-500">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleProfile}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}