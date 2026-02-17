/**
 * MicPermissionAlert
 *
 * 마이크 권한 거부 시 표시되는 알림 모달
 * workspace-lounge 모달 디자인과 통일
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type MicPermissionAlertProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MicPermissionAlert({
  isOpen,
  onClose,
}: MicPermissionAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent
        className="
          bg-white/92
          backdrop-blur-2xl
          border border-white/60
          rounded-3xl
          shadow-2xl
          z-[1001]
          p-0
          overflow-hidden
        "
      >
        <AlertDialogHeader className="p-6">
          <AlertDialogTitle className="text-zinc-900 font-bold">
            마이크 권한 필요
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500">
            음성 채팅을 사용하려면 마이크 권한이 필요합니다.
            브라우저 설정에서 마이크 권한을 허용해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100">
          <AlertDialogAction
            onClick={onClose}
            className="bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90 text-[var(--figma-tech-green)] font-bold shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] rounded-xl transition-all"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
