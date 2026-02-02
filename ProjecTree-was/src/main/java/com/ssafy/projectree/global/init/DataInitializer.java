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
                        String tagName = columns[0].replace(" ", "")
                                .replace("\"", "").trim();
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
                    .name("여행 도우미 서비스: Urabi")
                    .description("""
                            여행은 함께할 때 더 즐겁습니다.
                                그러나 예산과 일정이 서로 다른 유럽 여행자들은 홀로 여행하는 경우가 많아, 외로움과 안전에 대한 불안감을 느낍니다.
                                Urabi는 이러한 여행자들이 장기 동행과 번개 모임을 통해 믿을 수 있는 동행자를 찾고, 숙소 후기와 여행 물품을 공유하며
                                더 안전하고 편리한 여행을 즐길 수 있도록 돕는 지도 기반 여행 동행 & 커뮤니티 플랫폼입니다​
                            
                                기획 의도
                                💡 유럽 여행자들의 외로움과 안전 문제를 해결하고, 비슷한 여행 스타일을 가진 사람들과 연결될 수 있도록 돕는 서비스입니다.
                                💡 장기 동행뿐만 아니라, 즉흥적인 번개 모임 기능을 통해 짧은 시간 함께할 여행자를 찾을 수 있습니다.
                                💡 한국인의 믿을 수 있는 숙소 후기와 여행 중 필요 없는 물품 교환·판매 기능을 제공하여,
                                    유럽 여행 중 발생할 수 있는 여러 불편함을 해결하고자 했습니다.
                                💡 지도를 기반으로 한 커뮤니티 결합이라는 차별점으로, 직관적이고 효율적인 여행자 연결을 목표로 합니다.
                            """)
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