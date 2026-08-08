/**
 * LAYOUT COMPONENT
 * Shared site wrapper with header, navigation, footer, and outlet for page content
 * Handles responsive mobile menu toggle, smooth scrolling on page navigation
 */

import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { CloseIcon, MenuIcon } from "./icons";
import { navLinks } from "../data/portfolio-data";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
    // State for mobile menu open/close toggle
    const [menuOpen, setMenuOpen] = useState(false);
    // Get current page location to detect route changes
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // Get current year for footer copyright
    const currentYear = new Date().getFullYear();

    function handleLogout() {
        setMenuOpen(false);
        logout();
        navigate("/signin");
    }

    // Smooth scroll to top when navigation occurs
    // Dependency: triggers when location.pathname changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <div className="site-shell">
            <header className="site-header">
                <div className="site-header__inner">
                    {/* Site brand/logo that links to home */}
                    <NavLink to="/" className="site-brand" aria-label="Robert Jr. portfolio home">
                        <span className="site-brand__mark">RJ</span>
                        <span className="site-brand__text">
                            <strong>Robert Jr.</strong>
                            <span>Software Engineering Student</span>
                        </span>
                    </NavLink>

                    {/* Mobile menu toggle button - shows/hides navigation on small screens */}
                    <button
                        type="button"
                        className="nav-toggle"
                        aria-expanded={menuOpen}
                        aria-controls="primary-navigation"
                        onClick={() => setMenuOpen((previousState) => !previousState)}
                    >
                        {menuOpen ? <CloseIcon className="icon icon-small" /> : <MenuIcon className="icon icon-small" />}
                        <span>{menuOpen ? "Close" : "Menu"}</span>
                    </button>

                    {/* Primary navigation menu - maps over navLinks from data */}
                    {/* Closes menu on link click and applies active state styling */}
                    <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} id="primary-navigation">
                        {navLinks.map((navigationLink) => (
                            <NavLink
                                key={navigationLink.to}
                                to={navigationLink.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `site-nav__link ${isActive ? "site-nav__link--active" : ""}`}
                            >
                                {navigationLink.label}
                            </NavLink>
                        ))}

                        {/* Auth section - shows welcome/logout when signed in, sign in/up links otherwise */}
                        <div className="site-nav__auth">
                            {user ? (
                                <>
                                    <span className="site-nav__welcome">Welcome, {user.name}</span>
                                    <button type="button" className="secondary-button secondary-button--small" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/signin"
                                        onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) => `site-nav__link ${isActive ? "site-nav__link--active" : ""}`}
                                    >
                                        Sign In
                                    </NavLink>
                                    <NavLink
                                        to="/signup"
                                        onClick={() => setMenuOpen(false)}
                                        className="secondary-button secondary-button--small"
                                    >
                                        Sign Up
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="site-main">
                <Outlet />
            </main>

            <footer className="site-footer">
                {/* Dynamic footer with current year for copyright */}
                <p>© {currentYear} Robert Jr. All Rights Reserved.</p>
                <p>Built with React + Vite</p>
            </footer>
        </div>
    );
}