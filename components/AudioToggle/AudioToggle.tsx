"use client";

import { useRef, useState } from "react";
import { TorchIcon } from "@/components/icons/TorchIcon";
import styles from "./AudioToggle.module.css";

// "Tavern Loop One" by Alexander Nakarada (see public/audio/README.md for
// attribution/license notes). Off by default, and only ever starts playing
// in direct response to this click — never autoplay.
const AUDIO_SRC = "/audio/alexander-nakarada-tavern-loop-one.mp3";

export function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!enabled) {
      audio?.play().catch(() => {
        // No track loaded yet, or the browser blocked it — the button
        // still flips so its state stays honest about user intent.
      });
    } else {
      audio?.pause();
    }
    setEnabled((current) => !current);
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        className={styles.toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "Mute ambient music" : "Play ambient music"}
        title={enabled ? "Mute ambient music" : "Play ambient music"}
      >
        <TorchIcon lit={enabled} className={styles.icon} />
      </button>
    </>
  );
}
