from models import User, TodoItem, Comment, db


# -------------------------
# User password tests
# -------------------------

def test_check_correct_password():
    user = User()
    user.set_password("testpassword")
    assert user.check_password("testpassword") is True


def test_check_incorrect_password():
    user = User()
    user.set_password("testpassword")
    assert user.check_password("wrongpassword") is False


# -------------------------
# TodoItem model tests
# -------------------------

def test_empty_todoitem(app_context):
    assert TodoItem.query.count() == 0


def create_todo_item_with_comment():
    todo = TodoItem(title="Todo with comments", done=True)
    comment = Comment(message="Nested comment", todo=todo)
    db.session.add_all([todo, comment])
    db.session.commit()
    return todo


def test_todo_to_dict_includes_nested_comments(app_context):
    todo = create_todo_item_with_comment()
    todo_id = todo.id

    test_todo = TodoItem.query.get(todo_id)

    assert len(test_todo.comments) == 1
    assert test_todo.comments[0].message == "Nested comment"