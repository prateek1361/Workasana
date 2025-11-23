import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const members = [
  { id: "67375d6cf3f7c4f6ff3b5e11", name: "John" },
  { id: "67375d6cf3f7c4f6ff3b5e12", name: "Sam" },
  { id: "67375d6cf3f7c4f6ff3b5e13", name: "Jane Smith" },
  { id: "67375d6cf3f7c4f6ff3b5e14", name: "Michael" },
];

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const backend = "https://workasana-backend-three.vercel.app";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${backend}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTask(data));
  }, [id]);

  const markComplete = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${backend}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!res.ok) {
        toast.error("Failed to update task");
        return;
      }

      const updated = await res.json();
      setTask(updated);

      toast.success("Task marked as completed!");
    } catch (error) {
      toast.error("Error connecting to server");
    }
  };

  if (!task) return <div className="p-4">Loading...</div>;

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const daysRemaining = due
    ? Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    : "-";

  const ownerNames =
    task.owners
      ?.map((o) => o.name || members.find((m) => m.id === o)?.name)
      .join(", ") || "No owners";

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
      </div>

      <div className="p-4 flex-grow-1">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="card shadow-sm bg-light p-4">
          <h2 className="mb-4 fw-bold ">{task.name}</h2>

          <p>
            <strong>Project:</strong> {task.project?.name || "N/A"}
          </p>
          <p>
            <strong>Team:</strong> {task.team || "N/A"}
          </p>

          <p>
            <strong>Owners:</strong>{" "}
            {task.owners?.length ? task.owners.join(", ") : "No Owners"}
          </p>

          <p>
            <strong>Tags:</strong>{" "}
            <span className="badge rounded-pill bg-danger">
              {task.tags?.length ? task.tags.join(", ") : "No tags"}
            </span>
          </p>

          <div className="mb-3">
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge rounded-pill bg-primary">
                {task.status}
              </span>
            </p>

            <p>
              <strong>Time To Complete:</strong>{" "}
              {task.status === "Completed"
                ? "Completed"
                : task.timeToComplete + " hrs"}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <button
              className="btn btn-success px-4 py-2"
              onClick={markComplete}
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
