# Ambient audio

Currently wired to `alexander-nakarada-tavern-loop-one.mp3` — "Tavern Loop
One" by Alexander Nakarada. `components/AudioToggle/AudioToggle.tsx` points
directly at this file.

If this track's license requires attribution (check the terms wherever it
was sourced from before this app goes anywhere public), add the required
credit line here and anywhere else the license calls for it.

To swap in a different track: replace the file and update `AUDIO_SRC` in
`components/AudioToggle/AudioToggle.tsx` to match. Keep it short/compressed —
`AudioToggle` uses `preload="none"`, so it isn't fetched until the user
clicks the toggle, but a smaller file still starts faster once they do.
