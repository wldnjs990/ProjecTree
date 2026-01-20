import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type ViewTab = 'tree-editor' | 'feature-spec' | 'tech-selection'

interface ViewTabsProps {
  activeTab: ViewTab
  onTabChange: (tab: ViewTab) => void
}

const tabs: { value: ViewTab; label: string }[] = [
  { value: 'tree-editor', label: '트리 에디터' },
  { value: 'feature-spec', label: '기능 명세서' },
  { value: 'tech-selection', label: '기술 선택 현황' },
]

export function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ViewTab)}>
      <TabsList className="h-8 bg-[#EEEEEE] rounded-lg p-[3px]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-7 px-3 text-xs font-medium data-[state=active]:bg-[#F8F8F8] data-[state=active]:shadow-sm rounded-md"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
