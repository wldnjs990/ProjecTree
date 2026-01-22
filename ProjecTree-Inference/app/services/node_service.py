from app.api.schemas.nodes import NodeCreateRequest, NodeCreateResponse


class NodeService:
    """노드 생성 서비스 클래스
    
    실제 구현은 향후 추가 예정입니다.
    메인 그래프를 호출하여 노드를 생성합니다.
    """
    
    async def create_node(
        self, 
        request: NodeCreateRequest
    ) -> NodeCreateResponse:
        """노드 생성
        
        Args:
            request: 노드 생성 요청 정보 (workspace_id, node_data)
            
        Returns:
            생성된 노드 ID 및 상태
            
        Raises:
            NotImplementedError: 서비스 미구현 상태
        """
        # TODO: 메인 그래프를 호출하여 실제 노드 생성 로직 구현
        # from app.agents.graph import builder
        # graph = builder.compile()
        # result = await graph.ainvoke({...})
        raise NotImplementedError("NodeService.create_node is not implemented yet")
