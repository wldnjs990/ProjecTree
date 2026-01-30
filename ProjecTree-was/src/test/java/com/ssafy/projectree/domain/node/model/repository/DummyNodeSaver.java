package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.model.entity.EpicNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.StoryNode;
import com.ssafy.projectree.domain.workspace.enums.ServiceType;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import com.ssafy.projectree.domain.workspace.model.repository.WorkspaceRepository;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@DataJpaTest
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 이 줄 추가
class DummyNodeSaver {
	@Autowired
	private NodeRepository nodeRepository;
	@Autowired
	private WorkspaceRepository workspaceRepository;


	@Commit
	@Test
	@Disabled
	public void initDevLinkProjectData() {

		// 1. 워크스페이스 (Workspace)
		Workspace workspace = Workspace.builder()
				.serviceType(ServiceType.WEB)
				.purpose("포트폴리오") // 프로젝트의 성격
				.name("DevLink") // 팀 이름
				.identifierPrefix("DEV")
				.startDate(LocalDate.now())
				.endDate(LocalDate.now().plusDays(45))
				.domain("EDUTECH") // 도메인: 교육 기술
				.description("""
                   [서비스 개요]
                   취준생과 현업자를 연결하는 개발자 전용 1:1 멘토링 및 스터디 매집 웹 서비스.

                   [상세 기능 요구사항 (Scope)]
                   1. 멘토링 마켓:
                      - 멘토는 자신의 기술 스택(태그), 경력, 커피챗 가격을 등록 가능.
                      - 멘티는 원하는 시간대에 예약을 요청하고 포인트로 결제.
                   
                   2. 신뢰 기반 스터디 모집:
                      - 스터디장이 '보증금(예: 1만원)'을 걸고 모집 글 작성.
                      - 깃허브(GitHub) 계정 연동을 통해 커밋 기록(잔디)을 시각화하여 성실도 증명.
                   
                   3. 실시간 소통 시스템:
                      - 매칭된 멘토-멘티 간의 1:1 실시간 채팅 (웹소켓).
                      - 스터디원 간의 그룹 채팅 및 일정 공유 캘린더.

                   [기술적 제약 사항 & 챌린지]
                   - 실시간 채팅 시 메시지 누락 방지 및 순서 보장 필수.
                   - 인기 멘토 예약 오픈 시 트래픽 폭주에 대비한 대기열 또는 락(Lock) 처리.
                   - 결제 정합성 보장을 위한 트랜잭션 관리.
                   """)
				.build();

		// 2. 프로젝트 루트 노드 (Project Root Node)
		// 역할: 실제 구현해야 할 '서비스'의 상세 요구사항.
		// AI 활용: 에픽(Epic)과 스토리(Story)를 추출하는 직접적인 소스 데이터.
		Node rootProject = ProjectNode.builder()
				.workspace(workspace)
				.name("DevLink: 멘토링 매칭 플랫폼 구축") // 구체적인 프로젝트/버전 명
				.priority(Priority.P0)
				.status(NodeStatus.TODO)
				.description("""
                   [서비스 개요]
                   취준생과 현업자를 연결하는 개발자 전용 1:1 멘토링 및 스터디 매집 웹 서비스.

                   [상세 기능 요구사항 (Scope)]
                   1. 멘토링 마켓:
                      - 멘토는 자신의 기술 스택(태그), 경력, 커피챗 가격을 등록 가능.
                      - 멘티는 원하는 시간대에 예약을 요청하고 포인트로 결제.
                   
                   2. 신뢰 기반 스터디 모집:
                      - 스터디장이 '보증금(예: 1만원)'을 걸고 모집 글 작성.
                      - 깃허브(GitHub) 계정 연동을 통해 커밋 기록(잔디)을 시각화하여 성실도 증명.
                   
                   3. 실시간 소통 시스템:
                      - 매칭된 멘토-멘티 간의 1:1 실시간 채팅 (웹소켓).
                      - 스터디원 간의 그룹 채팅 및 일정 공유 캘린더.

                   [기술적 제약 사항 & 챌린지]
                   - 실시간 채팅 시 메시지 누락 방지 및 순서 보장 필수.
                   - 인기 멘토 예약 오픈 시 트래픽 폭주에 대비한 대기열 또는 락(Lock) 처리.
                   - 결제 정합성 보장을 위한 트랜잭션 관리.
                   """)
				.build();

		workspaceRepository.save(workspace);
		nodeRepository.saveRoot(rootProject);
	}
}