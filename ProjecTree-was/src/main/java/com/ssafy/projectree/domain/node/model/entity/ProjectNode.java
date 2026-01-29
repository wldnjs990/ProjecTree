package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.workspace.model.entity.Workspace;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "project_node")
@PrimaryKeyJoinColumn(name = "node_id") // 부모의 id와 조인될 컬럼명
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("PROJECT")
public class ProjectNode extends Node {

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
    @Override
    public NodeType getNodeType() {
        return NodeType.PROJECT;
    }

    @Override
    public int getCandidateLimit() {
        return 20;
    }
}
