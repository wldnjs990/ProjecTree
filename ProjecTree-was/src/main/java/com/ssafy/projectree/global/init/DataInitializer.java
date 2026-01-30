package com.ssafy.projectree.global.init;

import com.ssafy.projectree.domain.auth.enums.AuthRole;
import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import com.ssafy.projectree.domain.node.model.entity.EpicNode;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.StoryNode;
import com.ssafy.projectree.domain.node.model.entity.TaskNode;
import com.ssafy.projectree.domain.node.model.repository.NodeRepository;
import com.ssafy.projectree.domain.node.model.repository.NodeTreeRepository;
import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import com.ssafy.projectree.domain.workspace.enums.ServiceType;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log4j2
public class DataInitializer {

    private final TechStackDataLoader techStackDataLoader;
    private final DummyWorkspaceLoader dummyWorkspaceLoader;
    private final TechVocabularyRepository techVocabularyRepository;
    private final WorkspaceRepository workspaceRepository;

    @PostConstruct
    public void init() throws Exception {
        if (techVocabularyRepository.count() > 0) {
            log.info("tech vocab already init");
        } else {
            techStackDataLoader.init();
        }
        if (workspaceRepository.count() > 0) {
            log.info("workspace already exists");
        } else {
            dummyWorkspaceLoader.init();
        }
    }

    @Component
    @RequiredArgsConstructor
    public static class TechStackDataLoader {

        private final JdbcTemplate jdbcTemplate; // Repository 대신 JdbcTemplate 주입

        @Transactional
        public void init() throws Exception {
            ClassPathResource resource = new ClassPathResource("data/QueryResults.csv");
            List<TechVocabulary> vocabularies = new ArrayList<>();

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                String line;
                boolean isHeader = true;

                while ((line = br.readLine()) != null) {
                    if (isHeader) {
                        isHeader = false;
                        continue;
                    }

                    String[] columns = line.split(",");
                    if (columns.length > 0) {
                        String tagName = columns[0].replace("", "").trim();
                        // 객체 생성만 하고 리스트에 담음
                        TechVocabulary vocab = new TechVocabulary();
                        vocab.setName(tagName);
                        vocabularies.add(vocab);
                    }
                }
            }

            if (!vocabularies.isEmpty()) {
                batchInsert(vocabularies); // 별도 메서드로 분리하여 배치 실행
                System.out.println("✅ " + vocabularies.size() + "개의 기술 스택이 성공적으로 로드되었습니다.");
            }
        }

        // JDBC Batch Update 실행
        private void batchInsert(List<TechVocabulary> vocabularies) {
            // 1. SQL에 created_at, updated_at 컬럼을 명시합니다.
            String sql = "INSERT INTO tech_vocabulary (name, created_at, updated_at) VALUES (?, ?, ?)";

            jdbcTemplate.batchUpdate(sql,
                    vocabularies,
                    1000,
                    (PreparedStatement ps, TechVocabulary vocab) -> {
                        ps.setString(1, vocab.getName());

                        // 2. 현재 시간을 직접 생성해서 넣어줍니다.
                        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

                        ps.setTimestamp(2, now); // created_at
                        ps.setTimestamp(3, now); // updated_at (보통 같이 NOT NULL이므로 함께 설정)
                    });
        }
    }

    @Component
    @RequiredArgsConstructor
    public static class DummyWorkspaceLoader {

        private final MemberRepository memberRepository;
        private final WorkspaceRepository workspaceRepository;
        private final NodeRepository nodeRepository;
        private final NodeTreeRepository nodeTreeRepository;

        @Transactional
        public void init() {
            if (workspaceRepository.count() > 0) return;

            // 1. Member 생성
            Member member = Member.builder()
                    .email("ssafy@ssafy.com")
                    .name("김싸피")
                    .nickname("SSAFY")
                    .role(AuthRole.ROLE_USER)
                    .oauthProvider(OAuthProvider.GITHUB)
                    .build();
            memberRepository.save(member);

            // 2. Workspace 생성
            Workspace workspace = Workspace.builder()
                    .name("Projectree")
                    .serviceType(ServiceType.WEB)
                    .description("프로젝트 관리 툴입니다.")
                    .domain("projectree.com")
                    .identifierPrefix("PJT")
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusMonths(3))
                    .purpose("프로젝트 관리")
                    .build();
            workspaceRepository.save(workspace);

            // 3. Project Node 생성 (Root)
            ProjectNode projectNode = ProjectNode.builder()
                    .name("Projectree 개발")
                    .description("Projectree 서비스 개발 프로젝트입니다.")
                    .status(NodeStatus.IN_PROGRESS)
                    .member(member)
                    .workspace(workspace)
                    .priority(Priority.P1)
                    .xPos(0.0)
                    .yPos(0.0)
                    .build();
            nodeRepository.saveRoot(projectNode);

            // 4. Epic Node 생성
            EpicNode epicNode = EpicNode.builder()
                    .name("기획 및 설계")
                    .description("요구사항 정의 및 설계")
                    .status(NodeStatus.IN_PROGRESS)
                    .member(member)
                    .priority(Priority.P0)
                    .xPos(100.0)
                    .yPos(100.0)
                    .build();
            nodeRepository.saveWithParent(projectNode.getId(), epicNode);

            // 5. Story Node 생성
            StoryNode storyNode = StoryNode.builder()
                    .name("DB 설계")
                    .description("ERD 작성 및 검토")
                    .status(NodeStatus.DONE)
                    .member(member)
                    .priority(Priority.P1)
                    .xPos(200.0)
                    .yPos(200.0)
                    .build();
            nodeRepository.saveWithParent(epicNode.getId(), storyNode);

            // 6. Task Node 생성
            TaskNode taskNode = TaskNode.builder()
                    .name("ERD 작성")
                    .description("논리/물리 모델링")
                    .status(NodeStatus.DONE)
                    .member(member)
                    .priority(Priority.P2)
                    .xPos(300.0)
                    .yPos(300.0)
                    .difficult(3)
                    .type(TaskType.BE)
                    .build();
            nodeRepository.saveWithParent(storyNode.getId(), taskNode);
        }

    }
}