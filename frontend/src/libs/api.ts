export default async function api(endpoint: string, options?: RequestInit) {
  let API_URL = `https://circleforms.net/api${endpoint}`;
  if (process.env.NODE_ENV === "development") {
    API_URL = `http://localhost/api${endpoint}`;
  }

  const response = await fetch(API_URL, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    ...options
  });

  // why do we need this?
  if (response.status === 204) {
    return null;
  }

  const responseData = await response.json();

  if (response.ok) {
    return responseData;
  }

  throw responseData;
}
