package com.ssafy.projectree.domain.node.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "project_node")
@PrimaryKeyJoinColumn(name = "node_id") // 부모의 id와 조인될 컬럼명
@Getter
@Setter
public class ProjectNode extends Node{
}
