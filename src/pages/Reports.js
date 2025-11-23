import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const backend = "https://workasana-backend-three.vercel.app";
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${backend}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const lastWeek = new Array(7).fill(0);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  tasks.forEach((task) => {
    if (task.status === "Completed") {
      const day = new Date(task.updatedAt).getDay();
      lastWeek[day] += 1;
    }
  });

  const workDoneLastWeekData = {
    labels: days,
    datasets: [
      {
        label: "Completed Tasks",
        data: lastWeek,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const totalPending = tasks
    .filter((t) => t.status !== "Completed")
    .reduce((sum, t) => sum + (t.timeToComplete || 0), 0);

  const pendingWorkData = {
    labels: ["Pending Hours"],
    datasets: [
      {
        label: "Total Hours Pending",
        data: [totalPending],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const teamCount = {};
  tasks.forEach((t) => {
    if (t.status === "Completed") {
      teamCount[t.team] = (teamCount[t.team] || 0) + 1;
    }
  });

  const closedByTeamData = {
    labels: Object.keys(teamCount),
    datasets: [
      {
        label: "Tasks Closed",
        data: Object.values(teamCount),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 205, 86, 0.6)",
        ],
      },
    ],
  };

  const responsiveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      y: { beginAtZero: true },
    },
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
        <h2 className="fw-bold y mb-4">Reports</h2>

        <div className="card shadow-sm p-4 mb-4">
          <h4 className="mb-3">Total Work Done Last Week</h4>

          <div style={{ maxWidth: "500px", height: "280px" }}>
            <Bar data={workDoneLastWeekData} options={responsiveOptions} />
          </div>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h4 className="mb-3">Total Hours of Work Pending</h4>

          <div style={{ maxWidth: "500px", height: "280px" }}>
            <Bar data={pendingWorkData} options={responsiveOptions} />
          </div>
        </div>

        <div className="card shadow-sm p-4 mb-4">
          <h4 className="mb-3">Tasks Closed by Team</h4>

          <div style={{ maxWidth: "400px", height: "280px" }}>
            <Pie data={closedByTeamData} options={responsiveOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
