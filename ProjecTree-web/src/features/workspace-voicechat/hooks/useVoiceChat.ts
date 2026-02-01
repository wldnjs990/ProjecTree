/**
 * useVoiceChat Hook
 *
 * LiveKit를 사용한 음성 채팅 기능을 제공하는 커스텀 훅
 *
 * 주요 기능:
 * - LiveKit 서버 연결/해제
 * - 원격 참가자 오디오 트랙 관리
 * - 마이크 음소거/해제
 * - 연결 상태 관리
 * - 에러 처리
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  Participant,
  Track,
  TrackPublication,
  ConnectionState,
} from 'livekit-client';
import type {
  TrackInfo,
  UseVoiceChatProps,
} from '@/features/workspace-voicechat/types/types';

const LIVEKIT_URL = `wss://i14d107.p.ssafy.io/livekit`;
// import.meta.env.VITE_LIVEKIT_URL ||
// (window.location.hostname === 'localhost'
//   ? 'ws://localhost:7880'
//   : `wss://${window.location.hostname}:7880`);

/**
 * 백엔드 서버 주소
 * - 환경변수 VITE_API_URL 사용 가능
 * - 기본값: http://localhost:8080/
 */
// const APPLICATION_SERVER_URL =
//   import.meta.env.VITE_API_URL || 'http://localhost:8080/api/';

const APPLICATION_SERVER_URL = `https://i14d107.p.ssafy.io/api/`;

export function useVoiceChat({ workspaceId }: UseVoiceChatProps) {
  // LiveKit Room 인스턴스
  const [room, setRoom] = useState<Room | undefined>(undefined);

  // 원격 참가자들의 오디오 트랙 목록
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  // 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // useState 사용 - React 렌더링 사이클과 동기화 (UI 상태 반영)
  const [isLeaving, setIsLeaving] = useState(false);

  // 마이크 활성화 상태
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 현재 말하고 있는 참가자 ID 목록
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);

  // 참가자 이름 (임시로 랜덤 생성, 실제로는 사용자 정보 사용)
  const [participantName] = useState(
    `User_${Math.floor(Math.random() * 1000)}`
  );

  /**
   * 백엔드 서버에서 LiveKit 접속 토큰 가져오기
   * @param roomName 방 이름 (워크스페이스 ID)
   * @param participantName 참가자 이름
   * @returns LiveKit 접속 토큰
   */
  const getToken = async (roomName: string, participantName: string) => {
    try {
      const response = await fetch(`${APPLICATION_SERVER_URL}voice/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) {
        throw new Error('Failed to get token');
      }

      const data = await response.json();
      // CommonResponse 형식: { status, data: { token } }
      const token = data.data?.token || data.token;
      return token;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to get token'
      );
    }
  };

  /**
   * 음성 채팅방 입장
   * - Room 생성 및 이벤트 리스너 등록
   * - LiveKit 서버 연결
   * - 마이크 활성화
   */
  const joinRoom = useCallback(async () => {
    // 이미 연결 중이거나 연결되어 있으면 중복 실행 방지
    if (isConnecting || isConnected) return;

    // 나가는 중이면 입장하지 않음
    if (isLeaving) return;

    setIsConnecting(true);
    setError(null);

    let newRoom: Room | null = null;
    try {
      // Room 초기화 (음성 최적화 옵션)
      newRoom = new Room({
        adaptiveStream: true, // 네트워크 상태에 따라 자동으로 품질 조절
        publishDefaults: {
          audioPreset: { maxBitrate: 48000 }, // 음성 품질 설정 (48kbps)
        },
      });

      // 연결 성공 이벤트
      newRoom.on(RoomEvent.Connected, () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      // 연결 해제 이벤트
      newRoom.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
      });

      // 원격 참가자 퇴장 이벤트 (다른 사람이 음성 채팅방을 나갔을 때)
      newRoom.on(
        RoomEvent.ParticipantDisconnected,
        (participant: RemoteParticipant) => {
          setRemoteTracks((prev) =>
            prev.filter((t) => t.participantIdentity !== participant.identity)
          );
        }
      );

      // 원격 참가자의 트랙 구독 이벤트 (다른 사람이 입장하거나 마이크를 켰을 때)
      newRoom.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          // 오디오 트랙만 처리 (비디오는 무시)
          if (publication.kind === Track.Kind.Audio) {
            setRemoteTracks((prev) => [
              ...prev,
              {
                trackPublication: publication,
                participantIdentity: participant.identity,
                isMuted: publication.isMuted,
              },
            ]);
          }
        }
      );

      // 원격 참가자의 트랙 구독 해제 이벤트 (다른 사람이 나가거나 마이크를 껐을 때)
      newRoom.on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
          setRemoteTracks((prev) =>
            prev.filter(
              (t) => t.trackPublication.trackSid !== publication.trackSid
            )
          );
        }
      );

      // 현재 말하고 있는 참가자 변경 이벤트 (화자 표시용)
      newRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
        setActiveSpeakers(speakers.map((s) => s.identity));
      });

      // 원격 참가자 트랙 음소거 이벤트
      newRoom.on(
        RoomEvent.TrackMuted,
        (publication: TrackPublication, participant: Participant) => {
          if (publication.kind === Track.Kind.Audio) {
            setRemoteTracks((prev) =>
              prev.map((t) =>
                t.participantIdentity === participant.identity
                  ? { ...t, isMuted: true }
                  : t
              )
            );
          }
        }
      );

      // 원격 참가자 트랙 음소거 해제 이벤트
      newRoom.on(
        RoomEvent.TrackUnmuted,
        (publication: TrackPublication, participant: Participant) => {
          if (publication.kind === Track.Kind.Audio) {
            setRemoteTracks((prev) =>
              prev.map((t) =>
                t.participantIdentity === participant.identity
                  ? { ...t, isMuted: false }
                  : t
              )
            );
          }
        }
      );

      setRoom(newRoom);

      // 백엔드에서 LiveKit 접속 토큰 가져오기
      const token = await getToken(workspaceId, participantName);

      // LiveKit 서버에 연결
      await newRoom.connect(LIVEKIT_URL, token);

      // 마이크 활성화 (권한 거부 시에도 연결은 유지)
      try {
        await newRoom.localParticipant.setMicrophoneEnabled(true);
      } catch (micErr) {
        console.warn('Microphone permission denied:', micErr);
        setIsMicEnabled(false);
        // 마이크 권한 거부는 치명적 에러가 아니므로 연결은 유지
      }
    } catch (err) {
      console.error('Connection error:', err);
      // 에러 메시지를 사용자 친화적으로 변환
      let errorMessage = 'Failed to connect to voice chat';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage =
            '마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setIsConnecting(false);
      // 연결 실패 시 정리 (newRoom이 scope 내에 있으므로 직접 disconnect)
      if (newRoom) {
        newRoom.disconnect();
      }
      setRoom(undefined);
    }
  }, [workspaceId, participantName, isConnecting, isConnected, isLeaving]);

  /**
   * 음성 채팅방 나가기
   * - Room 연결 해제
   * - 모든 상태 초기화
   */
  const leaveRoom = useCallback(async () => {
    if (room) {
      // 먼저 isLeaving을 true로 설정하여 재연결 방지
      // 중요: isLeaving은 여기서 false로 설정하지 않음 - onClose() 후 컴포넌트가 언마운트되거나
      // 다시 입장할 때 resetLeaving()이 호출됨
      setIsLeaving(true);
      setIsConnected(false);
      setIsConnecting(false);
      setRemoteTracks([]);
      try {
        await room.disconnect();
      } catch (err) {
        console.error('Failed to disconnect from room:', err);
      } finally {
        setRoom(undefined);
        // isLeaving은 true로 유지 - 재연결 방지
      }
    }
  }, [room]);

  /**
   * 마이크 음소거/해제 토글
   * - 마이크 켜기 시 권한이 없으면 다시 요청
   */
  const toggleMicrophone = useCallback(async () => {
    if (room) {
      const newState = !isMicEnabled;
      try {
        await room.localParticipant.setMicrophoneEnabled(newState);
        setIsMicEnabled(newState);
      } catch (err) {
        // 마이크 권한 거부 시 에러 처리
        if (err instanceof Error && err.name === 'NotAllowedError') {
          console.warn('Microphone permission denied');
          setIsMicEnabled(false);
        }
      }
    }
  }, [room, isMicEnabled]);

  /**
   * 컴포넌트 언마운트 시 자동으로 연결 해제
   * - 메모리 누수 방지
   * - 음성 채팅 연결 정리
   */
  useEffect(() => {
    return () => {
      if (room && room.state === ConnectionState.Connected) {
        room.disconnect();
      }
    };
  }, [room]);

  // isLeaving 플래그 리셋 함수
  const resetLeaving = useCallback(() => {
    setIsLeaving(false);
  }, []);

  return {
    room, // LiveKit Room 인스턴스
    remoteTracks, // 원격 참가자 오디오 트랙 목록
    isConnected, // 연결 상태
    isConnecting, // 연결 중 상태
    isLeaving, // 나가는 중 상태
    isMicEnabled, // 마이크 활성화 상태
    error, // 에러 메시지
    participantName, // 내 참가자 이름
    participantCount: remoteTracks.length + (isConnected ? 1 : 0), // 총 참가자 수
    activeSpeakers, // 현재 말하고 있는 참가자 ID 목록
    joinRoom, // 방 입장 함수
    leaveRoom, // 방 나가기 함수
    toggleMicrophone, // 마이크 토글 함수
    resetLeaving, // isLeaving 리셋 함수
  };
}
