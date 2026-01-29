package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.api.dto.schema.PositionSchema;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class NodeCrdtServiceTest {
    @Autowired
    private NodeCrdtService nodeCrdtService;

    @Test
    @DisplayName("더미 데이터를 활용하여 Node.js 서버로 노드 생성 알림 전송")
    void send_dummy_node_to_crdt_server() {
        // 1. 테스트용 더미 데이터(Payload) 구성
        Long workspaceId = 2L;
        Long nodeId = 12L;
        Long parentId = 11L;

        NodeSchema.Body dummyBody = NodeSchema.Body.builder()
                .priority(Priority.P0)
                .identifier("TEST-NODE-999")
                .taskType(TaskType.FE)
                .status(NodeStatus.IN_PROGRESS)
                .difficult(3)
                .build();

        NodeSchema dummyPayload = NodeSchema.builder()
                .id(nodeId)
                .name("테스트 노드 전송")
                .nodeType(NodeType.TASK)
                .parentId(parentId)
                .position(new PositionSchema(550.5, 420.2))
                .data(dummyBody)
                .build();

        // 2. 메서드 호출
        // 호출 시 실제 Node.js 서버 터미널에 로그가 찍히는지 확인해야 합니다.
        log.info("Node.js 서버로 테스트 데이터 전송 시작...");

        assertDoesNotThrow(() -> {
            nodeCrdtService.sendNodeCreationToCrdt(workspaceId, dummyPayload);
        });

        log.info("전송 프로세스 완료 (서버 로그를 확인하세요)");
    }
}