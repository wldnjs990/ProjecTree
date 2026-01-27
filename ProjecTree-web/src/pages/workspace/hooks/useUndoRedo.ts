import { useEffect, useCallback } from 'react';
import { getCrdtClient } from '../crdt/crdtClient';

/**
 * 노드 위치 Undo/Redo 키보드 이벤트 훅
 * - Ctrl+Z (Mac: Cmd+Z): Undo
 * - Ctrl+Shift+Z (Mac: Cmd+Shift+Z): Redo
 * - Ctrl+Y (Windows): Redo
 */
export const useUndoRedo = () => {
  const undo = useCallback(() => {
    return getCrdtClient()?.undo() ?? false;
  }, []);

  const redo = useCallback(() => {
    return getCrdtClient()?.redo() ?? false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 브라우저 기본 undo/redo 사용
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+Z 또는 Cmd+Z (e.code 사용으로 Shift와 무관하게 물리적 키 인식)
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();

        if (e.shiftKey) {
          redo(); // Ctrl+Shift+Z: Redo
        } else {
          undo(); // Ctrl+Z: Undo
        }
        return;
      }

      // Ctrl+Y (Windows redo)
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { undo, redo };
};

export default useUndoRedo;
