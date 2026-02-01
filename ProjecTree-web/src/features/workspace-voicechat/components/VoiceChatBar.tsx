/**
 * VoiceChatBar
 *
 * 디스코드 스타일의 하단 고정 음성 채팅 바 컴포넌트
 * - 화면 최하단에 고정 (fixed bottom-0)
 * - 참여자 아바타 가로 나열
 * - 화자 표시 (Glow effect)
 */

import { useEffect } from 'react';
import type { RemoteAudioTrack } from 'livekit-client';
import { Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVoiceChat } from '../hooks/useVoiceChat';
import HiddenAudioPlayer from './HiddenAudioPlayer';
import ParticipantAvatar from './ParticipantAvatar';

type VoiceChatBarProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
};

/**
 * 참여자 아바타 컴포넌트
 */
export function VoiceChatBar({
  isOpen,
  onClose,
  workspaceId,
}: VoiceChatBarProps) {
  const {
    remoteTracks,
    isConnected,
    isConnecting,
    isLeaving,
    isMicEnabled,
    error,
    participantName,
    activeSpeakers,
    joinRoom,
    leaveRoom,
    toggleMicrophone,
    resetLeaving,
  } = useVoiceChat({ workspaceId });

  // 바가 열릴 때 자동으로 음성 채팅방 입장
  useEffect(() => {
    // isLeaving이 true면 재연결하지 않음 (나가는 중 상태)
    if (isLeaving) return;

    if (isOpen && !isConnected && !isConnecting) {
      resetLeaving();
      joinRoom();
    }
  }, [isOpen, isConnected, isConnecting, isLeaving, joinRoom, resetLeaving]);

  // 바 닫을 때 음성 채팅방 퇴장 처리
  const handleClose = async () => {
    await leaveRoom();
    onClose();
  };

  // 바가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <>
      {/* 원격 참가자 오디오 재생 (숨김) */}
      {remoteTracks.map((track) => {
        const audioTrack = track.trackPublication.audioTrack;
        if (!audioTrack) return null;
        return (
          <HiddenAudioPlayer
            key={track.trackPublication.trackSid}
            track={audioTrack as RemoteAudioTrack}
          />
        );
      })}

      {/* 컴팩트 플로팅 바 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl px-4 py-3">
          <div className="flex items-center gap-4">
            {/* 연결 상태 표시 (점만) */}
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : isConnected ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"
                    aria-label="연결됨"
                  />
                </TooltipTrigger>
                <TooltipContent side="top">연결됨</TooltipContent>
              </Tooltip>
            ) : null}

            {/* 참여자 아바타 목록 */}
            <div className="flex items-center gap-3 py-1 pr-1 overflow-visible">
              {isConnected && (
                <>
                  {/* 내 아바타 */}
                  <ParticipantAvatar
                    name={participantName}
                    displayName="나"
                    isSpeaking={activeSpeakers.includes(participantName)}
                    isMuted={!isMicEnabled}
                    isMe
                  />

                  {/* 다른 참여자 아바타 */}
                  {remoteTracks.map((track) => (
                    <ParticipantAvatar
                      key={track.trackPublication.trackSid}
                      name={track.participantIdentity}
                      isSpeaking={activeSpeakers.includes(
                        track.participantIdentity
                      )}
                      isMuted={track.isMuted}
                    />
                  ))}
                </>
              )}

              {/* 에러 메시지 */}
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>

            {/* 구분선 */}
            {isConnected && <div className="w-px h-8 bg-slate-700" />}

            {/* 컨트롤 버튼 */}
            <div className="flex items-center gap-2">
              {isConnected && (
                <>
                  {/* 마이크 토글 버튼 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMicrophone}
                        className={cn(
                          'rounded-full w-9 h-9 transition-colors',
                          isMicEnabled
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        )}
                      >
                        {isMicEnabled ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isMicEnabled ? '마이크 끄기' : '마이크 켜기'}
                    </TooltipContent>
                  </Tooltip>

                  {/* 나가기 버튼 */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="rounded-full w-9 h-9 bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      >
                        <PhoneOff className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">나가기</TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* 에러 시 재시도 버튼 */}
              {error && !isConnecting && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={joinRoom}
                  className="text-xs"
                >
                  다시 시도
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
