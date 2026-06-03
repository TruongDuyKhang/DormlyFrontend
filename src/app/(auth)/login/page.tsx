"use client";

import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-stone-950 text-stone-950">
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

      <section className="relative z-10 flex min-h-[100dvh] items-center justify-center p-6 lg:ml-auto lg:w-[42%]">
        <div className="relative w-full max-w-[520px] rounded-[32px] bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <header className="mb-8">
            <div className="mb-4 flex justify-center lg:hidden">
              <Image
                src="/logo_black.png"
                alt="Dormly"
                width={96}
                height={38}
                className="object-contain"
              />
            </div>

            <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-gray-900 lg:text-left">
              Welcome back
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500 lg:text-left">
              Sign in to continue to your account
            </p>
          </header>

          <LoginForm />

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm uppercase tracking-wide text-gray-400">
              or
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 underline-offset-4 transition hover:text-blue-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Forgot password?{" "}
              <Link
                href="/forget-password"
                className="font-semibold text-blue-600 underline-offset-4 transition hover:text-blue-700 hover:underline"
              >
                Reset
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}