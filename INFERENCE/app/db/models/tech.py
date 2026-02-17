from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, Text, Boolean, Integer,
    ForeignKey, Identity, relationship
)


class TechVocabulary(Base, TimestampMixin):
    __tablename__ = "tech_vocabulary"

    id = Column(BigInteger, Identity(), primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    # Relationships
    # node_tech_stack and workspace_tech_stack reference this
    node_tech_stack = relationship(
        "NodeTechStack", back_populates="tech_vocabulary", uselist=False
    )
    workspace_tech_stack = relationship(
        "WorkspaceTechStack", back_populates="tech_vocabulary", uselist=False
    )


class TechStackInfo(Base, TimestampMixin):
    __tablename__ = "tech_stack_info"

    id = Column(BigInteger, Identity(), primary_key=True, index=True)
    is_selected = Column(Boolean, nullable=False)
    recommendation = Column(Integer, nullable=False)
    advantage = Column(Text)
    description = Column(Text)
    ref = Column(Text)
    disadvantage = Column(Text)

    # Relationships
    node_tech_stack = relationship(
        "NodeTechStack", back_populates="tech_stack_info", uselist=False
    )


class WorkspaceTechStack(Base, TimestampMixin):
    __tablename__ = "workspace_tech_stack"

    id = Column(BigInteger, Identity(), primary_key=True, index=True)
    tech_vocab_id = Column(
        BigInteger, ForeignKey("tech_vocabulary.id"), nullable=False, unique=True
    )
    workspace_id = Column(BigInteger, ForeignKey("workspace.id"), nullable=False)

    # Relationships
    tech_vocabulary = relationship(
        "TechVocabulary", back_populates="workspace_tech_stack"
    )
    workspace = relationship("Workspace", back_populates="workspace_tech_stacks")


class NodeTechStack(Base, TimestampMixin):
    __tablename__ = "node_tech_stack"

    id = Column(BigInteger, Identity(), primary_key=True, index=True)
    is_recommended = Column(Boolean, nullable=False)
    node_id = Column(BigInteger, ForeignKey("node.id"))
    tech_vocab_id = Column(BigInteger, ForeignKey("tech_vocabulary.id"))
    tech_stack_info_id = Column(
        BigInteger, ForeignKey("tech_stack_info.id"), unique=True
    )

    # Relationships
    node = relationship("Node", back_populates="tech_stacks")
    tech_vocabulary = relationship("TechVocabulary", back_populates="node_tech_stack")
    tech_stack_info = relationship("TechStackInfo", back_populates="node_tech_stack")
