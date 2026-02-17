package com.ssafy.projectree.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/*
*
class NodeCreateRequest(BaseModel):
    """노드 생성 요청 스키마"""
    workspace_id: int = Field(..., description="워크스페이스 ID")
    candidate_id: int = Field(..., description="후보 노드 ID")
    parent_id: int = Field(..., description="부모 노드 ID")
    x_pos: int = Field(..., description="노드 X 좌표")
    y_pos: int = Field(..., description="노드 Y 좌표")


class NodeCreateResponse(BaseModel):
    """노드 생성 응답 스키마"""
    node_id: Optional[int] = Field(None, description="생성된 노드 ID")
    parent_id: Optional[int] = Field(None, description="부모 노드 ID")
    candidate_id: Optional[int] = Field(None, description="후보 노드 ID")
    x_pos: Optional[int] = Field(None, description="노드 X 좌표")
    y_pos: Optional[int] = Field(None, description="노드 Y 좌표")


* */

public class AiNodeCreateDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request{
        @JsonProperty("workspace_id")
        private Long workspaceId;
        @JsonProperty("candidate_id")
        private Long candidateId;
        @JsonProperty("parent_id")
        private Long parentId;
        @JsonProperty("x_pos")
        private Double xPos;
        @JsonProperty("y_pos")
        private Double yPos;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response{
        @JsonProperty("node_id")
        private Long nodeId;
        @JsonProperty("parent_id")
        private Long parentId;
        @JsonProperty("candidate_id")
        private Long candidateId;
        @JsonProperty("x_pos")
        private Double xPos;
        @JsonProperty("y_pos")
        private Double yPos;
    }
}
