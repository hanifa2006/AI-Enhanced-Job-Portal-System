import { useState } from "react";

function EmployerDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    employmentType: "internship",
    salaryRange: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as employer.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          skills: form.skills
            ? form.skills.split(",").map((s) => s.trim())
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create job");
      } else {
        setMessage("Job created successfully.");
        // Optional: clear form
        // setForm({
        //   title: "",
        //   description: "",
        //   companyName: "",
        //   location: "",
        //   employmentType: "internship",
        //   salaryRange: "",
        //   skills: "",
        // });
      }
    } catch (error) {
      console.error("Create job error:", error);
      setMessage("Something went wrong while creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Employer Dashboard</h2>
      <p>Create a new job posting:</p>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          type="text"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="companyName"
          type="text"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <select
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
        <input
          name="salaryRange"
          type="text"
          placeholder="Salary Range (e.g. 5–8 LPA)"
          value={form.salaryRange}
          onChange={handleChange}
        />
        <input
          name="skills"
          type="text"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Post Job"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default EmployerDashboard;