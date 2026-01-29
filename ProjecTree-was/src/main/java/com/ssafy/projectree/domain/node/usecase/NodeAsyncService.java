package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NodeAsyncService {

    private final NodeRepository nodeRepository;

    @Async("nodePositionExecutor")
    @Transactional
    public void savePositionAsync(Long workspaceId, List<NodePositionUpdateDto.NodePositionItem> nodes) {
        try {
            for (NodePositionUpdateDto.NodePositionItem dto : nodes) {
                // TODO 업데이트 요청이 너무 많아서 다른 방안을 찾아보아야 할 듯
                // gpt 는 Spring Batch는 쓰지 말고, @Async + JDBC batchUpdate 또는
                // PostgreSQL JSON bulk update가 정답이라 함
                nodeRepository.updatePosition(
//                        workspaceId,
                        dto.getNodeId(),
                        dto.getPosition().getX(),
                        dto.getPosition().getY()
                );
            }

        } catch (Exception e) {
            log.error("Failed to async save node positions", e);
        }
    }
}
