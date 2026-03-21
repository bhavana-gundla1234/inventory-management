// const BASE_URL = "http://localhost:5000/api";
 const BASE_URL ="https://inventory-management-backend-5rz0.onrender.com/"

export const apiRequest = async (url, method = "GET", body = null) => {

  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);

  return res.json();
};