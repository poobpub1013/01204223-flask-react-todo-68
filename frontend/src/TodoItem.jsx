import { useState } from 'react'
import './App.css'

function TodoItem({ todo, toggleDone, deleteTodo, addNewComment }) {

  const [newComment, setNewComment] = useState("");

  // ป้องกันกรณี comments เป็น undefined
  const comments = todo.comments || [];

  return (
    <li>
      <span className={todo.done ? "done" : ""}>
        {todo.title}
      </span>

      <button onClick={() => toggleDone(todo.id)}>
        Toggle
      </button>

      <button onClick={() => deleteTodo(todo.id)}>
        ❌
      </button>

      {/* 🔥 ส่วนแสดง comment ตาม TDD */}

      {comments.length === 0 ? (
        <p>No comments</p>
      ) : (
        <>
          <b>Comments ({comments.length})</b>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>
                {comment.message}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="new-comment-forms">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          onClick={() => {
            if (newComment.trim() !== "") {
              addNewComment(todo.id, newComment);
              setNewComment("");
            }
          }}
        >
          Add Comment
        </button>
      </div>
    </li>
  );
}

export default TodoItem;