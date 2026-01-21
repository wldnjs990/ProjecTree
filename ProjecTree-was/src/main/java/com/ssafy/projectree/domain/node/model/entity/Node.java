package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.user.model.entity.Member;
import com.ssafy.projectree.global.model.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@DiscriminatorColumn(name = "node_type") // 구분 컬럼
@Inheritance(strategy = InheritanceType.JOINED)
@SuperBuilder
public abstract class Node extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;

    @Column(columnDefinition = "VARCHAR(30)")
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private NodeStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(columnDefinition = "VARCHAR(50)")
    private String identifier;

    public abstract NodeType getNodeType();

    public abstract int getCandidateLimit();
}
