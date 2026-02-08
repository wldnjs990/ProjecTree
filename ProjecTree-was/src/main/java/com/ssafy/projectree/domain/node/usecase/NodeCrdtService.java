package com.ssafy.projectree.domain.node.usecase;

import com.ssafy.projectree.domain.ai.dto.AiCandidateCreateDto;
import com.ssafy.projectree.domain.ai.dto.AiTechRecommendDto;
import com.ssafy.projectree.domain.node.api.dto.CustomTechCreateDto;
import com.ssafy.projectree.domain.node.api.dto.NodePositionUpdateDto;
import com.ssafy.projectree.domain.node.api.dto.schema.NodeSchema;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NodeCrdtService {

    private final RestClient restClient;
    private final NodeRepository nodeRepository;

    @Value("${crdt-server.url}")
    private String crdtServerUrl;

    @Value("${crdt-server.path-prefix}")
    private String pathPrefix;

    @Value("${crdt-server.new-node-path}")
    private String nodePath;

    @Value("${crdt-server.new-custom-tech-path}")
    private String customTechPath;

    @Value("${crdt-server.new-tech-path}")
    private String techPath;

    @Value("${crdt-server.new-candidate-path}")
    private String candidatePath;

    @Async("nodePositionExecutor")
    @Transactional
    public void savePositionAsync( List<NodePositionUpdateDto.NodePositionItem> nodes) {
        try {
            for (NodePositionUpdateDto.NodePositionItem dto : nodes) {
                //https://ssafy.atlassian.net/browse/S14P11D107-286
                // TODO 업데이트 요청이 너무 많아서 다른 방안을 찾아보아야 할 듯
                // gpt 는 Spring Batch는 쓰지 말고, @Async + JDBC batchUpdate 또는
                // PostgreSQL JSON bulk update가 정답이라 함
                nodeRepository.updatePosition(
                        dto.getNodeId(),
                        dto.getPosition().getX(),
                        dto.getPosition().getY()
                );
            }

        } catch (Exception e) {
            log.error("Failed to async save node positions", e);
        }
    }

    @Async
    public void sendNodeCreationToCrdt(Long workspaceId, NodeSchema payload) {
        String uriString = UriComponentsBuilder.fromUriString(crdtServerUrl)
                .path(pathPrefix)
                .path(nodePath)
                .build()
                .toUriString();

        try {
            restClient.post().uri(uriString, workspaceId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve().toBodilessEntity();
        } catch (Exception e) {
            log.error("CRDT 서버 전송 실패: {}", e.getMessage());
        }
    }

    @Async
    public void sendTechCreationToCrdt(Long workspaceId, Long nodeId, AiTechRecommendDto.Response response) {
        String uriString = UriComponentsBuilder.fromUriString(crdtServerUrl)
                .path(pathPrefix)
                .path(techPath)
                .build()
                .toUriString();

        sendNodeDataToCrdt(uriString, workspaceId, nodeId, response.getTechs());
    }

    @Async
    public void sendCustomTechCreationToCrdt(
            Long workspaceId,
            Long nodeId, CustomTechCreateDto.Response response) {
        String uriString = UriComponentsBuilder.fromUriString(crdtServerUrl)
                .path(pathPrefix)
                .path(customTechPath)
                .build()
                .toUriString();

        sendNodeDataToCrdt(uriString, workspaceId, nodeId, response);
    }

    @Async
    public void sendCandidatesCreationToCrdt(
            Long workspaceId,
            Long nodeId,
            AiCandidateCreateDto.Response response) {

        String uriString = UriComponentsBuilder.fromUriString(crdtServerUrl)
                .path(pathPrefix)
                .path(candidatePath)
                .build()
                .toUriString();

        sendNodeDataToCrdt(uriString, workspaceId, nodeId, response);

    }

    private void sendNodeDataToCrdt(String uriString, Long workspaceId, Long nodeId, Object payload) {
        try {
            restClient.post().uri(uriString, workspaceId, nodeId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve().toBodilessEntity();
        } catch (Exception e) {
            // https://ssafy.atlassian.net/browse/S14P11D107-285
            // TODO: 현재는 트랜잭션과 같이 동작 하기에 로그만 띄우지만
            // Transaction 과 별개로 동작하여 예외 반환 로직을 구현하는 것이 더 좋을 것같음
            log.error("CRDT 서버 전송 실패: {}", e.getMessage());
        }
    }
}
