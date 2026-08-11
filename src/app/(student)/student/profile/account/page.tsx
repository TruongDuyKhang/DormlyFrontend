// app/(student)/profile/account/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfileTabs } from '../_components/profile-tabs';
import { ProfileHeader } from '../_components/profile-header';
import { PersonalInfo } from '../_components/personal-info';
import { AcademicInfo } from '../_components/academic-info';
import { EmergencyContact } from '../_components/emergency-contact';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { tokenService, decodeJWT } from '@/services/tokenService';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { buildingService } from '@/services/buildingService';
import type { Student, EmergencyContact as EmergencyContactType } from '../_components/types';
import { Loader2, Home, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AccountPage() {
  const { profile, isLoading: profileLoading, updateProfile, refetch } = useStudentProfile();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentRoomInfo, setCurrentRoomInfo] = useState<{ roomNumber: string; blockName: string; floorLevel: number } | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(false);

  const loadUserInfo = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const token = tokenService.getAccessToken();
        const decoded = token ? decodeJWT(token) : null;
        const stored = localStorage.getItem('session.user') || localStorage.getItem('user');
        const sessionObj = stored ? JSON.parse(stored) : null;

        setCurrentUser({
          ...sessionObj,
          email: decoded?.email || sessionObj?.email || 'user1@gmail.com',
          fullName: sessionObj?.fullName || decoded?.fullname || 'Phạm Văn Một',
          id: decoded?.id || sessionObj?.id || '',
        });

        // Fetch current room assignment
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
                blockName: bNode?.name || 'Tòa A',
                floorLevel: fNode ? parseInt(fNode.name.replace(/\D/g, '')) || 1 : 1,
              });
            }
          }
        } catch (e) {
          console.warn('Could not fetch current room:', e);
        } finally {
          setLoadingRoom(false);
        }
      } catch (e) {
        console.warn('Could not read user info:', e);
      }
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const student: Student = {
    id: profile?.id || currentUser?.id || '1',
    fullName: currentUser?.fullName || profile?.friendName || 'Phạm Văn Một',
    studentId: profile?.studentCode || 'SV2021001',
    universityEmail: currentUser?.email || 'user1@gmail.com',
    phoneNumber: currentUser?.phoneNumber || '0934567890',
    gender: (currentUser?.gender?.toLowerCase() as any) || 'male',
    dateOfBirth: currentUser?.dateOfBirth || '2003-02-14',
    faculty: 'Khoa Công nghệ Thông tin',
    major: profile?.major || 'Công nghệ Thông tin',
    academicYear: profile?.startYear ? `${new Date().getFullYear() - profile.startYear + 1}` : '4',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'Pham Van Mot')}&background=9d7443&color=fff&size=80`,
  };

  const emergencyContact: EmergencyContactType = {
    name: 'Phụ huynh sinh viên',
    phoneNumber: '0987654321',
    relationship: 'Bố / Mẹ',
  };

  const handleUpdatePersonalInfo = async (updatedData: Partial<Student>) => {
    try {
      if (profile) {
        await updateProfile({
          studentCode: student.studentId,
          major: student.major,
          identityNumber: profile.identityNumber || '079300012345',
          startYear: profile.startYear || 2021,
          endYear: profile.endYear || 2025,
          sleepTime: profile.sleepTime || '23:00',
          wakeUpTime: profile.wakeUpTime || '06:30',
        });
      }
    } catch (err) {
      console.error('Failed to update student profile:', err);
    }
  };

  const isLoading = profileLoading || loadingRoom;

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
            onClick={() => {
              refetch();
              loadUserInfo();
            }}
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
                    Phòng Đang Cư Trú
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Đã Ký Hợp Đồng
                  </span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mt-0.5">
                  Phòng {currentRoomInfo.roomNumber} • {currentRoomInfo.blockName} (Tầng {currentRoomInfo.floorLevel})
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
      </div>
    </div>
  );
}