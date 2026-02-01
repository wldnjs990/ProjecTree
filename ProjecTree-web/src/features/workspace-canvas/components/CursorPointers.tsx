import type { AwarenessState } from '@/features/workspace-core';
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
            <MousePointer2 className="text-primary" />
            <span className="absolute left-full text-xs">{clientId}</span>
          </div>
        );
      })}
    </>
  );
}
