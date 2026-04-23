import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "/tasks";

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  const loadTasks = async () => {
    const res = await fetch(API, {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    const data = await res.json();
    setTasks(data);
  };

  const login = async () => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const addTask = async () => {
    if (!title) return;

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title })
    });

    setTitle("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });
    loadTasks();
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Tracker</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
