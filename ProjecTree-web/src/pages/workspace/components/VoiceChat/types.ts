import type { RemoteTrackPublication } from 'livekit-client';

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
  isMuted: boolean;
};

export type UseVoiceChatProps = {
  workspaceId: string;
};
