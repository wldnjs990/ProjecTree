import { LoginIntro, SocialLoginBtns } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full font-sans text-slate-900 font-normal">
      {/* 1. Left Panel (Brand Area) */}
      <LoginIntro />

      {/* 2. Right Panel (Action Area) */}
      <SocialLoginBtns />
    </div>
  );
}
