import type { AwarenessState } from '@/features/workspace-core';
import { cn } from '@/shared/lib/utils';
import { useReactFlow } from '@xyflow/react';
import { MousePointer2 } from 'lucide-react';

export default function CursorPointers({
  cursors,
}: {
  cursors: Map<number, AwarenessState>;
}) {
  const { flowToScreenPosition } = useReactFlow();
  return (
    <>
      {[...cursors.entries()].map(([clientId, state]) => {
        if (!state.cursor) return null;
        const screenPos = flowToScreenPosition({
          x: state.cursor.x,
          y: state.cursor.y,
        });
        return (
          <div
            key={clientId}
            style={{
              position: 'fixed',
              left: screenPos.x,
              top: screenPos.y,
              zIndex: 10,
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center',
              pointerEvents: 'none',
            }}
          >
            <MousePointer2 style={{ color: state.user?.color || 'black' }} />
            <span
              className={cn('absolute left-full text-xs whitespace-nowrap')}
              style={{ color: state.user?.color || 'black' }}
            >
              {state.user?.name}
            </span>
          </div>
        );
      })}
    </>
  );
}
