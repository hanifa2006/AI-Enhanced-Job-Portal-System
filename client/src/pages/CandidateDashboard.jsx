import { useEffect, useState } from "react";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load jobs");
        } else {
          setJobs(data);
        }
      } catch (err) {
        console.error("Fetch jobs error:", err);
        setError("Something went wrong while loading jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setApplyMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApplyMessage("You must be logged in as candidate to apply.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          resumeUrl: "", // later we can add real resume upload/link
          coverLetter: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApplyMessage(data.message || "Failed to apply for job");
      } else {
        setApplyMessage("Application submitted successfully.");
      }
    } catch (error) {
      console.error("Apply job error:", error);
      setApplyMessage("Something went wrong while applying");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Candidate Dashboard</h2>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Candidate Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Candidate Dashboard</h2>
      {applyMessage && <p style={{ marginBottom: "1rem" }}>{applyMessage}</p>}
      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li
              key={job._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.companyName}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Type:</strong> {job.employmentType}
              </p>
              {job.salaryRange && (
                <p>
                  <strong>Salary:</strong> {job.salaryRange}
                </p>
              )}
              <p>{job.description}</p>
              {job.skills && job.skills.length > 0 && (
                <p>
                  <strong>Skills:</strong> {job.skills.join(", ")}
                </p>
              )}
              <button onClick={() => handleApply(job._id)}>
                Apply
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CandidateDashboard;