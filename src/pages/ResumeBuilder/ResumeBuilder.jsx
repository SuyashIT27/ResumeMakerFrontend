import React from "react";
import ResumeEditor from "../../components/ResumeEditor/ResumeEditor.jsx";
import ResumePreview from "../../components/ResumePreview/ResumePreview.jsx";
import ATSScore from "../../components/analysis/ATSScore/ATSScore.jsx";
import { useResume } from "../../context/ResumeContext.jsx";
import styles from "./ResumeBuilder.module.css";

const themes = [
  { id: "midnight", name: "Midnight", dot: "#111827" },
  { id: "ocean", name: "Ocean", dot: "#0369a1" },
  { id: "emerald", name: "Emerald", dot: "#047857" },
  { id: "sunset", name: "Sunset", dot: "#c2410c" },
];

export default function ResumeBuilder() {
  const { resume, resetResume, updateSettings } = useResume();
  const theme = resume.settings.theme || "midnight";
  function downloadPDF() {
    window.print();
  }
  return (
    <div className={styles.app} data-theme={theme}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.logo}>AI</div>
          <div>
            <strong>AI Resume Maker</strong>
            <span>Build smarter. Apply better.</span>
          </div>
        </div>
        <div className={styles.topActions}>
          <div className={styles.themePicker} aria-label="Theme selector">
            {themes.map((item) => (
              <button
                key={item.id}
                title={item.name}
                className={`${styles.themeDot} ${theme === item.id ? styles.activeTheme : ""}`}
                style={{ "--dot": item.dot }}
                onClick={() => updateSettings("theme", item.id)}
                type="button"
              />
            ))}
          </div>
          <button
            className={styles.secondary}
            type="button"
            onClick={resetResume}
          >
            Reset
          </button>
          <button
            className={styles.primary}
            type="button"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </header>
      <main className={styles.container}>
        <div className={styles.hero}>
          <div>
            <span className={styles.badge}>AI-POWERED • ATS READY</span>
            <h1>Create a resume that gets noticed.</h1>
            <p>
              Write once, preview live, optimize with Gemini and keep your
              resume data saved locally.
            </p>
          </div>
          <div className={styles.heroStat}>
            <strong>Live</strong>
            <span>Preview</span>
          </div>
        </div>
        <div className={styles.workspace}>
          <div className={styles.left}>
            <ResumeEditor />
            <ATSScore resume={resume} />
          </div>
          <aside className={styles.right}>
            <div className={styles.previewBar}>
              <div>
                <strong>Live Preview</strong>
                <span>A4 • ATS-friendly</span>
              </div>
              <span className={styles.live}>
                <i /> LIVE
              </span>
            </div>
            <div className={styles.previewShell}>
              <ResumePreview resume={resume} />
            </div>
          </aside>
        </div>
      </main>
      <footer className={styles.footer}>
        <div>
          <strong>AI Resume Maker</strong>
          <span>Build your career story with clarity and confidence.</span>
        </div>
        <div className={styles.credit}>
          Made by <strong>Suyash Verma</strong> • B.Tech in Information
          Technology
        </div>
      </footer>
    </div>
  );
}
