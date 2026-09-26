import React, { useState } from "react";
import { createId } from "../../data/defaultResume.js";
import { useResume } from "../../context/ResumeContext.jsx";
import { improveText } from "../../services/api.js";
import styles from "./ResumeEditor.module.css";

const skillLabels = {
  programming: "Programming & Querying",
  frontend: "Frontend Technologies",
  backend: "Backend Technologies",
  databases: "Databases",
  testing: "Software Testing",
  tools: "Tools & Platforms",
  core: "Core Concepts",
};

function createExperience() {
  return { id: createId(), company: "", role: "", location: "", startDate: "", endDate: "", current: false, bullets: [""] };
}
function createEducation() {
  return { id: createId(), institution: "", degree: "", location: "", startDate: "", endDate: "", details: "" };
}
function createProject() {
  return { id: createId(), name: "", technologies: "", link: "", bullets: [""] };
}

export default function ResumeEditor() {
  const { resume, setResume, updatePersonal } = useResume();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const updateSection = (section, value) => setResume((previous) => ({ ...previous, [section]: value }));
  const updateItem = (section, id, field, value) =>
    updateSection(section, resume[section].map((item) => item.id === id ? { ...item, [field]: value } : item));

  const addSimpleItem = (section) => updateSection(section, [...resume[section], ""]);
  const updateSimpleItem = (section, index, value) => updateSection(section, resume[section].map((item, i) => i === index ? value : item));
  const removeSimpleItem = (section, index) => updateSection(section, resume[section].filter((_, i) => i !== index));

  async function improveSummary() {
    if (!resume.summary.trim()) {
      setAiError("Write a summary first, then ask Gemini to improve it.");
      return;
    }
    try {
      setAiLoading(true);
      setAiError("");
      const response = await improveText("summary", resume.summary, JSON.stringify(resume.personal));
      updateSection("summary", response.data.text);
    } catch (error) {
      setAiError(error.message || "Unable to improve the summary.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={styles.editor}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>01</span><h2>Personal Information</h2><p>Start with the details recruiters need to contact you.</p></div></div>
        <div className={styles.formGrid}>
          {[['fullName','Full Name'],['jobTitle','Target Job Title'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn URL'],['github','GitHub URL'],['portfolio','Portfolio URL']].map(([field, placeholder]) => (
            <input key={field} type="text" placeholder={placeholder} value={resume.personal[field] || ""} onChange={(e) => updatePersonal(field, e.target.value)} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>02</span><h2>Professional Summary</h2><p>Keep it concise, specific and aligned with your target role.</p></div><button type="button" onClick={improveSummary} disabled={aiLoading}>{aiLoading ? "AI Working…" : "✦ Improve with Gemini"}</button></div>
        {aiError && <div className={styles.error}>{aiError}</div>}
        <textarea rows={7} placeholder="Write your professional summary..." value={resume.summary} onChange={(e) => updateSection("summary", e.target.value)} />
      </section>

      <section className={styles.section}>
        <SectionHeading number="03" title="Experience" description="Add internships, jobs and practical development work." action={<button type="button" onClick={() => updateSection("experience", [...resume.experience, createExperience()])}>+ Add Experience</button>} />
        {resume.experience.map((item) => (
          <div className={styles.card} key={item.id}>
            <div className={styles.cardTitle}><strong>{item.role || "New Experience"}</strong><button type="button" className={styles.iconDanger} onClick={() => updateSection("experience", resume.experience.filter((entry) => entry.id !== item.id))}>Remove</button></div>
            <div className={styles.formGrid}>
              <input placeholder="Job Title" value={item.role} onChange={(e) => updateItem("experience", item.id, "role", e.target.value)} />
              <input placeholder="Company" value={item.company} onChange={(e) => updateItem("experience", item.id, "company", e.target.value)} />
              <input placeholder="Location" value={item.location} onChange={(e) => updateItem("experience", item.id, "location", e.target.value)} />
              <input placeholder="Start Date" value={item.startDate} onChange={(e) => updateItem("experience", item.id, "startDate", e.target.value)} />
              <input placeholder="End Date" disabled={item.current} value={item.endDate} onChange={(e) => updateItem("experience", item.id, "endDate", e.target.value)} />
            </div>
            <label className={styles.checkbox}><input type="checkbox" checked={item.current} onChange={(e) => updateItem("experience", item.id, "current", e.target.checked)} /> Currently working here</label>
            <textarea rows={6} placeholder="One achievement bullet per line" value={item.bullets.join("\n")} onChange={(e) => updateItem("experience", item.id, "bullets", e.target.value.split("\n"))} />
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionHeading number="04" title="Projects" description="Show measurable work, technologies and outcomes." action={<button type="button" onClick={() => updateSection("projects", [...resume.projects, createProject()])}>+ Add Project</button>} />
        {resume.projects.map((item) => (
          <div className={styles.card} key={item.id}>
            <div className={styles.cardTitle}><strong>{item.name || "New Project"}</strong><button type="button" className={styles.iconDanger} onClick={() => updateSection("projects", resume.projects.filter((entry) => entry.id !== item.id))}>Remove</button></div>
            <div className={styles.formGrid}>
              <input placeholder="Project Name" value={item.name} onChange={(e) => updateItem("projects", item.id, "name", e.target.value)} />
              <input placeholder="Technologies" value={item.technologies} onChange={(e) => updateItem("projects", item.id, "technologies", e.target.value)} />
              <input type="url" placeholder="Project URL" value={item.link} onChange={(e) => updateItem("projects", item.id, "link", e.target.value)} />
            </div>
            <textarea rows={5} placeholder="One achievement bullet per line" value={item.bullets.join("\n")} onChange={(e) => updateItem("projects", item.id, "bullets", e.target.value.split("\n"))} />
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionHeading number="05" title="Education" description="Add your degrees, institutions and academic details." action={<button type="button" onClick={() => updateSection("education", [...resume.education, createEducation()])}>+ Add Education</button>} />
        {resume.education.map((item) => (
          <div className={styles.card} key={item.id}>
            <div className={styles.cardTitle}><strong>{item.degree || "New Education"}</strong><button type="button" className={styles.iconDanger} onClick={() => updateSection("education", resume.education.filter((entry) => entry.id !== item.id))}>Remove</button></div>
            <div className={styles.formGrid}>
              <input placeholder="Degree / Program" value={item.degree} onChange={(e) => updateItem("education", item.id, "degree", e.target.value)} />
              <input placeholder="Institution" value={item.institution} onChange={(e) => updateItem("education", item.id, "institution", e.target.value)} />
              <input placeholder="Location" value={item.location} onChange={(e) => updateItem("education", item.id, "location", e.target.value)} />
              <input placeholder="Start Year" value={item.startDate} onChange={(e) => updateItem("education", item.id, "startDate", e.target.value)} />
              <input placeholder="End Year" value={item.endDate} onChange={(e) => updateItem("education", item.id, "endDate", e.target.value)} />
            </div>
            <textarea placeholder="Relevant coursework, CGPA or academic details" value={item.details} onChange={(e) => updateItem("education", item.id, "details", e.target.value)} />
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionHeading number="06" title="Skills" description="Organize skills by recruiter-friendly categories." action={null} />
        <div className={styles.skillEditor}>
          {Object.entries(skillLabels).map(([category, label]) => (
            <div className={styles.skillCategory} key={category}>
              <label>{label}</label>
              <input placeholder="Type skills separated by commas" value={resume.skills[category].join(", ")} onChange={(e) => updateSection("skills", { ...resume.skills, [category]: e.target.value.split(",").map((skill) => skill.trim()).filter(Boolean) })} />
            </div>
          ))}
        </div>
      </section>

      <SimpleListSection number="07" title="Awards & Certifications" description="Add certifications, awards and credentials." items={resume.certifications} section="certifications" addLabel="+ Add Certification" addSimpleItem={addSimpleItem} updateSimpleItem={updateSimpleItem} removeSimpleItem={removeSimpleItem} />
      <SimpleListSection number="08" title="Extra-Curricular Activities" description="Highlight leadership, clubs, volunteering and meaningful activities." items={resume.activities} section="activities" addLabel="+ Add Activity" addSimpleItem={addSimpleItem} updateSimpleItem={updateSimpleItem} removeSimpleItem={removeSimpleItem} />

      <section className={styles.section}>
        <SectionHeading number="09" title="Target Job Description" description="Optional — paste a job description to improve Gemini's ATS keyword analysis." action={null} />
        <textarea rows={9} placeholder="Paste the job description here..." value={resume.targetJobDescription} onChange={(e) => updateSection("targetJobDescription", e.target.value)} />
      </section>
    </div>
  );
}

function SectionHeading({ number, title, description, action }) {
  return <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>{number}</span><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function CardTitle() { return null; }

function SimpleListSection({ number, title, description, items, section, addLabel, addSimpleItem, updateSimpleItem, removeSimpleItem }) {
  return (
    <section className={styles.section}>
      <SectionHeading number={number} title={title} description={description} action={<button type="button" onClick={() => addSimpleItem(section)}>{addLabel}</button>} />
      <div className={styles.simpleList}>
        {items.map((item, index) => <div className={styles.simpleRow} key={`${section}-${index}`}><input placeholder={title === "Awards & Certifications" ? "Certification or award name" : "Activity or leadership experience"} value={item} onChange={(e) => updateSimpleItem(section, index, e.target.value)} /><button type="button" className={styles.iconDanger} onClick={() => removeSimpleItem(section, index)}>Remove</button></div>)}
      </div>
    </section>
  );
}
