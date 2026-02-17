from app.db.session import SessionLocal
from app.repository.member_repository import member_repository
from app.db.schemas.member import MemberCreate
db = SessionLocal()
# Create
new_member = member_repository.create(
    db, 
    obj_in=MemberCreate(
        name="Alice", 
        email="alice@example.com",
        nickname="Ali",
        oauth_provider="GOOGLE"
    )
)
# Get
member = member_repository.get_by_id(db, id=new_member.id)