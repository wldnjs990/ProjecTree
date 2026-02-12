import { Handle, Position } from '@xyflow/react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { FlowNodeData } from '@/features/workspace-core';
import {
  getAiStreamKey,
  useAiStream,
  useIsPreviewCreating,
  useNodes,
} from '@/features/workspace-core';
import { AiStreamingCard } from '@/shared/components/AiStreamingCard';
import { NodePresenceAvatars } from './nodeParts';

export interface PreviewNodeData extends FlowNodeData {
  isPreview: true;
}

interface PreviewNodeProps {
  id: string;
  data: PreviewNodeData;
}

export function PreviewNode({ id, data }: PreviewNodeProps) {
  const isCreating = useIsPreviewCreating(id);
  const nodes = useNodes();
  const parentId = nodes.find((n) => n.id === id)?.parentId ?? null;
  const candidateId = id.startsWith('preview-') ? id.replace('preview-', '') : null;
  const streamKey = parentId && candidateId
    ? getAiStreamKey('NODE', parentId, candidateId)
    : null;
  const streamingText = useAiStream(streamKey);
  const showStreamingText = isCreating && streamingText;

  return (
    <div
      className={cn(
        'relative rounded-2xl p-3 w-[180px]',
        'border-2 border-dashed',
        isCreating
          ? 'border-[#1C69E3] bg-[rgba(28,105,227,0.08)] shadow-[0_0_20px_rgba(28,105,227,0.4)]'
          : 'border-[#1C69E3]/50 bg-[rgba(28,105,227,0.03)]',
        'transition-all duration-300'
      )}
    >
      <NodePresenceAvatars nodeId={id} />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 border-2 border-white bg-[#1C69E3]/50"
      />

      <div className="flex items-center gap-1.5 mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-lg',
            'bg-[#1C69E3]/10 text-[#1C69E3] border border-[#1C69E3]/30'
          )}
        >
          <Sparkles className="w-3 h-3" />
          Preview
        </span>
      </div>

      <p
        className={cn(
          'text-sm font-medium line-clamp-2',
          isCreating ? 'text-[#1C69E3]' : 'text-[#0B0B0B]/70'
        )}
      >
        {data.title}
      </p>

      {isCreating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl p-2">
          {showStreamingText ? (
            <AiStreamingCard
              text={streamingText}
              compact
              className="w-full max-w-[160px]"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#1C69E3] animate-spin" />
              <span className="text-xs text-[#1C69E3] font-medium">
                Creating...
              </span>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 border-2 border-white bg-[#1C69E3]/50"
      />
    </div>
  );
}
