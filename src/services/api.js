const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function buildQuery(params = {}) {
  return new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== false && value !== null)
  ).toString();
}

async function request(path, options = {}) {
  const token = localStorage.getItem("repair-admin-token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  listUsers: () => request("/auth/users"),
  registerUser: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  listDocuments: (params = {}) => {
    const query = buildQuery(params);
    return request(`/documents${query ? `?${query}` : ""}`);
  },
  getDocument: (id) => request(`/documents/${id}`),
  createDocument: (payload) => request("/documents", { method: "POST", body: JSON.stringify(payload) }),
  updateDocument: (id, payload) => request(`/documents/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: "DELETE" }),
  listInventory: (params = {}) => {
    const query = buildQuery(params);
    return request(`/inventory${query ? `?${query}` : ""}`);
  },
  createInventory: (payload) => request("/inventory", { method: "POST", body: JSON.stringify(payload) }),
  updateInventory: (id, payload) => request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteInventory: (id) => request(`/inventory/${id}`, { method: "DELETE" }),
  syncGoogleSheets: (payload = {}) => request("/integrations/google-sheets/sync", { method: "POST", body: JSON.stringify(payload) }),
  getSheetsStatus: () => request("/integrations/google-sheets/status"),
  listLandingDevices: (params = {}) => {
    const query = buildQuery(params);
    return request(`/devices${query ? `?${query}` : ""}`);
  },
  listLandingParts: (params = {}) => {
    const query = buildQuery(params);
    return request(`/parts${query ? `?${query}` : ""}`);
  },
  createLandingCustomer: (payload) => request("/customers", { method: "POST", body: JSON.stringify(payload) }),
  listCustomers: (params = {}) => {
    const query = buildQuery(params);
    return request(`/customers${query ? `?${query}` : ""}`);
  },
  getLandingStats: () => request("/stats/dashboard"),
};
