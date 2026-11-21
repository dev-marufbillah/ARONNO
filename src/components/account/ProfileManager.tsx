"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { changeAccountPasswordAction, updateAccountProfileAction } from "@/lib/account-actions";
import MotionReveal from "@/components/ui/MotionReveal";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/10";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

export default function ProfileManager({
  profile,
}: {
  profile: {
    name: string;
    email: string;
    phone: string | null;
    role: "CUSTOMER" | "ADMIN";
    isSuperAdmin: boolean;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileStatus("");
    const result = await updateAccountProfileAction({ name, phone });
    setSavingProfile(false);
    if (!result.success) {
      setProfileError(result.error ?? "Could not update your profile.");
      return;
    }
    setProfileStatus("Profile updated.");
    router.refresh();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSavingPassword(true);
    setPasswordError("");
    setPasswordStatus("");
    const result = await changeAccountPasswordAction({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });
    setSavingPassword(false);
    if (!result.success) {
      setPasswordError(result.error ?? "Could not change your password.");
      return;
    }
    form.reset();
    setPasswordStatus("Password changed successfully.");
  }

  return (
    <div className="space-y-6">
      <MotionReveal>
      <section className="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-[#F6F1E8] p-2.5 text-[#9A7741]">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-3xl text-black-deep">My Profile</h1>
              <p className="mt-1 text-xs text-black/50">Manage your account details and sign-in security.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C4A265]/40 bg-[#C4A265]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#80602B]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {profile.isSuperAdmin ? "Super Admin" : profile.role === "ADMIN" ? "Admin" : "Customer"}
          </span>
        </div>

        <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass}>Name</span>
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={80} />
          </label>
          <label>
            <span className={labelClass}>Email</span>
            <input className={`${inputClass} bg-neutral-50 text-neutral-500`} value={profile.email} readOnly />
          </label>
          <label>
            <span className={labelClass}>Phone</span>
            <input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-700 disabled:opacity-50 md:w-auto"
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </div>
          {profileError ? <p role="alert" className="text-sm text-red-600 md:col-span-2">{profileError}</p> : null}
          {profileStatus ? <p role="status" className="text-sm text-emerald-700 md:col-span-2">{profileStatus}</p> : null}
        </form>
      </section>
      </MotionReveal>

      <MotionReveal delay={0.1}>
      <section className="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-8">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-[#F6F1E8] p-2.5 text-[#9A7741]">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif text-2xl text-black-deep">Change password</h2>
            <p className="mt-1 text-xs text-black/50">Use a unique password to keep your account protected.</p>
          </div>
        </div>
        <form onSubmit={changePassword} className="mt-5 grid gap-4 md:grid-cols-3">
          <label>
            <span className={labelClass}>Current password</span>
            <input className={inputClass} type="password" name="currentPassword" autoComplete="current-password" minLength={8} required />
          </label>
          <label>
            <span className={labelClass}>New password</span>
            <input className={inputClass} type="password" name="newPassword" autoComplete="new-password" minLength={12} required />
          </label>
          <label>
            <span className={labelClass}>Confirm new password</span>
            <input className={inputClass} type="password" name="confirmPassword" autoComplete="new-password" minLength={12} required />
          </label>
          {passwordError ? <p role="alert" className="text-sm text-red-600 md:col-span-3">{passwordError}</p> : null}
          {passwordStatus ? <p role="status" className="text-sm text-emerald-700 md:col-span-3">{passwordStatus}</p> : null}
          <button
            type="submit"
            disabled={savingPassword}
            className="rounded-lg border border-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50 md:col-span-3 md:w-fit"
          >
            {savingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
      </MotionReveal>
    </div>
  );
}
