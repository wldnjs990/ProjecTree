package com.ssafy.projectree.domain.workspace.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "workspace_seq")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceSeq {
    @Id
    @OneToOne
    @JoinColumn(name = "workspace_id") // <--- 여기가 문제!
    private Workspace workspace;

    @Column(name = "last_value")
    private int lastValue;
}
