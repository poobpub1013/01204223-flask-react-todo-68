from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


# =========================
# User Model (เพิ่มใหม่)
# =========================
class User(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(200), nullable=False)

    def set_password(self, password: str):
        self.hashed_password = generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.hashed_password, password)


# =========================
# TodoItem Model (ของเดิม)
# =========================
class TodoItem(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    done: Mapped[bool] = mapped_column(default=False)

    comments: Mapped[list["Comment"]] = relationship(back_populates="todo")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "done": self.done,
            "comments": [c.to_dict() for c in self.comments]
        }


# =========================
# Comment Model (ของเดิม)
# =========================
class Comment(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    message: Mapped[str] = mapped_column(String(250))
    todo_id: Mapped[int] = mapped_column(ForeignKey('todo_item.id'))

    todo: Mapped["TodoItem"] = relationship(back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "todo_id": self.todo_id
        }