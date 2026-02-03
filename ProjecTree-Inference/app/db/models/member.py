from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, UUID,
    ForeignKey, relationship
)


class Member(Base, TimestampMixin):
    __tablename__ = "member"

    id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255))
    name = Column(String(255))
    nickname = Column(String(255))
    oauth_provider = Column(String(255))  # Check constraint: GOOGLE, GITHUB

    # Relationships
    teams = relationship("Team", back_populates="member")
    nodes = relationship(
        "Node", back_populates="owner"
    )


class Team(Base, TimestampMixin):
    __tablename__ = "team"

    id = Column(BigInteger, primary_key=True, index=True)
    member_id = Column(BigInteger, ForeignKey("member.id"), nullable=False)
    workspace_id = Column(BigInteger, ForeignKey("workspace.id"), nullable=False)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chat_room.id"), nullable=True)

    # Relationships
    member = relationship("Member", back_populates="teams")
    workspace = relationship("Workspace", back_populates="teams")
    chat_room = relationship("ChatRoom", back_populates="teams")
