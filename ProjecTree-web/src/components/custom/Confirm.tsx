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
import type { ReactElement } from 'react';

interface ConfirmProps {
  trigger: ReactElement;
  content?: ReactElement;
  title: ReactElement | string;
  description: string;
  cancelText: string;
  actionText: string;
  onAction?: () => void;
  isConfirmed?: boolean;
}
export function Confirm({
  trigger,
  content,
  title,
  description,
  cancelText,
  actionText,
  onAction,
  isConfirmed = false,
}: ConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {content && <hr />}
          {content}
          <hr />
          {!isConfirmed && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          {!isConfirmed && (
            <AlertDialogAction onClick={onAction}>
              {actionText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
