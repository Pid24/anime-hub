"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
  AlertTriangle,
} from "lucide-react";

type Source = {
  url: string;
  quality: string;
  isM3U8: boolean;
};

type Subtitle = {
  url: string;
  lang: string;
};

interface VideoPlayerProps {
  sources: Source[];
  subtitles?: Subtitle[];
  poster?: string;
  title?: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ sources, subtitles = [], poster, title, onEnded }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuality, setShowQuality] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("default");
  const [volume, setVolume] = useState(1);

  // Find the best source — prefer m3u8
  const getSource = useCallback(
    (quality?: string) => {
      if (quality && quality !== "default") {
        const found = sources.find((s) => s.quality === quality);
        if (found) return found;
      }
      // Prefer "default" quality m3u8, then first m3u8, then any
      return (
        sources.find((s) => s.isM3U8 && s.quality === "default") ||
        sources.find((s) => s.isM3U8) ||
        sources[0]
      );
    },
    [sources]
  );

  // Initialize video source
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sources.length === 0) return;

    setLoading(true);
    setError(null);

    const source = getSource(selectedQuality);
    if (!source) {
      setError("Tidak ada sumber video yang tersedia");
      setLoading(false);
      return;
    }

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (source.isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        // Start with lower quality for faster initial load
        startLevel: -1,
      });

      hls.loadSource(source.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("Gagal memuat video. Coba refresh halaman.");
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (source.isM3U8 && video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = source.url;
      video.addEventListener("loadeddata", () => setLoading(false), { once: true });
    } else {
      // Direct MP4
      video.src = source.url;
      video.addEventListener("loadeddata", () => setLoading(false), { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [sources, selectedQuality, getSource]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onEndedHandler = () => {
      setPlaying(false);
      onEnded?.();
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("ended", onEndedHandler);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("ended", onEndedHandler);
    };
  }, [onEnded]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  // Format time
  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = parseFloat(e.target.value);
    video.volume = v;
    setVolume(v);
    if (v === 0) {
      video.muted = true;
      setMuted(true);
    } else if (muted) {
      video.muted = false;
      setMuted(false);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * duration;
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    setShowQuality(false);
  };

  // Available qualities
  const qualities = sources
    .filter((s) => s.quality !== "default")
    .map((s) => s.quality)
    .filter((v, i, a) => a.indexOf(v) === i);

  if (error) {
    return (
      <div className="video-container aspect-video w-full flex flex-col items-center justify-center gap-3 bg-black/80 rounded-2xl border border-white/10">
        <AlertTriangle className="h-10 w-10 text-rose-400" />
        <p className="text-white/70 text-sm text-center max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="video-container relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10
                 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.08)] group"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlay}
      >
        {subtitles.map((sub, i) => (
          <track
            key={sub.lang}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang.slice(0, 2).toLowerCase()}
            label={sub.lang}
            default={i === 0}
          />
        ))}
      </video>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
        </div>
      )}

      {/* Center Play Button (when paused) */}
      {!playing && !loading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-15 group/play"
        >
          <div
            className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/15 backdrop-blur-sm
                          border border-white/20 flex items-center justify-center
                          transition-all duration-300 group-hover/play:bg-white/25 group-hover/play:scale-110"
          >
            <Play className="h-8 w-8 md:h-10 md:w-10 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        <div className="relative px-3 md:px-4 pb-3 md:pb-4 pt-10">
          {/* Title */}
          {title && (
            <div className="mb-2">
              <p className="text-white/80 text-xs md:text-sm font-medium truncate">{title}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="relative h-1.5 group/progress cursor-pointer mb-2" onClick={seek}>
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
              style={{ width: duration ? `${(buffered / duration) * 100}%` : "0%" }}
            />
            {/* Progress */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 to-fuchsia-400 rounded-full transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
            {/* Track bg */}
            <div className="absolute inset-0 bg-white/10 rounded-full -z-10" />
            {/* Hover indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-lg
                         opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 6px)` : "0" }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-indigo-300 transition-colors" title={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-indigo-300 transition-colors" title={muted ? "Unmute" : "Mute"}>
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-16 transition-all duration-200 accent-indigo-400 h-1 cursor-pointer opacity-0 group-hover/vol:opacity-100"
              />
            </div>

            {/* Time */}
            <span className="text-white/70 text-xs md:text-sm font-mono tabular-nums">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <div className="flex-1" />

            {/* Quality Selector */}
            {qualities.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowQuality(!showQuality)}
                  className="text-white hover:text-indigo-300 transition-colors flex items-center gap-1"
                  title="Kualitas Video"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs hidden md:inline">{selectedQuality === "default" ? "Auto" : selectedQuality}</span>
                </button>
                {showQuality && (
                  <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-xl border border-white/15 rounded-xl py-1.5 min-w-[120px] shadow-2xl">
                    <button
                      onClick={() => handleQualityChange("default")}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors ${
                        selectedQuality === "default" ? "text-indigo-400 font-semibold" : "text-white/80"
                      }`}
                    >
                      Auto
                    </button>
                    {qualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors ${
                          selectedQuality === q ? "text-indigo-400 font-semibold" : "text-white/80"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-indigo-300 transition-colors" title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
