import { useEffect } from 'react';
import { useNodeDetailStore, type NodeDetailData } from '@/features/workspace-core';

export function useSyncNodeDetailSelections(nodeDetail: NodeDetailData | null) {
  const setSelectedTechId = useNodeDetailStore((state) => state.setSelectedTechId);
  const setSelectedCandidateIds = useNodeDetailStore((state) => state.setSelectedCandidateIds);

  useEffect(() => {
    if (!nodeDetail?.techs) return;
    const selectedTech = nodeDetail.techs.find((tech) => tech.selected);
    setSelectedTechId(selectedTech?.id ?? null);
  }, [nodeDetail, setSelectedTechId]);

  useEffect(() => {
    if (!nodeDetail?.candidates) return;
    const selectedIds = nodeDetail.candidates
      .filter((candidate) => candidate.selected)
      .map((candidate) => candidate.id);
    setSelectedCandidateIds(selectedIds);
  }, [nodeDetail, setSelectedCandidateIds]);
}

