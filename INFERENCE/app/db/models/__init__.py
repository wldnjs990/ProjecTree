"""
Database Models Package

This module re-exports all model classes for backward compatibility.
Import models directly from here: from app.db.models import Node, Candidate, etc.
"""

# Chat models
from app.db.models.chat import ChatRoom, ChatLog

# File models
from app.db.models.file import FileProperty, DocumentProperty

# Member models
from app.db.models.member import Member, Team

# Workspace models
from app.db.models.workspace import Workspace, FunctionSpecification

# Tech models
from app.db.models.tech import (
    TechVocabulary,
    TechStackInfo,
    WorkspaceTechStack,
    NodeTechStack,
)

# Node models
from app.db.models.node import (
    Node,
    AdvanceNode,
    EpicNode,
    ProjectNode,
    StoryNode,
    TaskNode,
    node_tree,
)

# Candidate model
from app.db.models.candidate import Candidate

# Re-export all for convenience
__all__ = [
    # Chat
    "ChatRoom",
    "ChatLog",
    # File
    "FileProperty",
    "DocumentProperty",
    # Member
    "Member",
    "Team",
    # Workspace
    "Workspace",
    "FunctionSpecification",
    # Tech
    "TechVocabulary",
    "TechStackInfo",
    "WorkspaceTechStack",
    "NodeTechStack",
    # Node
    "Node",
    "AdvanceNode",
    "EpicNode",
    "ProjectNode",
    "StoryNode",
    "TaskNode",
    "node_tree",
    # Candidate
    "Candidate",
]
