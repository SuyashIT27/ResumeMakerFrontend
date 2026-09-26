import React from "react";
import styles from "./ResumePreview.module.css";

const skillLabels = {
  programming: "Programming & Querying",
  frontend: "Frontend Technologies",
  backend: "Backend Technologies",
  databases: "Databases",
  testing: "Software Testing",
  tools: "Tools & Platforms",
  core: "Core Concepts",
};
function cleanUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
function displayUrl(value) {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
function hasText(value) {
  return typeof value === "string" && value.trim();
}

export default function ResumePreview({ resume }) {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    activities,
  } = resume;
  const contacts = [
    personal.email && { label: personal.email },
    personal.phone && { label: personal.phone },
    personal.location && { label: personal.location },
    personal.linkedin && {
      label: displayUrl(personal.linkedin),
      href: cleanUrl(personal.linkedin),
    },
    personal.github && {
      label: displayUrl(personal.github),
      href: cleanUrl(personal.github),
    },
    personal.portfolio && {
      label: displayUrl(personal.portfolio),
      href: cleanUrl(personal.portfolio),
    },
  ].filter(Boolean);
  const skillGroups = Object.entries(skills).filter(
    ([, values]) => Array.isArray(values) && values.length,
  );
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1>{personal.fullName || "Your Name"}</h1>
        {personal.jobTitle && (
          <div className={styles.jobTitle}>{personal.jobTitle}</div>
        )}
        {contacts.length > 0 && (
          <div className={styles.contact}>
            {contacts.map((item, index) => (
              <React.Fragment key={`${item.label}-${index}`}>
                {index > 0 && <span>|</span>}
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>
      {hasText(summary) && (
        <section>
          <h2>SUMMARY</h2>
          <p>{summary}</p>
        </section>
      )}
      {experience.length > 0 && (
        <section>
          <h2>EXPERIENCE</h2>
          {experience.map((item) => (
            <div className={styles.entry} key={item.id}>
              <div className={styles.entryHeader}>
                <strong>{item.role || "Job Title"}</strong>
                <span>
                  {item.startDate}
                  {(item.startDate || item.endDate || item.current) && " - "}
                  {item.current ? "Present" : item.endDate}
                </span>
              </div>
              {(item.company || item.location) && (
                <div className={styles.mutedLine}>
                  {item.company}
                  {item.location ? ` | ${item.location}` : ""}
                </div>
              )}
              {item.bullets.filter(Boolean).length > 0 && (
                <ul>
                  {item.bullets.filter(Boolean).map((b, i) => (
                    <li key={`${item.id}-${i}`}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section>
          <h2>PROJECTS</h2>
          {projects.map((item) => (
            <div className={styles.entry} key={item.id}>
              <div>
                <strong>{item.name || "Project Name"}</strong>
                {item.technologies && <span> | {item.technologies}</span>}
                {item.link && (
                  <>
                    <span> | </span>
                    <a
                      href={cleanUrl(item.link)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {displayUrl(item.link)}
                    </a>
                  </>
                )}
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul>
                  {item.bullets.filter(Boolean).map((b, i) => (
                    <li key={`${item.id}-${i}`}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section>
          <h2>EDUCATION</h2>
          {education.map((item) => (
            <div className={styles.entry} key={item.id}>
              <div className={styles.entryHeader}>
                <strong>{item.degree || "Degree"}</strong>
                <span>
                  {item.startDate}
                  {(item.startDate || item.endDate) && " - "}
                  {item.endDate}
                </span>
              </div>
              {(item.institution || item.location) && (
                <div className={styles.mutedLine}>
                  {item.institution}
                  {item.location ? ` | ${item.location}` : ""}
                </div>
              )}
              {item.details && <div>{item.details}</div>}
            </div>
          ))}
        </section>
      )}
      {skillGroups.length > 0 && (
        <section>
          <h2>SKILLS</h2>
          <div className={styles.skills}>
            {skillGroups.map(([category, values]) => (
              <div key={category}>
                <strong>{skillLabels[category] || category}:</strong>{" "}
                {values.join(", ")}
              </div>
            ))}
          </div>
        </section>
      )}
      {certifications.length > 0 && (
        <section>
          <h2>AWARDS & CERTIFICATIONS</h2>
          <ul>
            {certifications.filter(Boolean).map((item, i) => (
              <li key={`cert-${i}`}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {activities.length > 0 && (
        <section>
          <h2>EXTRA-CURRICULAR ACTIVITIES</h2>
          <ul>
            {activities.filter(Boolean).map((item, i) => (
              <li key={`activity-${i}`}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
