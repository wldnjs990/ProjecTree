interface NodeHeaderInfoProps {
  name?: string;
  description: string;
}
export default function NodeHeaderInfo({
  name,
  description,
}: NodeHeaderInfoProps) {
  return (
    <div>
      {/* 제목 */}
      <h2 className="text-base font-medium text-[#14151F] mb-2 pr-8">
        {name || '무제'}
      </h2>

      {/* 설명 */}
      {description && (
        <p className="text-sm text-[#61626F] leading-relaxed">{description}</p>
      )}
    </div>
  );
}
