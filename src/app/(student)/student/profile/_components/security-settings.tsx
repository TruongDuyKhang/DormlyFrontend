// app/(student)/profile/_components/security-settings.tsx
"use client";

import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { userService } from "@/services/userService";
import type { UserResponseDto } from "@/types/models";
import { toast } from "sonner";

interface SecuritySettingsProps {
  user?: UserResponseDto | null;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp!");
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.updatePassword(user.id, {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Đổi mật khẩu tài khoản thành công!");
      setIsOpen(false);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại, vui lòng kiểm tra lại mật khẩu cũ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b pb-3">
        <Shield className="h-5 w-5 text-[#9d7443]" />
        <h3 className="text-lg font-bold text-stone-900">Security & Credentials</h3>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:border-[#9d7443]/30 hover:bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9d7443]/15 text-[#9d7443]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">Đổi Mật Khẩu Tài Khoản</p>
            <p className="mt-0.5 text-xs text-stone-500">Cập nhật mật khẩu đăng nhập cá nhân định kỳ để đảm bảo an toàn</p>
          </div>
        </div>
        <button
          onClick={handleOpen}
          className="rounded-xl bg-[#9d7443] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#856035] transition"
        >
          Đổi Mật Khẩu
        </button>
      </div>

      {/* Change Password Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#9d7443]" />
                Đổi Mật Khẩu Sinh Viên
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mật khẩu hiện tại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 pr-10 text-sm focus:border-[#9d7443] focus:outline-none"
                    placeholder="Nhập mật khẩu cũ..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 pr-10 text-sm focus:border-[#9d7443] focus:outline-none"
                    placeholder="Tối thiểu 6 ký tự..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#9d7443] focus:outline-none"
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !oldPassword || !newPassword || !confirmPassword}
                  className="flex items-center gap-1.5 rounded-xl bg-[#9d7443] px-5 py-2 text-xs font-semibold text-white hover:bg-[#856035] transition disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Xác nhận đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}