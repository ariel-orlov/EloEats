'use client';

import { useRouter } from 'next/navigation';

function AppleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 814 1000"
      className="w-5 h-5 fill-white shrink-0"
      aria-hidden="true"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-162.1-140.4C555.6 771.5 472.4 700 398.2 700c-59.6 0-112.8 38.3-165.1 76.7-63 47-124.5 95-187.3 95-25.3 0-49-6.5-70.1-20.1C-24.1 851.5-7.3 799.3 2.7 779c14-29.4 43.5-92.3 43.5-179.9 0-69.8-29.4-147.1-89.8-210.3-5.7-6.1-13.9-14.9-13.9-23.5v-.5c0-9.7 14.9-50.4 43.5-89.4 19.4-26.9 41.5-52.8 66.7-70.4 37.7-26.3 78.5-40.4 121-40.4 42.5 0 80.1 14.4 112.8 42.5 22.6 19.9 42.4 43.8 60 69.8 14.4 21.4 28.5 44.9 44.2 65.4h.7c32.5-47 71.3-94.9 121.7-125.7 47-28.5 98.5-42.4 153.5-42.4 99.3 0 174.1 62.2 213.6 157.6 4.5 10.3 8.3 21.2 10.5 32.5z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  function handleAppleSignIn() {
    console.log('Apple sign-in initiated');
    router.push('/home');
  }

  function handleGoogleSignIn() {
    console.log('Google sign-in initiated');
    router.push('/home');
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-bg overflow-hidden">

      {/* ── Mobile: stacked layout ── */}
      {/* ── Desktop: left green panel ── */}
      <div
        className="relative flex flex-col justify-end lg:justify-center overflow-hidden w-full lg:w-1/2 min-h-[45vh] lg:min-h-screen"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, #2d8f5e 0%, #1a6b45 55%, #124d32 100%)',
        }}
      >
        {/* Subtle radial highlight near top-left */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.10) 0%, transparent 60%)',
          }}
        />

        {/* Wordmark — centered on desktop, bottom-left on mobile */}
        <div className="relative z-10 px-8 pb-10 lg:px-16 lg:pb-0 lg:text-center">
          <p className="text-white/60 text-sm font-medium tracking-wide mb-2 lg:mb-3">
            Your fridge, scored.
          </p>
          <h1
            className="text-white font-extrabold leading-none"
            style={{ fontSize: 'clamp(40px, 8vw, 64px)', letterSpacing: '-0.03em' }}
          >
            FridgeWise
          </h1>
          <p className="text-white/50 text-sm font-normal mt-3 hidden lg:block">
            Eat well. Beat your friends.
          </p>
        </div>
      </div>

      {/* ── Mobile: sign-in card slides up with rounded top corners ── */}
      {/* ── Desktop: right white panel ── */}
      <div
        className="
          relative flex flex-1 items-start lg:items-center justify-center
          bg-bg lg:bg-white
          rounded-t-3xl lg:rounded-none
          -mt-6 lg:mt-0
          shadow-[0_-4px_24px_rgba(0,0,0,0.07)] lg:shadow-none
          px-6 pt-8 pb-10 lg:px-12 lg:py-16
          animate-[slideUp_0.35s_cubic-bezier(0.22,1,0.36,1)_both]
          lg:animate-none
        "
        style={{
          // keyframe defined inline via style; works as a CSS animation
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(32px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <div className="w-full max-w-sm">
          {/* Pill handle — mobile only */}
          <div className="lg:hidden w-10 h-1 rounded-full bg-border mx-auto mb-8" />

          {/* Heading */}
          <div className="mb-7">
            <h2
              className="text-text font-bold leading-tight"
              style={{ fontSize: '24px', letterSpacing: '-0.02em' }}
            >
              Welcome back
            </h2>
            <p className="text-text-muted text-sm mt-1.5 leading-relaxed">
              Sign in to track your fridge and compete.
            </p>
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col gap-3">
            {/* Apple */}
            <button
              onClick={handleAppleSignIn}
              className="flex items-center justify-center gap-3 w-full bg-[#000] hover:bg-[#1c1c1e] active:bg-[#111] text-white font-semibold text-[15px] rounded-btn transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              style={{ height: '52px' }}
            >
              <AppleLogo />
              Sign in with Apple
            </button>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full bg-surface hover:bg-[#f7f8f7] active:bg-[#f0f2f0] text-text font-semibold text-[15px] rounded-btn border border-border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              style={{ height: '52px' }}
            >
              <GoogleLogo />
              Sign in with Google
            </button>
          </div>

          {/* Legal */}
          <p className="text-center mt-6 leading-relaxed" style={{ color: '#9eada8', fontSize: '11px' }}>
            By signing in you agree to our{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-text-muted transition-colors">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-text-muted transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
