import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [theme, setTheme] = useState("dark");

  const API = "/tasks";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (token) {
      loadTasks();
      loadStats();
    }
  }, [token]);

  const loadTasks = async () => {
    const res = await fetch(API, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    setTasks(data);
  };

  const loadStats = async () => {
    const res = await fetch("/habits/stats", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    setStats(data);
  };

  const login = async () => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const register = async () => {
    await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setIsRegister(false);
  };

  const addTask = async () => {
    if (!title) return;

    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ title })
      });
      setEditId(null);
    } else {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ title })
      });
    }

    setTitle("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    loadTasks();
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>{isRegister ? "Register" : "Login"}</h2>

          <input
            style={styles.input}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister ? (
            <button style={styles.button} onClick={register}>
              Register
            </button>
          ) : (
            <button style={styles.button} onClick={login}>
              Login
            </button>
          )}

          <p
            style={{ marginTop: 10, cursor: "pointer" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have account? Login"
              : "No account? Register"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Task Tracker</h1>
        <button style={styles.logout} onClick={logout}>Logout</button>
        <button onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div style={styles.card}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button style={styles.button} onClick={addTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div style={styles.card}>
        <h2>Habit Stats</h2>
        {stats.map((s, i) => (
          <div key={i}>
            {s.title} — {s.totalChecks} days
          </div>
        ))}
      </div>

      <div style={styles.list}>
        {tasks.map((t) => (
          <div key={t.id} style={styles.task}>
            <span>{t.title}</span>
            <div>
              <button onClick={() => editTask(t)}>Edit</button>
              <button style={styles.delete} onClick={() => deleteTask(t.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#0f172a"
  },
  container: {
    padding: 20,
    minHeight: "100vh",
    color: theme === "dark" ? "#fff" : "#000",
    background: theme === "dark" ? "#0f172a" : "#f1f5f9"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "none"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#38bdf8",
    border: "none",
    borderRadius: 5,
    color: "#000",
    cursor: "pointer"
  },
  logout: {
    padding: 8,
    background: "#f87171",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  list: {
    marginTop: 20
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    background: "#334155",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  delete: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  }
};

export default App;
