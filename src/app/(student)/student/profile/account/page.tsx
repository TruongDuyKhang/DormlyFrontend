// app/(student)/profile/account/page.tsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { ProfileTabs } from '../_components/profile-tabs';
import { ProfileHeader } from '../_components/profile-header';
import { PersonalInfo } from '../_components/personal-info';
import { AcademicInfo } from '../_components/academic-info';
import { EmergencyContact } from '../_components/emergency-contact';
import { SecuritySettings } from '../_components/security-settings';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { buildingService } from '@/services/buildingService';
import type { Student, EmergencyContact as EmergencyContactType } from '../_components/types';
import { Loader2, Home, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useStudentProfile();
  const { user, isLoading: userLoading, updateUser, refetch: refetchUser } = useCurrentUser();
  const [currentRoomInfo, setCurrentRoomInfo] = useState<{ roomNumber: string; blockName: string; floorLevel: number } | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(false);

  const loadRoomInfo = useCallback(async () => {
    setLoadingRoom(true);
    try {
      const roomAssignment = await roomAssignmentService.getCurrentRoom().catch(() => null);
      if (roomAssignment && roomAssignment.roomNodeId) {
        const allNodes = await buildingService.listNodes().catch(() => []);
        const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
        const rNode = nodeMap.get(roomAssignment.roomNodeId);
        if (rNode) {
          const fNode = rNode.parentId ? nodeMap.get(rNode.parentId) : undefined;
          const bNode = fNode?.parentId ? nodeMap.get(fNode.parentId) : undefined;
          setCurrentRoomInfo({
            roomNumber: rNode.name,
            blockName: bNode?.name || 'Toa A',
            floorLevel: fNode ? parseInt(fNode.name.replace(/\D/g, '')) || 1 : 1,
          });
        }
      }
    } catch (e) {
      console.warn('Could not fetch current room:', e);
    } finally {
      setLoadingRoom(false);
    }
  }, []);

  useEffect(() => {
    loadRoomInfo();
  }, [loadRoomInfo]);

  // Normalize gender from backend (MALE/FEMALE/OTHER) to component format (male/female/other)
  const normalizeGender = (g?: string): 'male' | 'female' | 'other' => {
    const lower = g?.toLowerCase();
    if (lower === 'male') return 'male';
    if (lower === 'female') return 'female';
    return 'other';
  };

  // Normalize dateOfBirth — backend returns LocalDateTime string, keep only YYYY-MM-DD
  const normalizeDob = (dob?: string): string => {
    if (!dob) return '';
    return dob.split('T')[0];
  };

  const student: Student = {
    id: user?.id || profile?.id || '',
    fullName: user?.fullName || '',
    studentId: profile?.studentCode || '',
    universityEmail: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: normalizeGender(user?.gender),
    dateOfBirth: normalizeDob(user?.dateOfBirth),
    faculty: 'Khoa Cong nghe Thong tin',
    major: profile?.major || '',
    academicYear: profile?.startYear
      ? `${new Date().getFullYear() - profile.startYear + 1}`
      : '',
    avatar:
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=9d7443&color=fff&size=80`,
  };

  const emergencyContact: EmergencyContactType = {
    name: 'Phu huynh sinh vien',
    phoneNumber: '—',
    relationship: 'Bo / Me',
  };

  const handleUpdatePersonalInfo = async (updatedData: Partial<Student>) => {
    try {
      const formattedGender = updatedData.gender ? updatedData.gender.toUpperCase() : user?.gender;
      const formattedDob = updatedData.dateOfBirth
        ? updatedData.dateOfBirth.includes('T')
          ? updatedData.dateOfBirth
          : `${updatedData.dateOfBirth}T00:00:00`
        : user?.dateOfBirth;

      await updateUser({
        fullName: updatedData.fullName ?? user?.fullName ?? '',
        phoneNumber: updatedData.phoneNumber ?? user?.phoneNumber ?? '',
        gender: formattedGender as any,
        dateOfBirth: formattedDob as any,
        email: user?.email ?? '',
      });
      toast.success('Cập nhật thông tin cá nhân thành công!');
      await refetchUser();
    } catch (err: any) {
      console.error('Failed to update personal info:', err);
      toast.error('Cập nhật thông tin cá nhân thất bại!');
    }
  };

  const isLoading = profileLoading || userLoading || loadingRoom;

  const handleRefresh = () => {
    refetchProfile();
    refetchUser();
    loadRoomInfo();
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            My Profile
          </p>
          <div className="flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28241f] sm:text-5xl">
              Account
            </h1>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-stone-500 mt-2" />}
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Manage your personal information, academic credentials, and residence assignment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/70 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white transition shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Profile
          </button>
          <ProfileTabs />
        </div>
      </div>

      {/* Residence Assignment Info Card */}
      {currentRoomInfo ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Phong Dang Cu Tru
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Da Ky Hop Dong
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mt-0.5">
                  Phong {currentRoomInfo.roomNumber} &bull; {currentRoomInfo.blockName} (Tang{' '}
                  {currentRoomInfo.floorLevel})
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="space-y-6">
        <ProfileHeader student={student} />
        <PersonalInfo student={student} onUpdate={handleUpdatePersonalInfo} />
        <AcademicInfo student={student} />
        <EmergencyContact contact={emergencyContact} />
        <SecuritySettings user={user} />
      </div>
    </div>
  );
}