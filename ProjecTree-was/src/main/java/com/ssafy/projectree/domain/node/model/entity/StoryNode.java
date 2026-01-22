package com.ssafy.projectree.domain.node.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "story_node")
@PrimaryKeyJoinColumn(name = "node_id")
@Getter
@Setter
public class StoryNode extends Node{
}
