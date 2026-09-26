import React from "react";

import { ResumeProvider } from "./context/ResumeContext.jsx";
import ResumeBuilder from "./pages/ResumeBuilder/ResumeBuilder.jsx";

export default function App() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}
