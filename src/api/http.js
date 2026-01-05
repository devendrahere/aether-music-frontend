const BASE_URL = "http://localhost:8080";

export async function httpRequest(
  url,
  {
    method = "GET",
    body,
    headers = {},
    authCritical = false, 
  } = {}
) {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(BASE_URL + url, {
    method,
    headers: finalHeaders,
    body:
      body instanceof FormData
        ? body
        : body
        ? JSON.stringify(body)
        : undefined,
  });

  if ((response.status === 401 || response.status === 403) && authCritical) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const err = new Error("UNAUTHORIZED");
    err.code = response.status;
    throw err;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  if (response.status === 204) return null;

  return response.json();
}
