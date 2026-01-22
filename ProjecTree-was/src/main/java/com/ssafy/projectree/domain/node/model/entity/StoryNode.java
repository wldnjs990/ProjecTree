package com.ssafy.projectree.domain.node.model.entity;

import com.ssafy.projectree.domain.node.enums.NodeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "story_node")
@PrimaryKeyJoinColumn(name = "node_id")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorValue("STORY")
public class StoryNode extends Node{
    @Override
    public NodeType getNodeType() {
        return NodeType.STORY;
    }

    @Override
    public int getCandidateLimit() {
        return 6;
    }
}
