from app.db.models.base import (
    Base, TimestampMixin, Column, BigInteger, String, Text,
    ForeignKey, relationship
)


class FileProperty(Base, TimestampMixin):
    __tablename__ = "file_property"

    id = Column(BigInteger, primary_key=True)
    size = Column(BigInteger, nullable=False)
    uploader_id = Column(
        BigInteger, nullable=True
    )  # Assuming references member.id but no FK constraint in schema?
    content_type = Column(String(255))
    origin_file_name = Column(String(255))
    path = Column(String(255))
    saved_file_name = Column(String(255))

    # Join Inheritance or One-to-One?
    # document_property references file_property.id as PK + FK
    document_property = relationship(
        "DocumentProperty", uselist=False, back_populates="file_property"
    )


class DocumentProperty(Base):
    __tablename__ = "document_property"

    id = Column(BigInteger, ForeignKey("file_property.id"), primary_key=True)
    workspace_id = Column(BigInteger, ForeignKey("workspace.id"), nullable=False)

    # Relationships
    file_property = relationship("FileProperty", back_populates="document_property")
    workspace = relationship("Workspace", back_populates="documents")
