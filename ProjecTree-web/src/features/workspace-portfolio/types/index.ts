/**
 * [타입] 포트폴리오 데이터
 */
export interface Portfolio {
    id: number;
    content: string;
}

/**
 * [타입] API 응답 래퍼
 */
export interface PortfolioResponse {
    data: Portfolio;
}

/**
 * [타입] 포트폴리오 컨테이너 Props
 */
export interface PortfolioContainerProps {
    workspaceId: number;
}

/**
 * [타입] 포트폴리오 뷰어 Props
 */
export interface PortfolioViewerProps {
    content: string;
    onEdit: () => void;
}

/**
 * [타입] 포트폴리오 에디터 Props
 */
export interface PortfolioEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    onCancel: () => void;
}
