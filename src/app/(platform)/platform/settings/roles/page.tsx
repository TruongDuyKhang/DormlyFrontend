// app/(platform)/platform/settings/roles/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, Plus, Edit2, Trash2, Check, RefreshCw, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rbacService } from '@/services/rbacService';
import type { RoleResponseDto, PermissionResponseDto } from '@/types/models';

export default function RolesPermissionsPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const [rolesRes, permsRes] = await Promise.allSettled([
        rbacService.listRoles(),
        rbacService.listPermissions(),
      ]);

      setRoles(rolesRes.status === 'fulfilled' ? rolesRes.value : []);
      setPermissions(permsRes.status === 'fulfilled' ? permsRes.value : []);
    } catch (e) {
      console.error('Failed to load RBAC data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
              <ShieldCheck className="h-3.5 w-3.5" />
              Access Control
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Roles & Permissions
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage system security roles, feature privileges, and user access matrix.
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
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-2 border-b border-stone-300 pb-3">
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
            Roles ({roles.length})
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
