export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDefaultResume() {
  return {
    personal: {
      fullName: "",
      jobTitle: "Full Stack Developer",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
      programming: [],
      frontend: [],
      backend: [],
      databases: [],
      testing: [],
      tools: [],
      core: [],
    },
    projects: [],
    certifications: [],
    activities: [],
    targetJobDescription: "",
    settings: {
      template: "atsClassic",
      theme: "midnight",
      font: "Arial",
      fontSize: 10.5,
    },
  };
}

const asString = (value) => (typeof value === "string" ? value : "");
const asArray = (value) => (Array.isArray(value) ? value : []);

function normalizeEntry(entry, fields) {
  const source = entry && typeof entry === "object" ? entry : {};
  const result = { ...source, id: source.id || createId() };

  fields.forEach((field) => {
    if (field === "bullets") result[field] = asArray(source[field]).map(asString);
    else if (field === "current") result[field] = Boolean(source[field]);
    else result[field] = asString(source[field]);
  });

  return result;
}

export function normalizeResume(value) {
  const defaults = createDefaultResume();
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;

  const personal = value.personal && typeof value.personal === "object" ? value.personal : {};
  const rawSkills = value.skills && typeof value.skills === "object" ? value.skills : {};
  const rawSettings = value.settings && typeof value.settings === "object" ? value.settings : {};

  return {
    ...defaults,
    ...value,
    personal: Object.fromEntries(
      Object.keys(defaults.personal).map((key) => [key, asString(personal[key])])
    ),
    summary: asString(value.summary),
    experience: asArray(value.experience).map((item) =>
      normalizeEntry(item, ["company", "role", "location", "startDate", "endDate", "current", "bullets"])
    ),
    education: asArray(value.education).map((item) =>
      normalizeEntry(item, ["institution", "degree", "location", "startDate", "endDate", "details"])
    ),
    projects: asArray(value.projects).map((item) =>
      normalizeEntry(item, ["name", "technologies", "link", "bullets"])
    ),
    skills: Object.fromEntries(
      Object.keys(defaults.skills).map((category) => [category, asArray(rawSkills[category]).map(asString).filter(Boolean)])
    ),
    certifications: asArray(value.certifications).map(asString).filter(Boolean),
    activities: asArray(value.activities).map(asString).filter(Boolean),
    targetJobDescription: asString(value.targetJobDescription),
    settings: {
      ...defaults.settings,
      ...rawSettings,
      theme: ["midnight", "ocean", "emerald", "sunset"].includes(rawSettings.theme)
        ? rawSettings.theme
        : defaults.settings.theme,
    },
  };
}
