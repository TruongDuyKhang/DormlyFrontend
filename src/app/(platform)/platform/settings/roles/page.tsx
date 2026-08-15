// app/(platform)/platform/settings/roles/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  KeyRound,
  Users,
  UserCog,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  Loader2,
  Save,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { rbacService } from '@/services/rbacService';
import { userService } from '@/services/userService';
import type { RoleResponseDto, PermissionResponseDto, UserResponseDto } from '@/types/models';

type TabType = 'user-roles' | 'roles' | 'permissions';

export default function RolesPermissionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('user-roles');
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User Roles Search & Modal State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [userRoleSelection, setUserRoleSelection] = useState<string[]>([]);
  const [isSavingUserRoles, setIsSavingUserRoles] = useState(false);

  // Role Form Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponseDto | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissionIds: [] as string[] });

  // Permission Form Modal State
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState<PermissionResponseDto | null>(null);
  const [permForm, setPermForm] = useState({ name: '', description: '', code: '' });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes, permsRes] = await Promise.allSettled([
        userService.list(),
        rbacService.listRoles(),
        rbacService.listPermissions(),
      ]);

      setUsers(usersRes.status === 'fulfilled' && Array.isArray(usersRes.value) ? usersRes.value : []);
      setRoles(rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value) ? rolesRes.value : []);
      setPermissions(permsRes.status === 'fulfilled' && Array.isArray(permsRes.value) ? permsRes.value : []);
    } catch (e) {
      console.error('Failed to load RBAC & Users data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Save User Roles
  const handleSaveUserRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingUserRoles(true);
    try {
      const updatedUser = await userService.update(editingUser.id, {
        email: editingUser.email,
        fullName: editingUser.fullName,
        phoneNumber: editingUser.phoneNumber,
        gender: editingUser.gender as any,
        isActive: editingUser.isActive,
        roles: userRoleSelection,
      } as any);

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, roles: updatedUser.roles || userRoleSelection } : u))
      );
      setIsUserModalOpen(false);
    } catch (e) {
      console.error('Failed to update user roles:', e);
    } finally {
      setIsSavingUserRoles(false);
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        const res = await rbacService.updateRole(editingRole.id, roleForm);
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? res : r)));
      } else {
        const res = await rbacService.createRole(roleForm);
        setRoles((prev) => [...prev, res]);
      }
      setIsRoleModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await rbacService.deleteRole(id);
        setRoles((prev) => prev.filter((r) => r.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSavePerm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPerm) {
        const res = await rbacService.updatePermission(editingPerm.id, permForm);
        setPermissions((prev) => prev.map((p) => (p.id === editingPerm.id ? res : p)));
      } else {
        const res = await rbacService.createPermission(permForm);
        setPermissions((prev) => [...prev, res]);
      }
      setIsPermModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePerm = async (id: string) => {
    if (confirm('Are you sure you want to delete this permission?')) {
      try {
        await rbacService.deletePermission(id);
        setPermissions((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      Array.from(u.roles || []).some((r) => r.toLowerCase().includes(q))
    );
  });

  // Dynamically load system roles strictly from Backend API (/api/roles)
  const beRoleNames = (roles || []).map((r) => r.name).filter(Boolean);
  const userAssignedRoles = Array.from(editingUser?.roles || []);
  const availableRoleNames = Array.from(
    new Set(
      beRoleNames.length > 0
        ? [...beRoleNames, ...userAssignedRoles]
        : userAssignedRoles
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c3a26c]" />
              Access Control & Role Management
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Roles & Permissions
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Phân quyền người dùng, quản lý vai trò hệ thống và các đặc quyền truy cập.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition shadow-sm"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync API
            </button>
            {activeTab !== 'user-roles' && (
              <button
                onClick={() => {
                  if (activeTab === 'roles') {
                    setEditingRole(null);
                    setRoleForm({ name: '', description: '', permissionIds: [] });
                    setIsRoleModalOpen(true);
                  } else {
                    setEditingPerm(null);
                    setPermForm({ name: '', description: '', code: '' });
                    setIsPermModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                {activeTab === 'roles' ? 'Create Role' : 'Add Permission'}
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-300 pb-3">
          <button
            onClick={() => setActiveTab('user-roles')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeTab === 'user-roles'
                ? 'bg-white/60 text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            )}
          >
            <Users className="h-4 w-4 text-[#c3a26c]" />
            User Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeTab === 'roles'
                ? 'bg-white/60 text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            System Roles ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeTab === 'permissions'
                ? 'bg-white/60 text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            )}
          >
            <KeyRound className="h-4 w-4" />
            Permissions ({permissions.length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading security controls from backend...</span>
          </div>
        ) : activeTab === 'user-roles' ? (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng theo tên, email, vai trò..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-sm focus:border-[#c3a26c] focus:outline-none backdrop-blur-sm"
                />
              </div>
              <p className="text-xs text-stone-500">
                Hiển thị {filteredUsers.length} trên tổng số {users.length} tài khoản
              </p>
            </div>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => {
                const userRolesList = Array.from(u.roles || []);
                return (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur-sm shadow-sm hover:border-[#c3a26c]/60 transition space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c3a26c]/20 text-[#8b6935] font-bold text-base">
                            {(u.fullName || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 text-sm">{u.fullName || 'User Account'}</h3>
                            <p className="text-xs text-stone-500">{u.email}</p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                            u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          )}
                        >
                          {u.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/40 space-y-2">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Assigned Roles ({userRolesList.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {userRolesList.map((r) => (
                            <span
                              key={r}
                              className={cn(
                                'rounded-lg px-2.5 py-1 text-xs font-bold shadow-xs',
                                r === 'ADMIN'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : r === 'MANAGER'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-stone-100 text-stone-800 border border-stone-200'
                              )}
                            >
                              {r}
                            </span>
                          ))}
                          {userRolesList.length === 0 && (
                            <span className="text-xs text-stone-400 italic">No roles assigned</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/30 flex justify-end">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setUserRoleSelection(Array.from(u.roles || []));
                          setIsUserModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-white transition shadow-xs"
                      >
                        <UserCog className="h-3.5 w-3.5 text-[#c3a26c]" />
                        Phân vai trò
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'roles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur-sm shadow-sm hover:border-[#c3a26c]/60 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/10 text-[#c3a26c]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800 text-base">{role.name}</h3>
                      <span className="text-xs font-mono text-stone-500">{role.description || 'System Role'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingRole(role);
                        setRoleForm({
                          name: role.name,
                          description: role.description || '',
                          permissionIds: (role.permissions || []).map((p) => p.id),
                        });
                        setIsRoleModalOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-white/60 hover:text-stone-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/40">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Granted Permissions ({role.permissions?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {(role.permissions || []).map((p) => (
                      <span
                        key={p.id}
                        className="rounded-md bg-white/60 px-2 py-0.5 text-[11px] font-medium text-stone-700 border border-stone-200/50"
                      >
                        {p.name}
                      </span>
                    ))}
                    {(!role.permissions || role.permissions.length === 0) && (
                      <span className="text-xs text-stone-400">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-800">{perm.name}</h4>
                    <p className="text-xs text-stone-500">{perm.description || perm.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingPerm(perm);
                      setPermForm({
                        name: perm.name,
                        description: perm.description || '',
                        code: (perm as any).code || '',
                      });
                      setIsPermModalOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-white/60 hover:text-stone-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePerm(perm.id)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Role Modal */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-stone-800">Phân Vai Trò Người Dùng</h3>
                <p className="text-xs text-stone-500">{editingUser.fullName} ({editingUser.email})</p>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserRoles} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Chọn Vai Trò (Roles)</label>
                <div className="space-y-2 max-h-60 overflow-y-auto p-3 border rounded-xl bg-stone-50">
                  {availableRoleNames.map((rName) => {
                    const isChecked = userRoleSelection.includes(rName);
                    return (
                      <label
                        key={rName}
                        className="flex items-center justify-between p-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUserRoleSelection([...userRoleSelection, rName]);
                              } else {
                                setUserRoleSelection(userRoleSelection.filter((r) => r !== rName));
                              }
                            }}
                            className="h-4 w-4 rounded text-[#c3a26c] focus:ring-[#c3a26c]"
                          />
                          <span className="text-sm font-bold text-stone-800">{rName}</span>
                        </div>
                        <span className="text-xs text-stone-400 font-mono">ROLE</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingUserRoles}
                  className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] disabled:opacity-50"
                >
                  {isSavingUserRoles ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Lưu Vai Trò
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Form Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-800">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. ROLE_MANAGER"
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="e.g. Building manager with room management rights"
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Assign Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-xl bg-stone-50">
                  {permissions.map((p) => {
                    const isChecked = roleForm.permissionIds.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRoleForm({ ...roleForm, permissionIds: [...roleForm.permissionIds, p.id] });
                            } else {
                              setRoleForm({ ...roleForm, permissionIds: roleForm.permissionIds.filter((id) => id !== p.id) });
                            }
                          }}
                          className="rounded text-[#c3a26c] focus:ring-[#c3a26c]"
                        />
                        <span className="truncate">{p.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a]"
                >
                  <Save className="h-4 w-4" />
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Form Modal */}
      {isPermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-800">
                {editingPerm ? 'Edit Permission' : 'Add New Permission'}
              </h3>
              <button onClick={() => setIsPermModalOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePerm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Permission Name</label>
                <input
                  type="text"
                  required
                  value={permForm.name}
                  onChange={(e) => setPermForm({ ...permForm, name: e.target.value })}
                  placeholder="e.g. ROOM_ASSIGN"
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  value={permForm.description}
                  onChange={(e) => setPermForm({ ...permForm, description: e.target.value })}
                  placeholder="e.g. Permission to assign rooms to students"
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPermModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a]"
                >
                  <Save className="h-4 w-4" />
                  Save Permission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

