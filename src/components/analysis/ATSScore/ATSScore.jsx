import React, { useState } from "react";

import { analyzeATS } from "../../../services/api.js";
import styles from "./ATSScore.module.css";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function ATSScore({ resume }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError("");

      const response = await analyzeATS(
        resume,
        resume.targetJobDescription || ""
      );

      setResult(response.data);
    } catch (requestError) {
      setError(requestError.message || "ATS analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  const sectionScores = result?.sectionScores || {};
  const strengths = safeArray(result?.strengths);
  const issues = safeArray(result?.issues);
  const missingKeywords = safeArray(result?.missingKeywords);
  const recommendations = safeArray(result?.recommendations);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>ATS Analysis</h2>
          <p>
            Gemini estimates ATS compatibility and identifies optimization
            opportunities.
          </p>
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Check ATS Score"}
        </button>
      </div>

      {loading && (
        <div className={styles.loading} role="status" aria-live="polite">
          <div className={styles.spinner} />
          <strong>Gemini is analyzing your resume...</strong>
          <span>Checking keywords, sections, formatting and relevance.</span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {result && !loading && (
        <>
          <div className={styles.score}>
            <div>
              <span>ATS Compatibility</span>
              <strong>{Number(result.score) || 0}</strong>
              <small>/ 100</small>
            </div>
          </div>

          {result.summary && <p className={styles.summary}>{result.summary}</p>}

          <div className={styles.grid}>
            {Object.entries(sectionScores).map(([section, score]) => (
              <div className={styles.item} key={section}>
                <span>{section}</span>
                <strong>{Number(score) || 0}</strong>
              </div>
            ))}
          </div>

          <div className={styles.columns}>
            <div>
              <h3>Strengths</h3>
              {strengths.length > 0 ? (
                <ul>
                  {strengths.map((item, index) => (
                    <li key={`strength-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No strengths returned.</p>
              )}
            </div>

            <div>
              <h3>Issues</h3>
              {issues.length > 0 ? (
                <ul>
                  {issues.map((item, index) => (
                    <li key={`issue-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No issues returned.</p>
              )}
            </div>
          </div>

          {missingKeywords.length > 0 && (
            <>
              <h3>Missing Keywords</h3>
              <div className={styles.tags}>
                {missingKeywords.map((keyword, index) => (
                  <span key={`${keyword}-${index}`}>{keyword}</span>
                ))}
              </div>
            </>
          )}

          {recommendations.length > 0 && (
            <>
              <h3>Recommendations</h3>
              <ul>
                {recommendations.map((item, index) => (
                  <li key={`recommendation-${index}`}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  );
}
