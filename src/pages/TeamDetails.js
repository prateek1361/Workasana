import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState("");

  const token = localStorage.getItem("token");

  const fetchTeam = async () => {
    const res = await fetch(
      `https://workasana-backend-three.vercel.app/teams/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setTeam(data);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();

    const updatedMembers = [...team.members, newMember];

    const res = await fetch(
      `https://workasana-backend-three.vercel.app/teams/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ members: updatedMembers }),
      }
    );

    if (res.ok) {
      toast.success("Member added!");
      setShowModal(false);
      setNewMember("");
      fetchTeam();
    }
  };

  if (!team) return <p>Loading...</p>;

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
      </div>

      <div
        className="p-4"
        style={{ flexGrow: 1, filter: showModal ? "blur(5px)" : "none" }}
      >
        <h2 className="mb-4 fw-bold">{team.name}</h2>

        <h5>Team Members</h5>

        <div className="d-flex mb-3">
          {team.members && team.members.length > 0 ? (
            team.members.map((member, index) => {
              const initial = member.charAt(0).toUpperCase();
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
                    width: "40px",
                    height: "40px",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {initial}
                </div>
              );
            })
          ) : (
            <p>No members</p>
          )}
        </div>

        <ul>
          {team.members.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>

        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowModal(true)}
        >
          + Add Member
        </button>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}

      <div className={`modal fade ${showModal ? "show d-block" : ""}`}>
        <div className="modal-dialog modal-dialog-centered modal-sm-custom">
          <div className="modal-content">
            <form onSubmit={handleAddMember}>
              <div className="modal-header">
                <h5 className="modal-title">Add New Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Member Name</label>
                <input
                  className="form-control"
                  required
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Enter member name"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
