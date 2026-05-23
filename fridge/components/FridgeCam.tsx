'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  onCapture: (base64: string) => void;
  label?: string;
}

type Facing = 'user' | 'environment';
type Mode = 'live' | 'preview' | 'error';

export default function FridgeCam({ onCapture, label = 'Use Photo' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<Mode>('live');
  const [facing, setFacing] = useState<Facing>('environment');
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(
    async (facingMode: Facing) => {
      stopStream();
      // Guard against navigator.mediaDevices being undefined on HTTP origins
      // (browsers block camera unless served over HTTPS or localhost).
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setError('Camera requires a secure connection (HTTPS). Use the upload button or connect via the tunnel URL.');
        setMode('error');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setMode('live');
        setError(null);
      } catch {
        setError('Camera access denied. Grant permission or upload a photo.');
        setMode('error');
      }
    },
    [stopStream]
  );

  useEffect(() => {
    startStream(facing);
    return () => stopStream();
  }, [facing, startStream, stopStream]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSnapshot(dataUrl);
    setMode('preview');
    stopStream();
  }, [stopStream]);

  const retake = useCallback(() => {
    setSnapshot(null);
    startStream(facing);
  }, [facing, startStream]);

  const confirm = useCallback(() => {
    if (!snapshot) return;
    onCapture(snapshot.split(',')[1]);
  }, [snapshot, onCapture]);

  const switchCamera = useCallback(() => {
    setFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string;
        setSnapshot(dataUrl);
        setMode('preview');
        stopStream();
      };
      reader.readAsDataURL(file);
    },
    [stopStream]
  );

  return (
    <div className="relative bg-black overflow-hidden select-none" style={{ aspectRatio: '4 / 3' }}>
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {mode === 'live' && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {mode === 'preview' && snapshot && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={snapshot}
          alt="Captured fridge"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {mode === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 gap-4 bg-[#0F1C14]">
          <p className="text-sm opacity-80 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-black font-semibold text-sm rounded-btn px-5 py-2.5 active:scale-95 transition-transform"
          >
            Upload photo
          </button>
        </div>
      )}

      {mode === 'live' && (
        <>
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
        </>
      )}

      {mode === 'live' && (
        <button
          type="button"
          onClick={switchCamera}
          aria-label="Switch camera"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center active:scale-90 transition-transform"
        >
          <SwitchIcon />
        </button>
      )}

      {mode === 'live' && (
        <div className="absolute bottom-0 inset-x-0 px-6 py-5 flex items-center justify-between bg-gradient-to-t from-black/65 to-transparent">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload photo"
            className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <UploadIcon />
          </button>

          <button
            type="button"
            onClick={capture}
            aria-label="Capture"
            className="w-[76px] h-[76px] rounded-full bg-white/95 p-[6px] active:scale-90 transition-transform shadow-lg"
          >
            <span className="block w-full h-full rounded-full bg-white ring-[3px] ring-inset ring-black/10" />
          </button>

          <div className="w-11 h-11" aria-hidden="true" />
        </div>
      )}

      {mode === 'preview' && (
        <div className="absolute bottom-0 inset-x-0 px-4 py-4 flex items-center gap-3 bg-gradient-to-t from-black/75 to-transparent">
          <button
            type="button"
            onClick={retake}
            className="flex-1 h-12 rounded-btn bg-white/15 backdrop-blur-sm text-white font-semibold text-sm border border-white/30 active:scale-95 transition-transform"
          >
            Retake
          </button>
          <button
            type="button"
            onClick={confirm}
            className="flex-[2] h-12 rounded-btn bg-primary text-white font-semibold text-sm shadow-card active:scale-95 transition-transform"
          >
            {label}
          </button>
        </div>
      )}
    </div>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positions = {
    tl: 'top-14 left-4 border-t-2 border-l-2 rounded-tl-md',
    tr: 'top-14 right-4 border-t-2 border-r-2 rounded-tr-md',
    bl: 'bottom-24 left-4 border-b-2 border-l-2 rounded-bl-md',
    br: 'bottom-24 right-4 border-b-2 border-r-2 rounded-br-md',
  } as const;
  return (
    <span
      className={`absolute w-6 h-6 border-white/70 pointer-events-none ${positions[pos]}`}
      aria-hidden="true"
    />
  );
}

function SwitchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="7 8 3 12 7 16" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
