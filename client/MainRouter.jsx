import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./src/components/layout";
import Home from "./src/components/home";
import About from "./src/pages/About";
import Education from "./src/pages/Education";
import Project from "./src/pages/Project";
import Contact from "./src/pages/Contact";
import SignUp from "./src/pages/SignUp";
import SignIn from "./src/pages/SignIn";
import ProtectedRoute from "./src/components/ProtectedRoute";

export default function MainRouter() {
    return (
        <Routes>
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                <Route path="education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
                <Route path="projects" element={<ProtectedRoute><Project /></ProtectedRoute>} />
                <Route path="project" element={<Navigate to="/projects" replace />} />
            </Route>
        </Routes>
    );
}
