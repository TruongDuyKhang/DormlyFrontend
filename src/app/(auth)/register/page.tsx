// app/(auth)/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-y-auto bg-stone-950 text-stone-950">
      <img
        src="/background.gif"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />

      <div className="absolute left-6 top-6">
        <Image
          src="/logo_black.png"
          alt="Dormly"
          width={120}
          height={48}
          className="h-12 w-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.32)]"
          priority
        />
      </div>

      <section className="relative z-10 flex min-h-[100dvh] items-center justify-center p-6 lg:ml-auto lg:w-[55%]">
        <div className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-[32px] bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <header className="mb-6">
            <div className="mb-4 flex justify-center lg:hidden">
              <Image
                src="/logo_black.png"
                alt="Dormly"
                width={96}
                height={38}
                className="object-contain"
              />
            </div>

            <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 lg:text-left">
              Create your account
            </h2>

            <p className="mt-1 text-center text-sm text-gray-500 lg:text-left">
              Join Dormly and start your smart living journey
            </p>
          </header>

          <RegisterForm />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm uppercase tracking-wide text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 underline-offset-4 transition hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}