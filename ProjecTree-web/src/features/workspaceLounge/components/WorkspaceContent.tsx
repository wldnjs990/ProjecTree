import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProjectCard, type ProjectCardProps } from './ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  ChevronDown,
  Clock,
  Calendar,
  ArrowDownAZ,
  Loader2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import type { FilterType } from '../types';
import { getMyWorkspaces } from '@/apis/workspace-lounge.api';
import { TutorialModal } from '@/shared/components/TutorialModal';

const sortOptions = [
  { label: '최근 수정순', value: 'recent', icon: Clock },
  { label: '생성일순', value: 'created', icon: Calendar },
  { label: '이름순', value: 'name', icon: ArrowDownAZ },
];

interface ContentProps {
  filterType?: FilterType;
}

export function WorkspaceContent({ filterType = 'all' }: ContentProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [workspaces, setWorkspaces] = useState<ProjectCardProps['project'][]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const sortByValue = searchParams.get('sort') || 'recent';
  const currentSortOption =
    sortOptions.find((opt) => opt.value === sortByValue) || sortOptions[0];

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const data = await getMyWorkspaces();
        setWorkspaces(data);
      } catch (_error) {
        setError('워크스페이스 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const updateState = () => {
      setDebouncedQuery(inputValue);

      setSearchParams((prev) => {
        if (inputValue) {
          prev.set('q', inputValue);
        } else {
          prev.delete('q');
        }
        return prev;
      });
    };

    if (inputValue === '') {
      updateState();
      return;
    }

    const timer = setTimeout(updateState, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('sort', value);
      return prev;
    });
  };

  const filteredWorkspaces = useMemo(() => {
    let result = workspaces.filter((ws) => {
      if (filterType === 'all') return true;
      if (filterType === 'mine') return ws.role === 'Owner';
      if (filterType === 'joined')
        return ws.role === 'Editor' || ws.role === 'Viewer';
      return true;
    });

    const query = debouncedQuery.toLowerCase();
    result = result.filter(
      (ws) =>
        ws.title.toLowerCase().includes(query) ||
        ws.description.toLowerCase().includes(query)
    );

    if (sortByValue === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortByValue === 'created') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return result;
  }, [workspaces, inputValue, sortByValue, filterType]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50/50 h-full">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-white/20 bg-white/40 px-6 py-4 shrink-0 backdrop-blur-md sticky top-0 z-10 transition-all duration-300">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4ADE80]/20 text-[#064E3B]">
            <Layers className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-zinc-800 tracking-tight hidden lg:block">
            워크스페이스 목록
          </h1>
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors ml-1 hidden sm:block"
            title="이용 가이드"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#064E3B] transition-colors duration-300" />
            <Input
              placeholder="워크스페이스 검색..."
              className="w-48 pl-10 bg-white/50 border-transparent shadow-sm focus:bg-white focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 placeholder:text-zinc-400/80 transition-colors duration-300 rounded-xl hover:bg-white/60"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 bg-white/50 border border-white/20 shadow-sm text-zinc-600 hover:bg-white/80 sm:w-[140px] justify-between backdrop-blur-sm transition-all duration-300 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <currentSortOption.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentSortOption.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border-zinc-200"
            >
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className="text-zinc-600 cursor-pointer"
                >
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="gap-2 bg-[#4ADE80]/80 hover:bg-[#4ADE80]/90 text-[#064E3B] font-bold shadow-lg shadow-green-500/20 border border-white/20 backdrop-blur-md rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            onClick={() => navigate('/workspace-onboarding')}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">새 워크스페이스</span>
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 scrollbar-hide">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p className="text-lg font-medium text-red-500">{error}</p>
            <p className="text-sm text-zinc-400 mt-1">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p className="text-lg font-bold text-zinc-700 mb-1">
              참여 중인 워크스페이스가 없습니다.
            </p>
            <p className="text-sm text-zinc-400">
              우측 상단의 버튼을 눌러 새로운 워크스페이스를 시작해보세요.
            </p>
          </div>
        ) : filteredWorkspaces.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => navigate(`/workspace/${workspace.id}`)}
              >
                <ProjectCard project={workspace} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <Search className="h-12 w-12 mb-4 text-zinc-300" />
            <p className="text-lg font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm">다른 검색어로 다시 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
