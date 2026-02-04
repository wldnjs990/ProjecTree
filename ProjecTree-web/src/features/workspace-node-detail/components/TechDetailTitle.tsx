import { Star } from 'lucide-react';

interface TechDetailTitleProps {
  name: string;
  recommendScore: number;
}
export default function TechDetailTitle({
  name,
  recommendScore,
}: TechDetailTitleProps) {
  return (
    <div className="flex items-center justify-between pb-3">
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-sm font-medium text-amber-700">
          {recommendScore}점
        </span>
      </div>
    </div>
  );
}
