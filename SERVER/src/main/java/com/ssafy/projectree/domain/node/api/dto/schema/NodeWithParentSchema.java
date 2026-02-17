package com.ssafy.projectree.domain.node.api.dto.schema;

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
    Double getxPos();
    Double getyPos();

    Long getParentId();
    Integer getDifficult();
    String getTaskType();
}
