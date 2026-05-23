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

function FridgeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-white/80"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="5" y1="9" x2="19" y2="9" />
      <line x1="9" y1="14" x2="9" y2="17" />
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
    <main className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* ── Left panel: green brand column ── */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b lg:bg-gradient-to-br from-primary to-primary-mid w-full lg:w-1/2 px-10 py-12 lg:px-16 lg:py-16 min-h-[260px] lg:min-h-screen">
        {/* Decorative blurred circles */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        {/* Logo + tagline */}
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
              <FridgeIcon />
            </div>
            <span className="text-white font-extrabold text-3xl lg:text-4xl tracking-tight leading-none">
              FridgeWise
            </span>
          </div>
          <p className="text-white/80 text-lg lg:text-xl font-medium mt-1">
            Eat well. Beat your friends.
          </p>
        </div>

        {/* Bottom stat — hidden on mobile to keep header compact */}
        <div className="relative z-10 hidden lg:flex items-center gap-2 mt-auto">
          <div className="flex -space-x-2">
            {['#52b788', '#40916c', '#74c69d'].map((color, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: color }}
              >
                {['A', 'B', 'C'][i]}
              </div>
            ))}
          </div>
          <p className="text-white/70 text-sm font-medium">
            30,000+ healthy meals logged
          </p>
        </div>
      </div>

      {/* ── Right panel: sign-in card ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 bg-bg">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-surface rounded-card shadow-card px-8 py-10 flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-text font-bold text-2xl leading-tight">
                Welcome back
              </h1>
              <p className="text-text-muted text-sm leading-relaxed">
                Sign in to track your fridge and compete.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Auth buttons */}
            <div className="flex flex-col gap-3">
              {/* Apple */}
              <button
                onClick={handleAppleSignIn}
                className="flex items-center justify-center gap-3 w-full bg-[#000] hover:bg-[#1a1a1a] active:bg-[#111] text-white font-semibold text-sm rounded-btn h-12 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <AppleLogo />
                Sign in with Apple
              </button>

              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 w-full bg-surface hover:bg-gray-50 active:bg-gray-100 text-text font-semibold text-sm rounded-btn h-12 border border-border transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <GoogleLogo />
                Sign in with Google
              </button>
            </div>

            {/* Legal */}
            <p className="text-center text-text-muted text-[11px] leading-relaxed">
              By signing in you agree to our{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-text transition-colors">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-text transition-colors">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {/* Below-card social proof — visible on mobile where left panel stat is hidden */}
          <p className="lg:hidden text-center text-text-muted text-xs mt-6">
            30,000+ healthy meals logged
          </p>
        </div>
      </div>
    </main>
  );
}
