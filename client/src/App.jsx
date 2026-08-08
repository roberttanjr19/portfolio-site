import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainRouter from "../MainRouter";
import "./App.css";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <MainRouter />
            </AuthProvider>
        </Router>
    );
}
