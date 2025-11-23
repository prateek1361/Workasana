import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tagFilter, setTagFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    const res = await fetch(
      "https://workasana-backend-three.vercel.app/projects",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjects(await res.json());
  };

  const fetchTasks = async () => {
    const res = await fetch(
      "https://workasana-backend-three.vercel.app/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTasks(await res.json());
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const grouped = projects.map((project) => ({
    project,
    tasks: tasks.filter((t) => {
      const projId = typeof t.project === "string" ? t.project : t.project?._id;
      return projId === project._id;
    }),
  }));

  const applyFilters = (task) => {
    if (tagFilter && !task.tags?.includes(tagFilter)) return false;
    if (ownerFilter && !task.owners?.includes(ownerFilter)) return false;
    return true;
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
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

        <div className="col-md-10 p-4">
          <h2 className="mb-4 fw-bold">Project Reports</h2>

          <div className="d-flex gap-3 mb-4">
            <select
              className="form-select w-auto bg-light"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">Filter by Tag</option>
              {["Urgent", "Bug", "Client", "Feature"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="form-select w-auto bg-light"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="">Filter by Owner</option>
              {[
                { id: "John", name: "John" },
                { id: "Sam", name: "Sam" },
                { id: "Jane Smith", name: "Jane Smith" },
                { id: "Michael", name: "Michael" },
              ].map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {grouped.map(({ project, tasks }) => (
            <div key={project._id} className="mb-5">
              <h4 className="mb-3 fw-bold">{project.name}</h4>
              <p className="card-text text-muted">{project.description}</p>

              <table className="table table-bordered table-light">
                <thead className="table-primary">
                  <tr>
                    <th>Task</th>
                    <th>Owners</th>
                    <th>Tags</th>
                    <th>Due (Days)</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.filter(applyFilters).map((task) => (
                    <tr key={task._id}>
                      <td>{task.name}</td>
                      <td>
                        {task.owners.map((o, i) => (
                          <span key={i} className="badge bg-secondary me-1">
                            <td>{task.owners?.join(", ") || "-"}</td>
                          </span>
                        ))}
                      </td>

                      <td>
                        {task.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className={`badge me-1 ${
                              tag === "Urgent"
                                ? "bg-danger"
                                : tag === "Bug"
                                ? "bg-warning text-dark"
                                : tag === "Client"
                                ? "bg-info text-dark"
                                : "bg-success"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </td>

                      <td>{task.timeToComplete || "-"}</td>

                      <td>
                        <span
                          className={`badge ${
                            task.status === "Completed"
                              ? "bg-success"
                              : task.status === "In Progress"
                              ? "bg-warning text-dark"
                              : task.status === "Blocked"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tasks.filter(applyFilters).length === 0 && (
                <p className="text-muted">No tasks match the filters.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
