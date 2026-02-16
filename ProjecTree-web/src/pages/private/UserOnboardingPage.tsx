import { BrandPanel, ProfileForm } from '@/features/user-onboarding';

export default function UserOnboardingPage() {
  return (
    <div className="flex min-h-screen w-full font-sans text-slate-900 font-normal bg-white">
      <BrandPanel />
      <ProfileForm />
    </div>
  );
}
