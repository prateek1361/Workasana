const API_BASE_URL = "https://workasana-backend-three.vercel.app";

export const signupUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
