from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, Text, Integer, Double,
    ForeignKey, Enum, Table, relationship
)
from app.agents.enums import NodeType, TaskType


class Node(Base, TimestampMixin):
    __tablename__ = "node"

    id = Column(BigInteger, primary_key=True, index=True)
    member_id = Column(BigInteger, ForeignKey("member.id"))
    node_type = Column(Enum(NodeType), nullable=False)  # Discriminator
    identifier = Column(String(50))
    name = Column(String(30))
    description = Column(Text)
    note = Column(Text)
    priority = Column(String(255))  # P0, P1, P2
    status = Column(String(255))  # TODO, IN_PROGRESS, DONE
    x_pos = Column(Double)
    y_pos = Column(Double)

    __mapper_args__ = {
        "polymorphic_identity": "node",
        "polymorphic_on": node_type,
    }

    # Relationships
    owner = relationship("Member", back_populates="nodes")
    tech_stacks = relationship(
        "NodeTechStack", back_populates="node"
    )
    ancestors = relationship(
        "Node",
        secondary="node_tree",
        primaryjoin="Node.id==node_tree.c.descendant_id",
        secondaryjoin="Node.id==node_tree.c.ancestor_id",
        backref="descendants",
        viewonly=True,  # Read-only for now to avoid complexity with association object if not needed
    )

    # Candidate relationship - One node can have many candidates? Or is it referencing a parent node?
    # Schema: candidate.node_id -> node.id (FK)
    candidates = relationship(
        "Candidate", foreign_keys="[Candidate.node_id]", back_populates="node"
    )

    # Derivation node relationship in Candidate
    # Schema: candidate.derivation_node_id -> node.id (FK)
    derived_candidates = relationship(
        "Candidate",
        foreign_keys="[Candidate.derivation_node_id]",
        back_populates="derivation_node",
    )


class AdvanceNode(Node):
    __tablename__ = "advance_node"

    node_id = Column(BigInteger, ForeignKey("node.id"), primary_key=True)
    difficult = Column(Integer)
    comparison = Column(Text)

    __mapper_args__ = {
        "polymorphic_identity": NodeType.ADVANCE,
    }


class EpicNode(Node):
    __tablename__ = "epic_node"

    node_id = Column(BigInteger, ForeignKey("node.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": NodeType.EPIC,
    }


class ProjectNode(Node):
    __tablename__ = "project_node"

    node_id = Column(BigInteger, ForeignKey("node.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": NodeType.PROJECT,
    }


class StoryNode(Node):
    __tablename__ = "story_node"

    node_id = Column(BigInteger, ForeignKey("node.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": NodeType.STORY,
    }


class TaskNode(Node):
    __tablename__ = "task_node"

    node_id = Column(BigInteger, ForeignKey("node.id"), primary_key=True)
    difficult = Column(Integer)
    comparison = Column(Text)
    type = Column(Enum(TaskType, values_callable=lambda x: [e.value for e in x], native_enum=False), nullable=True)  # BE, FE

    __mapper_args__ = {
        "polymorphic_identity": NodeType.TASK,
    }


# Association Table for Tree
node_tree = Table(
    "node_tree",
    Base.metadata,
    Column("ancestor_id", BigInteger, ForeignKey("node.id"), primary_key=True),
    Column("descendant_id", BigInteger, ForeignKey("node.id"), primary_key=True),
    Column("depth", Integer),
)
