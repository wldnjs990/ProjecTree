import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {content && <hr />}
          {content}
          <hr />
          {!isConfirmed && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelText}</Button>
          </DialogClose>
          {!isConfirmed && (
            <DialogClose asChild>
              <Button onClick={onAction}>{actionText}</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
