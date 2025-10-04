import axios from "axios"

export const axiosInstance = axios.create({})

export const apiConnector = (method, url, bodyData, headers, params) => {
  // Get token from localStorage
  const token = localStorage.getItem("token") || 
                localStorage.getItem("authToken") ||
                document.cookie.split('; ')
                  .find(row => row.startsWith('token='))
                  ?.split('=')[1];

  // Default headers
  const defaultHeaders = {};

  // Only set Content-Type for non-FormData requests
  if (!(bodyData instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Merge with custom headers
  const finalHeaders = { ...defaultHeaders, ...headers };

  console.log("🔍 API Request Details:");
  console.log("URL:", url);
  console.log("Method:", method);
  console.log("Token:", token ? "✅ Present" : "❌ Missing");
  console.log("Is FormData:", bodyData instanceof FormData);
  console.log("Headers:", finalHeaders);

  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: finalHeaders,
    params: params ? params : null,
  })
}