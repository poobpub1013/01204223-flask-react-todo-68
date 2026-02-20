import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import TodoItem from "./TodoItem";
import { useNavigate } from "react-router-dom";

function TodoList() {
  const TODOLIST_API_URL = "http://localhost:5000/api/todos/";
  const navigate = useNavigate();

  const { accessToken, username, logout } = useAuth();

  const [todoList, setTodoList] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else {
      fetchTodoList();
    }
  }, [accessToken]);

  async function fetchTodoList() {
    try {
      const response = await fetch(TODOLIST_API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network error");
      }

      const data = await response.json();
      setTodoList(data);
    } catch (err) {
      alert("Failed to fetch todo list.");
    }
  }

  async function toggleDone(id) {
    const toggle_api_url = `${TODOLIST_API_URL}${id}/toggle/`;

    try {
      const response = await fetch(toggle_api_url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodoList(
          todoList.map((todo) =>
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function addNewTodo() {
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
        setTodoList([...todoList, newTodo]);
        setNewTitle("");
      }
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  }

  async function deleteTodo(id) {
    const delete_api_url = `${TODOLIST_API_URL}${id}/`;

    try {
      const response = await fetch(delete_api_url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setTodoList(todoList.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function addNewComment(todoId, newComment) {
    try {
      const url = `${TODOLIST_API_URL}${todoId}/comments/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: newComment,
        }),
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