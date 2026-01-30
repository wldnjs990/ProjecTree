from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, Text, TIMESTAMP,
    ForeignKey, relationship
)


class Workspace(Base, TimestampMixin):
    __tablename__ = "workspace"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(20), nullable=False)
    description = Column(Text)
    purpose = Column(String(20))
    domain = Column(String(20))
    identifier_prefix = Column(String(20))
    start_date = Column(
        TIMESTAMP(timezone=True)
    )  # timestamp(6) usually implies microsecond precision
    end_date = Column(TIMESTAMP(timezone=True))

    # Relationships
    documents = relationship("DocumentProperty", back_populates="workspace")
    teams = relationship("Team", back_populates="workspace")
    function_specifications = relationship(
        "FunctionSpecification", back_populates="workspace"
    )
    workspace_tech_stacks = relationship(
        "WorkspaceTechStack", back_populates="workspace"
    )


class FunctionSpecification(Base, TimestampMixin):
    __tablename__ = "function_specification"

    id = Column(BigInteger, primary_key=True, index=True)
    workspace_id = Column(BigInteger, ForeignKey("workspace.id"), nullable=False)
    name = Column(String(20))
    description = Column(Text)

    # Relationships
    workspace = relationship("Workspace", back_populates="function_specifications")
