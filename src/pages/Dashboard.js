import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]); // <-- ADDED
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("All");
  const [taskStatusFilter, setTaskStatusFilter] = useState("All");

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Planned",
  });

  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  });

  const tagsList = ["Urgent", "Bug", "Client", "Feature"];
  const members = [
    { id: "John", name: "John" },
    { id: "Sam", name: "Sam" },
    { id: "Jane Smith", name: "Jane Smith" },
    { id: "Michael", name: "Michael" },
  ];

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/projects",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/teams",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchTeams();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        }
      );

      if (res.ok) {
        toast.success("✅ Project created successfully!");
        setShowProjectModal(false);
        setNewProject({ name: "", description: "", status: "Planned" });
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const taskBody = {
      name: newTask.name,
      project: newTask.project,
      team: newTask.team,
      owners: newTask.owners,
      tags: newTask.tags,
      timeToComplete: Number(newTask.timeToComplete),
      status: newTask.status,
    };

    try {
      const res = await fetch(
        "https://workasana-backend-three.vercel.app/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskBody),
        }
      );

      if (res.ok) {
        toast.success("✅ Task created successfully!");
        setShowTaskModal(false);
        setNewTask({
          name: "",
          project: "",
          team: "",
          owners: [],
          tags: [],
          timeToComplete: "",
          status: "To Do",
        });
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMultiSelect = (field, value) => {
    setNewTask((prev) => {
      const updated = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (projectStatusFilter === "All" || p.status === projectStatusFilter)
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (taskStatusFilter === "All" || t.status === taskStatusFilter)
  );

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
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
          <div className="d-flex justify-content-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search projects and tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold">Projects</h2>

            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm bg-light"
                style={{ width: "150px" }}
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
              >
                {["All", "Planned", "In Progress", "Completed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowProjectModal(true)}
              >
                + New Project
              </button>
            </div>
          </div>

          <div className="row">
            {filteredProjects.length === 0 ? (
              <p className="text-muted">No projects available.</p>
            ) : (
              filteredProjects.map((project) => (
                <div key={project._id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm border-0 bg-light">
                    <div className="card-body">
                      <span
                        className={`badge ${
                          project.status === "Planned"
                            ? "bg-info text-dark"
                            : project.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {project.status}
                      </span>

                      <h3 className="card-title mt-2 fw-bold">
                        {project.name}
                      </h3>
                      <p className="text-muted">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h2 className="fw-bold">My Tasks</h2>

            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm bg-light"
                style={{ width: "150px" }}
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
              >
                {["All", "To Do", "In Progress", "Completed", "Blocked"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowTaskModal(true)}
              >
                + New Task
              </button>
            </div>
          </div>

          <div className="row">
            {filteredTasks.length === 0 ? (
              <p className="text-muted">No tasks available.</p>
            ) : (
              filteredTasks.map((task) => (
                <div key={task._id} className="col-md-4 mb-3">
                  <div
                    className="card h-100 shadow-sm border-0 bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    <div className="card-body">
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

                      <h3 className="card-title mt-2 fw-bold">{task.name}</h3>

                      {/* Team Name (plain string) */}
                      <p className="text-muted">
                        {task.team} — {task.owners.join(", ")}
                      </p>

                      <p className="small mt-2">
                        {task.tags?.map((t, i) => (
                          <span
                            key={i}
                            className="badge bg-secondary me-1"
                          >{`#${t}`}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showProjectModal && <div className="modal-backdrop show"></div>}
      <div
        className={`modal fade ${showProjectModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create New Project</h5>
              <button
                className="btn-close"
                onClick={() => setShowProjectModal(false)}
              ></button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="modal-body">
                <input
                  type="text"
                  required
                  className="form-control mb-3"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                ></textarea>

                <select
                  className="form-select"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
                  }
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showTaskModal && <div className="modal-backdrop show"></div>}
      <div
        className={`modal fade ${showTaskModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create New Task</h5>
              <button
                className="btn-close"
                onClick={() => setShowTaskModal(false)}
              ></button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="modal-body row">
                <div className="col-md-6 mb-3">
                  <label>Task Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newTask.name}
                    onChange={(e) =>
                      setNewTask({ ...newTask, name: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Project</label>
                  <select
                    className="form-select"
                    required
                    value={newTask.project}
                    onChange={(e) =>
                      setNewTask({ ...newTask, project: e.target.value })
                    }
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Owners</label>
                  {members.map((m) => (
                    <div key={m.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={newTask.owners.includes(m.id)}
                        onChange={() => handleMultiSelect("owners", m.id)}
                      />
                      <label className="form-check-label">{m.name}</label>
                    </div>
                  ))}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Tags</label>
                  {tagsList.map((t) => (
                    <div key={t} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={newTask.tags.includes(t)}
                        onChange={() => handleMultiSelect("tags", t)}
                      />
                      <label className="form-check-label">{t}</label>
                    </div>
                  ))}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Team</label>
                  <select
                    className="form-select"
                    required
                    value={newTask.team}
                    onChange={(e) =>
                      setNewTask({ ...newTask, team: e.target.value })
                    }
                  >
                    <option value="">Select Team</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Time to Complete (hrs)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newTask.timeToComplete}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        timeToComplete: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
