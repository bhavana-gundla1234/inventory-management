export  const BASE_URL ="https://inventory-management-backend-5rz0.onrender.com/api"
export const BASE_UPLOAD_URL = "https://inventory-management-backend-5rz0.onrender.com";
// export const BASE_URL = "http://localhost:5000/api";
// export const BASE_UPLOAD_URL = "http://localhost:5000";
 
export const apiRequest = async (url, method = "GET", body = null) => {
 
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;
 
  const options = {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
 
  if (!isFormData) {
    options.headers["Content-Type"] = "application/json";
  }
 
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }
 
  const res = await fetch(BASE_URL + url, options);
 
  return res.json();
};
 