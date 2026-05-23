'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  onCapture: (base64: string) => void;
  label?: string;
}

export default function FridgeCam({ onCapture, label = 'Capture' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      })
      .catch(() => setError('Camera access denied. Grant permission to continue.'));

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(dataUrl.split(',')[1]);
  }, [onCapture]);

  return (
    <div style={{ position: 'relative', background: '#0F1C14', borderRadius: 16, overflow: 'hidden' }}>
      {error ? (
        <div style={{ padding: '24px', color: '#96AEA7', fontSize: 14, lineHeight: 1.5 }}>
          {error}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', display: 'block' }}
        />
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {ready && (
        <button
          onClick={capture}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #1B6B45 0%, #2E9060 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: 15,
            fontFamily: '"DM Sans", sans-serif',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(27,107,69,0.4)',
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
}
