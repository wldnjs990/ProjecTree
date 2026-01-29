package com.ssafy.projectree.domain.node.enums;

public enum NodeType {
    PROJECT, EPIC, STORY, TASK, ADVANCE;

    public static NodeType fromClassName(String className) {
        if (className == null) {
            return TASK; // 혹은 null, 또는 예외 처리
        }

        return switch (className) {
            case "ProjectNode" -> PROJECT; // 문자열 하드코딩이 의존성을 끊는 데 더 유리할 수 있습니다.
            case "EpicNode"    -> EPIC;
            case "StoryNode"   -> STORY;
            case "TaskNode"    -> TASK;
            case "AdvanceNode" -> ADVANCE;
            default            -> TASK; // 매칭되는 게 없을 때 기본값
        };
    }
}
