import { useEffect } from 'react';
import type { RemoteAudioTrack } from 'livekit-client';

type HiddenAudioPlayerProps = {
  track: RemoteAudioTrack;
};

export default function HiddenAudioPlayer({ track }: HiddenAudioPlayerProps) {
  useEffect(() => {
    const audio = new Audio();
    track.attach(audio);
    audio.play();

    return () => {
      track.detach();
    };
  }, [track]);

  return null;
}
