package com.ssafy.projectree.domain.node;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.node.model.entity.*;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@SpringBootTest
@Slf4j
public class DummyNodeGenerationTest {

    @Autowired
    private NodeRepository nodeRepository;

    @Test
    @Transactional
    @Commit
    @DisplayName("프로젝트 노드 아래에 196개의 더미 노드(Epic > Story > Task > Advance) 생성")
    @Disabled("실제 데이터 생성이 필요할 때만 @Disabled를 해제하고 실행하세요.")
    public void generateDummyNodes() {
        // 프로젝트 노드 ID (변수로 선언하여 변경 가능)
        // 실제 데이터베이스에 존재하는 ProjectNode의 ID를 입력해야 합니다.
        Long projectNodeId = 407L;

        Random random = new Random();
        int epicCount = 4;
        int storyPerEpic = 6;
        int taskPerStory = 4;
        int advancePerTask = 2;

        log.info("Starting dummy node generation for projectNodeId: {}", projectNodeId);

        // 1. Epic 생성 (3개)
        for (int i = 1; i <= epicCount; i++) {
            EpicNode epic = EpicNode.builder()
                    .name("Epic " + i)
                    .description("Description for Epic " + i)
                    .status(NodeStatus.TODO)
                    .priority(Priority.P1)
                    .xPos((double) (i * 500))
                    .yPos(100.0)
                    .build();
            nodeRepository.saveWithParent(projectNodeId, epic);
            log.info("Created Epic: {} (ID: {})", epic.getName(), epic.getId());

            // 2. Story 생성 (Epic 당 3개)
            for (int j = 1; j <= storyPerEpic; j++) {
                StoryNode story = StoryNode.builder()
                        .name("Story " + i + "-" + j)
                        .description("Description for Story " + i + "-" + j)
                        .status(NodeStatus.TODO)
                        .priority(Priority.P2)
                        .xPos(epic.getXPos() + (j - 2) * 150)
                        .yPos(300.0)
                        .build();
                nodeRepository.saveWithParent(epic.getId(), story);
                log.info("  Created Story: {} (ID: {})", story.getName(), story.getId());

                // 3. Task 생성 (Story 당 3개)
                for (int k = 1; k <= taskPerStory; k++) {
                    TaskNode task = TaskNode.builder()
                            .name("Task " + i + "-" + j + "-" + k)
                            .description("Description for Task " + i + "-" + j + "-" + k)
                            .status(NodeStatus.TODO)
                            .priority(Priority.P2)
                            .type(TaskType.values()[random.nextInt(TaskType.values().length)])
                            .difficult(random.nextInt(5) + 1)
                            .xPos(story.getXPos() + (k - 2) * 100)
                            .yPos(500.0)
                            .build();
                    nodeRepository.saveWithParent(story.getId(), task);
                    log.info("    Created Task: {} (ID: {})", task.getName(), task.getId());

                    // 4. Advance 생성 (Task 당 3개)
                    for (int l = 1; l <= advancePerTask; l++) {
                        AdvanceNode advance = AdvanceNode.builder()
                                .name("Advance " + i + "-" + j + "-" + k + "-" + l)
                                .description("Description for Advance " + i + "-" + j + "-" + k + "-" + l)
                                .status(NodeStatus.TODO)
                                .priority(Priority.P2)
                                .difficult(random.nextInt(5) + 1)
                                .xPos(task.getXPos() + (l - 2) * 80)
                                .yPos(700.0)
                                .build();
                        nodeRepository.saveWithParent(task.getId(), advance);
                        log.info("      Created Advance: {} (ID: {})", advance.getName(), advance.getId());
                    }
                }
            }
        }

        int totalCreated = epicCount + (epicCount * storyPerEpic) + (epicCount * storyPerEpic * taskPerStory) + (epicCount * storyPerEpic * taskPerStory * advancePerTask);
        log.info("Dummy node generation completed. Total nodes created: {}", totalCreated);
    }
}
