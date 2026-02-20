import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import TodoItem from "./TodoItem";

function TodoList() {
  // ✅ เอา / ท้ายออกให้ตรงกับ backend
  const TODOLIST_API_URL = "http://localhost:5000/api/todos/";

  const { accessToken, username, logout } = useAuth();

  const [todoList, setTodoList] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (accessToken) {
      fetchTodoList();
    }
  }, [accessToken]);

  async function fetchTodoList() {
    try {
      const response = await fetch(TODOLIST_API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setTodoList(data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch todo list.");
    }
  }

  async function toggleDone(id) {
    const toggleApiUrl = `${TODOLIST_API_URL}/${id}/toggle`;

    try {
      const response = await fetch(toggleApiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodoList((prev) =>
          prev.map((todo) =>
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function addNewTodo() {
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(TODOLIST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodoList((prev) => [...prev, newTodo]);
        setNewTitle("");
      }
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  }

  async function deleteTodo(id) {
    const deleteApiUrl = `${TODOLIST_API_URL}/${id}`;

    try {
      const response = await fetch(deleteApiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setTodoList((prev) =>
          prev.filter((todo) => todo.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function addNewComment(todoId, newComment) {
    const url = `${TODOLIST_API_URL}/${todoId}/comments`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: newComment }),
      });

      if (response.ok) {
        await fetchTodoList();
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Todo List</h1>
        <div>
          {username && <span>Welcome, {username}! </span>}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <ul>
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleDone={toggleDone}
            deleteTodo={deleteTodo}
            addNewComment={addNewComment}
          />
        ))}
      </ul>

      <hr />

      <div>
        New:{" "}
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={addNewTodo}>Add</button>
      </div>
    </>
  );
}

export default TodoList;