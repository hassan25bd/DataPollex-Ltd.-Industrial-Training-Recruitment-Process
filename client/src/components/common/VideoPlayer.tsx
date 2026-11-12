import React, { useMemo } from 'react';
import { Film } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title = 'Lecture Video' }) => {
  const embedInfo = useMemo(() => {
    if (!videoUrl) return null;

    const trimmed = videoUrl.trim();

    // 1. YouTube matching
    // Formats:
    // https://www.youtube.com/watch?v=dQw4w9WgXcQ
    // https://youtu.be/dQw4w9WgXcQ
    // https://www.youtube.com/embed/dQw4w9WgXcQ
    // https://www.youtube.com/shorts/dQw4w9WgXcQ
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = trimmed.match(youtubeRegex);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      };
    }

    // 2. Vimeo matching
    // Format: https://vimeo.com/123456789
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/i;
    const vimeoMatch = trimmed.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'iframe',
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      };
    }

    // 3. Direct HTML5 video file
    if (/\.(mp4|webm|ogg)$/i.test(trimmed)) {
      return {
        type: 'video',
        src: trimmed,
      };
    }

    // 4. Fallback: treat as iframe embed or direct link
    return {
      type: 'iframe',
      src: trimmed,
    };
  }, [videoUrl]);

  if (!videoUrl || !embedInfo) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6">
        <Film className="w-12 h-12 mb-3 text-slate-600" />
        <p className="text-sm font-medium">No video URL provided for this lecture</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative border border-slate-800">
      {embedInfo.type === 'video' ? (
        <video
          key={embedInfo.src}
          src={embedInfo.src}
          controls
          autoPlay
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML5 video tags.
        </video>
      ) : (
        <iframe
          key={embedInfo.src}
          src={embedInfo.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
};
