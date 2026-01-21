/**
 * Node List Header 컴포넌트
 *
 * 노드 리스트의 테이블 헤더
 */
export function NodeListHeader() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_auto] gap-4 px-6 py-3 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
      <div>노드명</div>
      <div className="text-center">우선순위</div>
      <div className="text-center">상태</div>
      <div>기술 스택</div>
      <div className="text-center">업데이트</div>
      <div className="w-8"></div> {/* 화살표 아이콘 공간 */}
    </div>
  );
}
