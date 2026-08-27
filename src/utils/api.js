async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // Keep the generic message when the response is not JSON.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getAuth: () => request("/api/auth/me"),
  login: (username, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  getRecords: () => request("/api/records"),
  getRecord: (slug) => request(`/api/records/${encodeURIComponent(slug)}`),
  addRecord: (record) =>
    request("/api/records", {
      method: "POST",
      body: JSON.stringify(record),
    }),
  deleteRecord: (slug) =>
    request(`/api/records/${encodeURIComponent(slug)}`, { method: "DELETE" }),
};
