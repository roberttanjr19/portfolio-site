/**
 * PROJECTS PAGE COMPONENT
 * Displays the static portfolio showcase grid, plus a database-backed
 * project records section (list + admin-only add/edit/delete form)
 */

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { projects as staticProjects } from "../data/portfolio-data";
import { BugIcon, GalleryIcon, ProjectIcon } from "../components/icons";
import { useAuth } from "../context/AuthContext";
import { getAllProjects, createProject, updateProject, deleteProject } from "../services/api";
import { getErrorMessage, formatDate } from "../utils/formHelpers";

/**
 * ProjectCardIcon Component
 * Renders the appropriate icon based on project type
 * @param {string} projectIconType - Icon type from project data (bug, gallery, or default project)
 * @returns {JSX.Element} Icon component
 */
function ProjectCardIcon({ projectIconType }) {
    if (projectIconType === "bug") {
        return <BugIcon className="icon icon-small" />;
    }

    if (projectIconType === "gallery") {
        return <GalleryIcon className="icon icon-small" />;
    }

    return <ProjectIcon className="icon icon-small" />;
}

/**
 * Project Component
 * Renders the static showcase grid, then a DB-backed project records list
 * with an admin-only add/edit/delete form
 */
export default function Project() {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = user?.role === 'admin';
    const formSectionRef = useRef(null);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            firstname: "",
            lastname: "",
            email: "",
            completion: "",
            description: "",
        },
    });

    async function fetchProjects() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllProjects();
            setProjects(data);
        } catch (err) {
            console.error("Failed to load projects:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function onSubmit(data) {
        setError(null);
        try {
            if (editingId) {
                await updateProject(editingId, data);
                setSuccessMessage("Project updated successfully!");
            } else {
                await createProject(data);
                setSuccessMessage("Project added successfully!");
            }
            await fetchProjects();
            reset();
            setEditingId(null);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Failed to save project:", err);
            setError(getErrorMessage(err));
        }
    }

    function handleEdit(project) {
        setEditingId(project._id);
        setSuccessMessage("");
        setError(null);
        reset({
            title: project.title || "",
            firstname: project.firstname || "",
            lastname: project.lastname || "",
            email: project.email || "",
            completion: project.completion ? project.completion.slice(0, 10) : "",
            description: project.description || "",
        });
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleCancelEdit() {
        reset({ title: "", firstname: "", lastname: "", email: "", completion: "", description: "" });
        setEditingId(null);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure?")) return;
        setError(null);
        try {
            await deleteProject(id);
            await fetchProjects();
            setSuccessMessage("Project deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Failed to delete project:", err);
            setError(getErrorMessage(err));
        }
    }

    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">Projects</p>
                <h1>Course projects</h1>
            </header>

            <div className="project-grid">
                {/* Map projects array and render a card for each */}
                {/* Using project.id as stable React key instead of array index */}
                {staticProjects.map((portfolioProject) => (
                    <article key={portfolioProject.id} className="project-card fade-in">
                        {/* Project image and media section */}
                        <div className="project-media" aria-label={portfolioProject.mediaLabel}>
                            <img src={portfolioProject.image} alt={`${portfolioProject.title} screenshot`} className="project-media__image" />
                            <div className="project-media__label">
                                <ProjectCardIcon projectIconType={portfolioProject.icon} />
                                <span>{portfolioProject.mediaLabel}</span>
                            </div>
                        </div>

                        {/* Project details: title, description, technologies, link */}
                        <div className="project-card__body">
                            <h2>{portfolioProject.title}</h2>
                            <p>{portfolioProject.description}</p>

                            {/* Technology tags */}
                            <div className="tech-list" aria-label={`${portfolioProject.title} technologies`}>
                                {portfolioProject.technologies.map((technologyName) => (
                                    <span key={`${portfolioProject.id}-${technologyName}`} className="tech-pill">
                                        {technologyName}
                                    </span>
                                ))}
                            </div>

                            {/* GitHub button */}
                            <div className="project-actions">
                                <a className="secondary-button secondary-button--small" href="#" onClick={(event) => event.preventDefault()}>
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <header className="section-block fade-in">
                <p className="section-kicker">Manage Projects</p>
                <h2 className="contact-form-heading">Project Records</h2>
            </header>

            {error && (
                <p className="contact-form__banner contact-form__banner--error" role="alert">
                    {error}
                </p>
            )}
            {successMessage && (
                <p className="contact-form__banner contact-form__banner--success" role="status">
                    {successMessage}
                </p>
            )}

            {loading ? (
                <p className="section-block fade-in">Loading projects...</p>
            ) : (
                <div className="timeline fade-in">
                    {projects.length === 0 && <p>No projects added yet.</p>}
                    {projects.map((project) => (
                        <article key={project._id} className="timeline-item">
                            <div className="timeline-marker" aria-hidden="true">
                                <ProjectIcon className="icon icon-small" />
                            </div>
                            <div className="timeline-card">
                                <p className="timeline-meta">{formatDate(project.completion) || "In progress"}</p>
                                <h2>{project.title}</h2>
                                <ul className="timeline-list">
                                    {(project.firstname || project.lastname) && (
                                        <li>{[project.firstname, project.lastname].filter(Boolean).join(" ")}</li>
                                    )}
                                    {project.email && <li>{project.email}</li>}
                                    {project.description && <li>{project.description}</li>}
                                </ul>
                                {isAdmin && (
                                    <div className="contact-card__actions">
                                        <button
                                            type="button"
                                            className="secondary-button secondary-button--small"
                                            onClick={() => handleEdit(project)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="secondary-button secondary-button--small"
                                            onClick={() => handleDelete(project._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {isAuthenticated && (
                <div className="contact-form-wrapper fade-in" ref={formSectionRef}>
                    <header className="section-block">
                        <p className="section-kicker">{editingId ? "Update Entry" : "Add Entry"}</p>
                        <h2 className="contact-form-heading">{editingId ? "Update Project" : "Add Project"}</h2>
                    </header>

                    {!isAdmin && (
                        <p className="contact-form__banner contact-form__banner--error" role="status">
                            You have view-only access. Only admins can edit entries.
                        </p>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="contact-form__row">
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="title">Project Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="contact-form__input"
                                    placeholder="e.g. BMI Calculator"
                                    disabled={!isAdmin}
                                    {...register("title", { required: "Project title is required" })}
                                />
                                {errors.title && <p className="contact-form__field-error">{errors.title.message}</p>}
                            </div>
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="completion">Completion Date</label>
                                <input
                                    id="completion"
                                    type="date"
                                    className="contact-form__input"
                                    disabled={!isAdmin}
                                    {...register("completion")}
                                />
                            </div>
                        </div>

                        <div className="contact-form__row">
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="firstname">First Name</label>
                                <input
                                    id="firstname"
                                    type="text"
                                    className="contact-form__input"
                                    placeholder="e.g. Robert"
                                    disabled={!isAdmin}
                                    {...register("firstname")}
                                />
                            </div>
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="lastname">Last Name</label>
                                <input
                                    id="lastname"
                                    type="text"
                                    className="contact-form__input"
                                    placeholder="e.g. Tan"
                                    disabled={!isAdmin}
                                    {...register("lastname")}
                                />
                            </div>
                        </div>

                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="contact-form__input"
                                placeholder="e.g. you@email.com"
                                disabled={!isAdmin}
                                {...register("email")}
                            />
                        </div>

                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="contact-form__input contact-form__textarea"
                                placeholder="Brief project description..."
                                disabled={!isAdmin}
                                {...register("description")}
                            />
                        </div>

                        {isAdmin && (
                            <div className="contact-form__actions">
                                {editingId && (
                                    <button type="button" className="secondary-button" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="primary-button" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Project"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </section>
    );
}