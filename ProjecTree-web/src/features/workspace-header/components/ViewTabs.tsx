import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ViewTab, ViewTabsProps } from '../types';

const tabs: { value: ViewTab; label: string }[] = [
  { value: 'tree-editor', label: '트리 에디터' },
  { value: 'feature-spec', label: '기능 명세서' },
  { value: 'tech-selection', label: '기술 선택 현황' },
];

export function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ViewTab)}>
      <TabsList className="h-8 bg-zinc-100/80 rounded-xl p-[3px]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-7 px-3 text-xs font-medium text-zinc-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm rounded-lg transition-colors"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
