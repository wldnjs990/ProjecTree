from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, Text, Boolean,
    ForeignKey, relationship
)


class Candidate(Base, TimestampMixin):
    __tablename__ = "candidate"

    id = Column(BigInteger, primary_key=True, index=True)
    node_id = Column(BigInteger, ForeignKey("node.id"), nullable=False)
    derivation_node_id = Column(BigInteger, ForeignKey("node.id"), unique=True)
    is_selected = Column(Boolean, nullable=False)
    name = Column(String(30))
    summary = Column(String(60))
    description = Column(Text)

    # Relationships
    node = relationship("Node", foreign_keys=[node_id], back_populates="candidates")
    derivation_node = relationship(
        "Node", foreign_keys=[derivation_node_id], back_populates="derived_candidates"
    )
