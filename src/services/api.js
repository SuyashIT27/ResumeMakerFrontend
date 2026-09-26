const API_URL = (
  import.meta.env.VITE_API_URL || "https://ai-resume-maker-3dw7.onrender.com"
).replace(/\/$/, "");

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(
      `Cannot connect to the backend at ${API_URL}. Start the backend server and try again.`,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed with status ${response.status}.`,
    );
  }

  return data;
}

export function analyzeATS(resume, jobDescription = "") {
  return request("/ats/analyze", {
    method: "POST",
    body: JSON.stringify({ resume, jobDescription }),
  });
}

export function checkLanguage(text) {
  return request("/language/check", {
    method: "POST",
    body: JSON.stringify({ text, language: "en-US" }),
  });
}

export function improveText(type, text, context = "") {
  return request("/ai/improve", {
    method: "POST",
    body: JSON.stringify({ type, text, context }),
  });
}
