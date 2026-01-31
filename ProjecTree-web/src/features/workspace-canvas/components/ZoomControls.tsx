import { Plus, Minus, Maximize2, RotateCcw } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ZoomControlsProps {
  className?: string
}

export function ZoomControls({ className }: ZoomControlsProps) {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow()

  const handleReset = () => {
    setViewport({ x: 0, y: 0, zoom: 1 })
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white"
        onClick={() => zoomIn()}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white"
        onClick={() => zoomOut()}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white"
        onClick={() => fitView({ padding: 0.2 })}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white"
        onClick={handleReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}
