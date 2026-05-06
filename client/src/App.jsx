import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <div>
      <header className="header">
        <h1>AI-Enhanced Job Portal System</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard/candidate">Candidate</Link>
          <Link to="/dashboard/employer">Employer</Link>
          <Link to="/dashboard/admin">Admin</Link>
          <Link to="/my-applications">My Applications</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="page">
                <h2>Welcome to the AI-Enhanced Job Portal</h2>
                <p>Select your role and start using the portal.</p>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard/candidate"
            element={<CandidateDashboard />}
          />
          <Route
            path="/dashboard/employer"
            element={<EmployerDashboard />}
          />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;