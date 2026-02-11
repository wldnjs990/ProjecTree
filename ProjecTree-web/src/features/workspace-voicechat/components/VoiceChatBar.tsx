/**
 * VoiceChatBar
 *
 * 디스코드 스타일의 하단 고정 음성 채팅 바 컴포넌트
 * - 화면 최하단에 고정 (fixed bottom-0)
 * - 참여자 아바타 가로 나열
 * - 화자 표시 (Glow effect)
 */

import { useEffect, useState, useMemo } from 'react';
import type { RemoteAudioTrack } from 'livekit-client';
import { Mic, MicOff, PhoneOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import type { AvatarColor } from '@/shared/components/UserAvatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVoiceChat } from '../hooks/useVoiceChat';
import HiddenAudioPlayer from './HiddenAudioPlayer';
import ParticipantAvatar from './ParticipantAvatar';
import { MicPermissionAlert } from './MicPermissionAlert';

type VoiceChatMember = {
  name: string;
  nickname?: string | null;
  color?: AvatarColor;
};


type VoiceChatBarProps = {
  isActive: boolean; // 연결 활성화 상태 (백그라운드 연결 유지)
  isVisible: boolean; // UI 표시 상태 (최소화/보이기)
  onClose: () => void; // 완전 종료 (연결 해제)
  workspaceId: string;
  members?: VoiceChatMember[];
};

/**
 * 참여자 아바타 컴포넌트
 */
export function VoiceChatBar({
  isActive,
  isVisible,
  onClose,
  workspaceId,
  members = [],
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

  // 캔버스 영역 폭 감지 (뷰포트 - 사이드바 300px)
  const SIDEBAR_WIDTH = 300;
  const [windowWidth, setWindowWidth] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth : 1280),
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const canvasWidth = windowWidth - SIDEBAR_WIDTH;
  const isCompact = canvasWidth < 480;
  const pageSize = isCompact ? 0 : canvasWidth < 700 ? 3 : 6;

  const [currentPage, setCurrentPage] = useState(0);

  // "나" + 원격 참여자를 하나의 배열로 합침
  const colorByName = useMemo(() => {
    const map = new Map<string, AvatarColor>();
    members.forEach((member) => {
      if (member.nickname && member.color) {
        map.set(member.nickname, member.color);
      }
      if (member.name && member.color) {
        map.set(member.name, member.color);
      }
    });
    return map;
  }, [members]);


  const allParticipants = useMemo(() => {
    if (!isConnected) return [];

    const me = {
      key: 'me',
      name: participantName,
      displayName: '나' as string | undefined,
      isSpeaking: activeSpeakers.includes(participantName),
      isMuted: !isMicEnabled,
      isMe: true,
      color: colorByName.get(participantName),
    };

    const remotes = remoteTracks.map((track) => ({
      key: track.trackPublication.trackSid,
      name: track.participantIdentity,
      displayName: undefined as string | undefined,
      isSpeaking: activeSpeakers.includes(track.participantIdentity),
      isMuted: track.isMuted,
      isMe: false,
      color: colorByName.get(track.participantIdentity),
    }));

    return [me, ...remotes];
  }, [isConnected, participantName, activeSpeakers, isMicEnabled, remoteTracks, colorByName]);

  const totalPages = pageSize > 0 ? Math.ceil(allParticipants.length / pageSize) : 0;
  const needsPagination = pageSize > 0 && allParticipants.length > pageSize;
  const pageParticipants = pageSize > 0
    ? allParticipants.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : [];

  // 현재 페이지가 비었을 때 마지막 유효 페이지로 이동
  useEffect(() => {
    if (currentPage > 0 && currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

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
      <div className="fixed bottom-4 left-[18.75rem] right-0 z-50 flex justify-center pointer-events-none overflow-hidden">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl px-4 py-3 pointer-events-auto shrink-0 whitespace-nowrap">
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

            {/* 참여자 영역 */}
            {isCompact ? (
              /* compact 모드: 아바타 숨기고 인원 뱃지만 표시 */
              isConnected && (
                <span className="text-sm text-slate-300">
                  {allParticipants.length}명
                </span>
              )
            ) : (
              /* 일반/중간 모드: 페이지네이션 아바타 */
              <div className="flex items-center gap-1 py-1 pr-1">
                {/* 왼쪽 화살표 (첫 페이지면 숨김) */}
                {needsPagination && currentPage > 0 && (
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1 rounded-full transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                    aria-label="이전 참여자"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* 현재 페이지 참여자 */}
                <div className="flex items-center gap-3">
                  {pageParticipants.map((participant) => (
                    <ParticipantAvatar
                      key={participant.key}
                      name={participant.name}
                      displayName={participant.displayName}
                      isSpeaking={participant.isSpeaking}
                      isMuted={participant.isMuted}
                      isMe={participant.isMe}
                      color={participant.color}
                    />
                  ))}
                </div>

                {/* 오른쪽 화살표 (마지막 페이지면 숨김) */}
                {needsPagination && currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1 rounded-full transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                    aria-label="다음 참여자"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* 에러 메시지 */}
                {error && <span className="text-sm text-red-400">{error}</span>}
              </div>
            )}

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
