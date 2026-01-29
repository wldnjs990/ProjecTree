package com.ssafy.projectree.domain.node.api.dto.schema;

import com.ssafy.projectree.domain.node.enums.NodeStatus;
import com.ssafy.projectree.domain.node.enums.NodeType;
import com.ssafy.projectree.domain.node.enums.Priority;
import com.ssafy.projectree.domain.node.enums.TaskType;
import org.springframework.beans.factory.annotation.Value;

public interface NodeWithParentSchema {
    Long getId();
    String getName();

    // [수정] TYPE(n)은 Class 객체를 반환하므로, 여기서 이름을 문자열로 추출합니다.
    @Value("#{target.nodeType.simpleName}")
    String getNodeType();

    String getStatus();
    String getIdentifier();
    String getPriority();
    Double getXPos();
    Double getYPos();

    Long getParentId();
    Integer getDifficult();
    String getTaskType();
}
