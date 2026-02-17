interface NodeHeaderInfoProps {
  name?: string;
  description: string;
}
export default function NodeHeaderInfo({
  name,
  description: _description,
}: NodeHeaderInfoProps) {
  // TODO : description 노드 상세정보에서 보여줄지 고민
  return (
    <div>
      {/* 제목 */}
      <h2 className="text-base font-medium text-[#14151F] mb-2 pr-8">
        {name || '무제'}
      </h2>
    </div>
  );
}
