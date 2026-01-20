import { useSearchParams, useNavigate } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, ChevronDown, Clock, Calendar, ArrowDownAZ } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { workspaces } from "../data/mockData";

// 정렬 옵션 정의
const sortOptions = [
  { label: "최근 수정순", value: "recent", icon: Clock },
  { label: "생성일순", value: "created", icon: Calendar },
  { label: "이름순", value: "name", icon: ArrowDownAZ },
];

/**
 * [컴포넌트] 워크스페이스 콘텐츠 영역
 * - 기능: 워크스페이스 목록 조회, 검색(이름/설명), 정렬(최근/생성/이름)
 * - 특징: URL 파라미터(?q=..., ?sort=...)를 사용하여 상태를 관리하므로 공유 및 뒤로가기가 가능
 *        검색어 입력 시 잦은 URL 업데이트를 방지하기 위해 Debounce(0.3초)를 적용
 */
export function WorkspaceContent() {
  const navigate = useNavigate();
  // URL 쿼리 파라미터 관리 훅
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. 상태 관리
  // (1) 검색어 상태: 입력 반응성을 위해 로컬 state로 관리
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);

  // (2) 정렬 상태: URL에서 바로 조회 (기본값: recent)
  const sortByValue = searchParams.get("sort") || "recent";
  const currentSortOption = sortOptions.find(opt => opt.value === sortByValue) || sortOptions[0];

  // 2. Debounce 효과: 사용자가 입력을 멈춘 후 0.3초 뒤에 URL을 업데이트함 (한글 입력 끊김 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(prev => {
        if (inputValue) {
          prev.set("q", inputValue);
        } else {
          prev.delete("q");
        }
        // 정렬 상태는 유지
        return prev;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  const handleSortChange = (value: string) => {
    setSearchParams(prev => {
      prev.set("sort", value);
      return prev;
    });
  };

  // 3. 필터링 및 정렬 로직 (메모이제이션으로 성능 최적화)
  const filteredWorkspaces = useMemo(() => {
    // (1) 검색어로 필터링 (제목 또는 설명)
    let result = workspaces.filter(
      (ws) =>
        ws.title.toLowerCase().includes(inputValue.toLowerCase()) ||
        ws.description.toLowerCase().includes(inputValue.toLowerCase())
    );

    // (2) 정렬 적용 (Mock 로직)
    if (sortByValue === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortByValue === "created") {
      result.sort((a, b) => Number(b.id) - Number(a.id)); // ID 역순을 최신 생성으로 가정
    }
    // 'recent'는 기본 순서 유지 (실제 데이터가 있다면 날짜 비교)

    return result;
  }, [inputValue, sortByValue]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50/50 h-full">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 shrink-0">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">홈</span>
          <span className="text-zinc-300">/</span>
          <span className="font-medium text-zinc-900 tracking-tight">워크스페이스</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="워크스페이스 검색..."
              className="w-64 pl-9 bg-white border-zinc-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 placeholder:text-zinc-400"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-white border-zinc-200 shadow-sm text-zinc-600 hover:bg-zinc-50 min-w-[130px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <currentSortOption.icon className="h-4 w-4" />
                  {currentSortOption.label}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-zinc-200">
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
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            onClick={() => navigate("/project/new")}
          >
            <Plus className="h-4 w-4" />새 워크스페이스
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 scrollbar-hide">
        {filteredWorkspaces.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkspaces.map((workspace) => (
              <ProjectCard key={workspace.id} project={workspace} />
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
    </div>
  );
}
