import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Settings() {
  const backend = "https://workasana-backend-three.vercel.app";
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAll = () => {
    fetch(`${backend}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data));

    fetch(`${backend}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch(`${backend}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTeams(data));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project? Its tasks will be deleted too."))
      return;

    await fetch(`${backend}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("✅ Project deleted successfully!");

    fetchAll();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await fetch(`${backend}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("✅ Task deleted successfully!");

    fetchAll();
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;

    await fetch(`${backend}/teams/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("✅ Team deleted successfully!");

    fetchAll();
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="d-flex">
      <div className="col-md-2 bg-light-purple min-vh-100 p-3">
        <h4 className="text-purple mb-4">Workasana</h4>

        <ul className="nav flex-column">
          {[
            { name: "Dashboard", icon: "bi-house" },
            { name: "Projects", icon: "bi-kanban" },
            { name: "Team", icon: "bi-people" },
            { name: "Reports", icon: "bi-bar-chart" },
            { name: "Settings", icon: "bi-gear" },
          ].map(({ name, icon }) => (
            <li key={name} className="nav-item mb-1">
              <NavLink
                to={`/${name.toLowerCase()}`}
                end
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center py-2 px-3 ${
                    isActive ? "text-primary fw-semibold" : "text-dark"
                  }`
                }
              >
                <i className={`bi ${icon} me-2`}></i>
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="btn btn-danger w-100 mt-4" onClick={logoutUser}>
          Logout
        </button>
      </div>

      <div className="p-4 flex-grow-1">
        <h2 className="fw-bold  mb-4">Settings</h2>

        <div className="card shadow-lg p-4 mb-4 bg-light">
          <h4 className="mb-3 fw-bold ">Delete Projects</h4>
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <ul className="list-group ">
              {projects.map((p) => (
                <li
                  key={p._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {p.name}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProject(p._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card shadow-lg p-4 mb-4 bg-light">
          <h4 className="mb-3 fw-bold">Delete Tasks</h4>

          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((t) => (
                <li
                  key={t._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {t.name}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTask(t._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card shadow-lg p-4 mb-4 bg-light">
          <h4 className="mb-3 fw-bold">Delete Teams</h4>

          {teams.length === 0 ? (
            <p>No teams found.</p>
          ) : (
            <ul className="list-group">
              {teams.map((t) => (
                <li
                  key={t._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {t.name || t.team || t.teamName} {/* FIXED */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTeam(t._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
