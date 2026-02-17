package com.ssafy.projectree.domain.node.model.repository;

import com.ssafy.projectree.domain.member.model.entity.Member;
import com.ssafy.projectree.domain.member.model.repository.MemberRepository;
import com.ssafy.projectree.domain.node.model.entity.Candidate;
import com.ssafy.projectree.domain.node.model.entity.ProjectNode;
import com.ssafy.projectree.global.model.enums.OAuthProvider;
import com.ssafy.projectree.domain.auth.enums.AuthRole;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CandidateSoftDeleteTest {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @DisplayName("Candidate 삭제 시 soft delete가 적용되어 deleted_at이 설정되고 조회되지 않아야 한다.")
    void softDeleteCandidate() {
        // given
        Member member = Member.builder()
                .name("test")
                .email("test@test.com")
                .role(AuthRole.ROLE_USER)
                .oauthProvider(OAuthProvider.GOOGLE)
                .build();
        memberRepository.save(member);

        ProjectNode node = ProjectNode.builder()
                .name("Test Project")
                .member(member)
                .build();
        nodeRepository.save(node);

        Candidate candidate = Candidate.builder()
                .parent(node)
                .name("Test Candidate")
                .description("Description")
                .build();
        candidateRepository.save(candidate);
        Long candidateId = candidate.getId();

        entityManager.flush();
        entityManager.clear();

        // when
        candidateRepository.deleteById(candidateId);
        entityManager.flush();
        entityManager.clear();

        // then
        // 1. Repository를 통한 조회 시 결과가 없어야 함 (@SQLRestriction 적용 확인)
        Optional<Candidate> deletedCandidate = candidateRepository.findById(candidateId);
        assertThat(deletedCandidate).isEmpty();

        // 2. Native Query를 통해 실제로 데이터는 남아있고 deleted_at이 설정되었는지 확인
        Object result = entityManager.createNativeQuery("SELECT deleted_at FROM candidate WHERE id = :id")
                .setParameter("id", candidateId)
                .getSingleResult();
        
        assertThat(result).isNotNull();
    }
}
