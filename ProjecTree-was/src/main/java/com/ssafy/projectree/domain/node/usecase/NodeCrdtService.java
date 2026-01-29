package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.NodeUpdateDto;
import com.ssafy.projectree.domain.node.model.entity.AdvanceNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.global.api.code.ErrorCode;
import com.ssafy.projectree.global.exception.BusinessLogicException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NodeCrdtService {

    private final MemberRepository memberRepository;
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

    @Transactional
    public void updateNodeDetail(Long nodeId, NodeUpdateDto.Request request) {

        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NODE_NOT_FOUND_ERROR));

        if (request.getDifficult() != null) {
            if (node instanceof TaskNode taskNode) {
                taskNode.setDifficult(request.getDifficult());
            } else if (node instanceof AdvanceNode advanceNode) {
                advanceNode.setDifficult(request.getDifficult());
            }
        }

        if (request.getStatus() != null) node.setStatus(request.getStatus());
        if (request.getPriority() != null) node.setPriority(request.getPriority());
        if (request.getNote() != null) node.setNote(request.getNote());

        if (request.getAssignee() != null) {
            Member assignee = memberRepository.findById(request.getAssignee())
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_ERROR));
            node.setMember(assignee);
        }
    }
}
