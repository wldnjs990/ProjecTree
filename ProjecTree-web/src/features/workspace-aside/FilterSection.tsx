import { Layers, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterSectionProps {
  nodeTypeFilter: string | null
  statusFilter: string | null
  onNodeTypeChange: (value: string | null) => void
  onStatusChange: (value: string | null) => void
}

const nodeTypes = [
  { value: 'all', label: '전체' },
  { value: 'project', label: '프로젝트' },
  { value: 'epic', label: 'Epic' },
  { value: 'story', label: 'Story' },
]

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'progress', label: '진행중' },
  { value: 'completed', label: '완료' },
]

export function FilterSection({
  nodeTypeFilter,
  statusFilter,
  onNodeTypeChange,
  onStatusChange,
}: FilterSectionProps) {
  return (
    <div className="p-3 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-[#636363] px-2">
        필터
      </p>

      <Select
        value={nodeTypeFilter || 'all'}
        onValueChange={(value) => onNodeTypeChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="h-8 text-sm bg-white border-[#DEDEDE]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <SelectValue placeholder="노드 타입" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {nodeTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={statusFilter || 'all'}
        onValueChange={(value) => onStatusChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="h-8 text-sm bg-white border-[#DEDEDE]">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="상태 필터" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
