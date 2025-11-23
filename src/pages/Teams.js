import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: ["", "", ""],
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTeams = async () => {
    const res = await fetch(
      "https://workasana-backend-three.vercel.app/teams",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://workasana-backend-three.vercel.app/teams",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTeam),
      }
    );

    if (res.ok) {
      setShowModal(false);
      setNewTeam({ name: "", members: ["", "", ""] });
      fetchTeams();
      toast.success("✅ Team created successfully!");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`d-flex ${showModal ? "modal-open" : ""}`}>
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

      <div
        className="p-4"
        style={{ flexGrow: 1, filter: showModal ? "blur(5px)" : "none" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Teams</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Team
          </button>
        </div>

        <div className="row">
          {teams.length === 0 ? (
            <p>No teams available</p>
          ) : (
            teams.map((t) => (
              <div key={t._id} className="col-md-4 mb-3 ">
                <div
                  className="card p-3 shadow-sm bg-primary-subtle"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/teams/${t._id}`)}
                >
                  <h5 className="mb-2">{t.name}</h5>

                  <div className="d-flex mt-2">
                    {t.members && t.members.length > 0 ? (
                      t.members.map((m, index) => {
                        if (!m) return null;
                        const initial = m.charAt(0).toUpperCase();
                        const colors = [
                          "bg-primary",
                          "bg-success",
                          "bg-danger",
                          "bg-warning",
                          "bg-info",
                        ];
                        const color = colors[index % colors.length];

                        return (
                          <div
                            key={index}
                            className={`${color} text-white rounded-circle d-flex justify-content-center align-items-center me-2`}
                            style={{
                              width: "35px",
                              height: "35px",
                              fontWeight: "bold",
                            }}
                          >
                            {initial}
                          </div>
                        );
                      })
                    ) : (
                      <small className="text-muted">No members</small>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}
      <div className={`modal fade ${showModal ? "show d-block" : ""}`}>
        <div className="modal-dialog modal-dialog-centered modal-sm-custom">
          <div className="modal-content">
            <form onSubmit={handleCreateTeam}>
              <div className="modal-header">
                <h5 className="modal-title">Create New Team</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Team Name</label>
                <input
                  className="form-control mb-3"
                  required
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, name: e.target.value })
                  }
                />

                {["Member 1", "Member 2", "Member 3"].map((label, index) => (
                  <input
                    key={index}
                    className="form-control mb-2"
                    placeholder={label}
                    value={newTeam.members[index]}
                    onChange={(e) => {
                      const updatedMembers = [...newTeam.members];
                      updatedMembers[index] = e.target.value;
                      setNewTeam({ ...newTeam, members: updatedMembers });
                    }}
                  />
                ))}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
