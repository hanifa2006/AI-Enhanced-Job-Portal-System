import { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in as candidate.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load applications");
        } else {
          setApplications(data);
        }
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError("Something went wrong while loading applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>My Applications</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>My Applications</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {applications.map((app) => (
            <li
              key={app._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>{app.job?.title}</h3>
              <p>
                <strong>Company:</strong> {app.job?.companyName}
              </p>
              <p>
                <strong>Location:</strong> {app.job?.location}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Applied on:</strong>{" "}
                {new Date(app.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyApplications;