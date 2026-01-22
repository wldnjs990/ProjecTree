package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.model.entity.EpicNode;
import com.ssafy.projectree.domain.node.model.entity.Node;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.domain.node.model.entity.StoryNode;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 이 줄 추가
class DummyNodeSaver {
	@Autowired
	private NodeRepository nodeRepository;


	@Commit
	@Test
	@Disabled
	public void saveDummyNode(){
		Node root = ProjectNode.builder()
				.name("P성향 여행자를 위한 여행도우미 앱")
				.description("""
						계획을 세우는데 어려움을 겪는 P성향 여행자들을 위한 여행 도우미, 본 프로젝트는 '계획은 귀찮지만, 효율적인 여행은 하고 싶은' P(인식형) 성향의 여행자들을 위한 즉흥 여행 추천 및 보조 웹 어플리케이션입니다.
						기존의 여행 플랫폼들이 J(판단형) 성향의 '철저한 계획 수립'에 초점을 맞춘 것과 달리, P-PliP은 사용자의 모호한 니즈를 파악하여 Just-in-Time (적시) 정보를 제공하고, 선택의 스트레스를 최소화하는 것을 목표로 합니다.
						""")
				.priority(Priority.P0)
				.identifier("US-001")
				.status(NodeStatus.TODO)
				.build();

		Node epic = EpicNode.builder()
				.name("[회원 시스템] 소셜 로그인 및 계정 통합 관리")
				.description("""
						목표: 사용자가 상품을 선택하고 결제까지 완료할 수 있는 전체 프로세스 구축
						주요 기능: 장바구니 담기, 수량 변경, 쿠폰 적용, 결제 모듈 연동(PG), 주문 내역 생성
						비즈니스 가치: 구매 전환율 상승 및 결제 편의성 제공
						""")
				.priority(Priority.P0)
				.identifier("US-001")
				.status(NodeStatus.TODO)
				.build();
		Node story = StoryNode.builder()
				.name("[로그인] 사용자는 구글 계정을 통해 간편하게 로그인할 수 있다.")
				.description("""
						1. User Story (사용자 보이스)
						As a (누가): 서비스를 처음 방문한 예비 사용자로서 I want to (무엇을): 별도의 가입 절차 없이 내 구글 계정으로 즉시 로그인하고 싶음 So that (왜): 서비스를 바로 이용하기 위해 회원가입에 드는 시간과 노력을 최소화하기 위함
						
						2. 작업 배경 및 설명 (Description)
						현재 우리 서비스는 사용자 인증 시스템이 부재한 상태임. 서비스 런칭 시 빠른 사용자 유입을 위해 복잡한 자체 회원가입 구현보다 Google OAuth 2.0을 우선 도입하여 인증 기반을 마련하고자 함. 이를 통해 사용자 테이블(Member)을 생성하고, 인증 세션(JWT 등) 관리의 초석을 다짐.
						
						목표: 구글 로그인을 통한 신규 회원 데이터 생성(Sign-up) 및 로그인(Sign-in) 프로세스 완성
						
						선행 작업: GCP(Google Cloud Platform) 프로젝트 생성 및 OAuth 2.0 클라이언트 ID 발급 필요
						
						3. 인수 조건 (Acceptance Criteria)
						기능의 완성 여부를 판단하는 필수 체크리스트임. 초기 구축이므로 '데이터 적재'와 '인증 토큰 발급'이 핵심임.
						
						✅ UI/UX (화면)
						
						[ ] 랜딩 페이지(또는 진입 화면)에 'Google 계정으로 시작하기' 버튼이 배치되어야 함.
						
						[ ] 버튼 디자인은 Google Identity 가이드라인(색상, 로고 규격)을 준수해야 함.
						
						✅ 기능 및 데이터 (백엔드 핵심)
						
						[ ] (회원 스키마 생성) 최초 로그인 시, DB의 Member 테이블에 아래 정보가 저장되어야 함.
						
						email (Unique Key): 구글 이메일
						
						name: 사용자 이름
						
						profile_image: 프로필 사진 URL
						
						social_type: 'GOOGLE' (Enum)
						
						role: 'USER' (기본 권한)
						
						[ ] (재로그인) 이미 DB에 존재하는 이메일로 요청 시, 데이터를 새로 생성하지 않고 기존 회원 정보를 조회하여 로그인 처리해야 함.
						
						[ ] (토큰 발급) 로그인/가입 성공 시, 클라이언트(프론트)에게 Access Token과 Refresh Token을 응답 헤더(또는 바디)로 전달해야 함.
						
						✅ 예외 처리
						
						[ ] 유효하지 않은 구글 토큰이거나 인증 실패 시 401 Unauthorized 에러를 반환해야 함.
						
						[ ] 필수 동의 항목(이메일, 프로필)을 사용자가 거부했을 경우, "필수 권한 동의가 필요합니다" 안내와 함께 로그인 초기 화면으로 복귀해야 함.
						""")
				.priority(Priority.P0)
				.identifier("US-001")
				.status(NodeStatus.TODO)
				.build();
		nodeRepository.saveRoot(root);
		nodeRepository.saveWithParent(root.getId(), epic);
		nodeRepository.saveWithParent(epic.getId(), story);
	}
}