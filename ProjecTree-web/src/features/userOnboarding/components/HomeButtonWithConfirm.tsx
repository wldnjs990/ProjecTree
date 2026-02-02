import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useClearAccessToken } from '@/shared/stores/authStore';
import { cn } from '@/shared/lib/utils';

interface HomeButtonWithConfirmProps {
  className?: string; // For tailoring the button style (colors, hover effects)
}

/**
 * [Component] Home Button with Logout Confirmation
 * - Displays a LogOut icon button.
 * - Opens a confirmation dialog on click.
 * - Logs out the user and navigates to '/' on confirm.
 */
export function HomeButtonWithConfirm({
  className,
}: HomeButtonWithConfirmProps) {
  const navigate = useNavigate();
  const clearAccessToken = useClearAccessToken();

  const handleConfirm = () => {
    // 1. Navigate to Landing Page first (to unmount the current protected page)
    navigate('/');

    // 2. Clear the token (Logout) in the next tick
    // This prevents the 'ProfileForm' from triggering its "Login Required" alert/redirect
    // before the page unmounts.
    setTimeout(() => {
      clearAccessToken();
    }, 0);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-full transition-colors cursor-pointer',
            className
          )}
          aria-label="설정 중단 및 나가기"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>설정을 중단하고 나가시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            지금 나가시면 로그아웃 처리되며, 입력한 내용은 저장되지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            나가기 (로그아웃)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
