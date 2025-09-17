import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onFinished: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinished }) => {
  const [exiting, setExiting] = useState(false);

  const handleVideoEnd = () => {
    setExiting(true);
    // Match the animation duration (800ms)
    setTimeout(() => {
      onFinished();
    }, 800);
  };
  
  // A failsafe in case video fails to load or play
  useEffect(() => {
    // New video is ~8s long, let's set a 10s timeout
    const failsafeTimer = setTimeout(() => {
       console.warn("Intro video took too long or failed to play. Skipping.");
       onFinished();
    }, 10000); 

    return () => clearTimeout(failsafeTimer);
  }, [onFinished]);


  return (
    <>
      <style>{`
        @keyframes zoom-out-intense {
          from {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
          to {
            transform: scale(2.5);
            opacity: 0;
            filter: blur(8px);
          }
        }
        .animate-zoom-out {
          animation: zoom-out-intense 0.8s ease-in forwards;
        }
      `}</style>
      <div className={`fixed inset-0 bg-dark-primary flex items-center justify-center z-[100] ${exiting ? 'animate-zoom-out' : ''}`}>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/zona-clic-admin.firebasestorage.app/o/vape%20del%20este%2FWhatsApp%20Video%202025-09-07%20at%2012.58.04%20PM.mp4?alt=media&token=c31ac120-6926-420c-b1cd-f2ccff39161a"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoEnd} // Also skip if video fails to load
        />
        {/* The logo is part of the new video, so the img element is no longer needed. */}
      </div>
    </>
  );
};
