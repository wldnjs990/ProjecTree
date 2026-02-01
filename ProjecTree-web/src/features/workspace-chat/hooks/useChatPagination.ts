import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

/**
 * 채팅 무한 스크롤을 위한 커스텀 훅
 * IntersectionObserver를 사용하여 스크롤 상단 감지 및 자동 로드
 *
 * @param scrollContainerRef - 스크롤 컨테이너 ref
 * @returns topSentinelRef, hasMore, isLoading
 */
export const useChatPagination = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
) => {
  // 스크롤 상단 감시 요소
  const topSentinelRef = useRef<HTMLDivElement>(null);

  // Store에서 페이지네이션 상태 가져오기
  const pagination = useChatStore((state) => state.pagination);
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages);

  /**
   * 스크롤 위치를 유지하면서 메시지 로드
   * 과거 메시지가 추가되어도 사용자가 보던 위치 유지
   */
  const preserveScrollPosition = useCallback(
    async (loadFn: () => Promise<void>) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // 현재 스크롤 위치 저장
      const previousScrollHeight = container.scrollHeight;
      const previousScrollTop = container.scrollTop;

      // 메시지 로드
      await loadFn();

      // DOM 업데이트 대기 후 스크롤 위치 복원
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - previousScrollHeight;

        // 새로 추가된 메시지 높이만큼 스크롤 조정
        container.scrollTop = previousScrollTop + heightDifference;
      });
    },
    [scrollContainerRef]
  );

  /**
   * IntersectionObserver 설정
   * 스크롤 상단의 sentinel 요소가 화면에 보이면 메시지 로드
   */
  useEffect(() => {
    if (!topSentinelRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // sentinel이 화면에 보이고, 로딩 중이 아니고, 더 불러올 메시지가 있고, 초기 로드 완료된 경우
        if (
          entry.isIntersecting &&
          !pagination.isLoading &&
          pagination.hasMore &&
          pagination.initialLoaded
        ) {
          console.log('📜 [useChatPagination] Loading more messages...');
          preserveScrollPosition(loadMoreMessages);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1, // 10% 보이면 트리거
        rootMargin: '50px', // 50px 전에 미리 로드
      }
    );

    observer.observe(topSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    pagination.isLoading,
    pagination.hasMore,
    pagination.initialLoaded,
    loadMoreMessages,
    preserveScrollPosition,
    scrollContainerRef,
  ]);

  return {
    topSentinelRef,
    hasMore: pagination.hasMore,
    isLoading: pagination.isLoading,
    initialLoaded: pagination.initialLoaded,
  };
};
