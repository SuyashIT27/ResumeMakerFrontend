import React, { createContext, useContext, useMemo } from "react";
import { createDefaultResume, normalizeResume } from "../data/defaultResume.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [storedResume, setStoredResume] = useLocalStorage("resume-maker-data", createDefaultResume);
  const resume = useMemo(() => normalizeResume(storedResume), [storedResume]);

  function setResume(updater) {
    setStoredResume((previous) => {
      const current = normalizeResume(previous);
      const next = typeof updater === "function" ? updater(current) : updater;
      return normalizeResume(next);
    });
  }

  function updatePersonal(field, value) {
    setResume((previous) => ({ ...previous, personal: { ...previous.personal, [field]: value } }));
  }

  function updateSettings(field, value) {
    setResume((previous) => ({ ...previous, settings: { ...previous.settings, [field]: value } }));
  }

  function resetResume() {
    setStoredResume(createDefaultResume());
  }

  const value = useMemo(
    () => ({ resume, setResume, updatePersonal, updateSettings, resetResume }),
    [resume]
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error("useResume must be used inside ResumeProvider.");
  return context;
}
