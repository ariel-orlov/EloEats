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
      .catch(() => setError('Camera access denied. Grant permission or use upload fallback.'));

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
    onCapture(dataUrl.split(',')[1]); // strip data: prefix
  }, [onCapture]);

  return (
    <div style={{ position: 'relative', background: '#000', borderRadius: 12, overflow: 'hidden' }}>
      {error ? (
        <div style={{ padding: 24, color: '#fff', fontSize: 14 }}>{error}</div>
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
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--green)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
}
