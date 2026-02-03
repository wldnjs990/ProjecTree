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
import { MicPermissionAlert } from './MicPermissionAlert';

type VoiceChatBarProps = {
  isActive: boolean; // 연결 활성화 상태 (백그라운드 연결 유지)
  isVisible: boolean; // UI 표시 상태 (최소화/보이기)
  onClose: () => void; // 완전 종료 (연결 해제)
  workspaceId: string;
};

/**
 * 참여자 아바타 컴포넌트
 */
export function VoiceChatBar({
  isActive,
  isVisible,
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
    micPermissionDenied,
    resetMicPermissionDenied,
  } = useVoiceChat({ workspaceId });

  // 음성 채팅이 활성화될 때 자동으로 음성 채팅방 입장
  useEffect(() => {
    // 비활성화 상태면 아무것도 하지 않음
    if (!isActive) return;

    // 이미 연결되어 있거나 연결 중이면 아무것도 하지 않음
    if (isConnected || isConnecting) return;

    // 에러가 있으면 자동 재연결하지 않음
    if (error) return;

    // 마이크 권한 거부 상태면 재연결하지 않음
    if (micPermissionDenied) return;

    // 새로 입장하는 경우 isLeaving 리셋
    if (isLeaving) {
      resetLeaving();
    }

    joinRoom();
  }, [isActive, isConnected, isConnecting, isLeaving, error, micPermissionDenied, joinRoom, resetLeaving]);

  // 바 닫을 때 음성 채팅방 퇴장 처리
  const handleClose = async () => {
    // 먼저 onClose를 호출하여 isOpen을 false로 설정 - 재연결 방지
    onClose();
    // 그 다음 leaveRoom을 호출하여 연결 해제
    await leaveRoom();
  };

  // 비활성화 상태면 완전히 렌더링하지 않음
  if (!isActive) return null;

  return (
    <>
      {/* 마이크 권한 거부 알림 모달 */}
      <MicPermissionAlert
        isOpen={micPermissionDenied}
        onClose={() => {
          resetMicPermissionDenied();
          onClose(); // isActive를 false로 리셋하여 완전 종료
        }}
      />

      {/* 원격 참가자 오디오 재생 (숨김) - UI가 숨겨져도 항상 재생 */}
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

      {/* 컴팩트 플로팅 바 - isVisible이 true일 때만 표시 */}
      {isVisible && (
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

            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
