/**
 * EDUCATION PAGE COMPONENT
 * Displays educational background in a timeline format, backed by the
 * qualifications API, and lets admins add/edit/delete entries
 */

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EducationIcon, SchoolIcon } from "../components/icons";
import { getAllQualifications, createQualification, updateQualification, deleteQualification } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, formatDate } from "../utils/formHelpers";

export default function Education() {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = user?.role === 'admin';
    const formSectionRef = useRef(null);

    const [qualifications, setQualifications] = useState([]);
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
            school: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    });

    async function fetchQualifications() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllQualifications();
            setQualifications(data);
        } catch (err) {
            console.error("Failed to load qualifications:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQualifications();
    }, []);

    async function onSubmit(data) {
        setError(null);
        try {
            if (editingId) {
                await updateQualification(editingId, data);
                setSuccessMessage("Qualification updated successfully!");
            } else {
                await createQualification(data);
                setSuccessMessage("Qualification added successfully!");
            }
            await fetchQualifications();
            reset();
            setEditingId(null);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Failed to save qualification:", err);
            setError(getErrorMessage(err));
        }
    }

    function handleEdit(qualification) {
        setEditingId(qualification._id);
        setSuccessMessage("");
        setError(null);
        reset({
            school: qualification.school || "",
            degree: qualification.degree || "",
            fieldOfStudy: qualification.fieldOfStudy || "",
            startDate: qualification.startDate ? qualification.startDate.slice(0, 10) : "",
            endDate: qualification.endDate ? qualification.endDate.slice(0, 10) : "",
            description: qualification.description || "",
        });
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleCancelEdit() {
        reset({ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" });
        setEditingId(null);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure?")) return;
        setError(null);
        try {
            await deleteQualification(id);
            await fetchQualifications();
            setSuccessMessage("Qualification deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Failed to delete qualification:", err);
            setError(getErrorMessage(err));
        }
    }

    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">Education</p>
                <h1>Academic timeline</h1>
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
                <p className="section-block fade-in">Loading qualifications...</p>
            ) : (
                <div className="timeline fade-in">
                    {qualifications.length === 0 && <p>No qualifications added yet.</p>}
                    {qualifications.map((qualification, entryIndex) => (
                        <article key={qualification._id} className="timeline-item">
                            <div className="timeline-marker" aria-hidden="true">
                                {entryIndex === 0 ? <SchoolIcon className="icon icon-small" /> : <EducationIcon className="icon icon-small" />}
                            </div>
                            <div className="timeline-card">
                                <p className="timeline-meta">
                                    {formatDate(qualification.startDate)} - {formatDate(qualification.endDate) || "Present"}
                                </p>
                                <h2>{qualification.school}</h2>
                                <ul className="timeline-list">
                                    <li>{qualification.degree}</li>
                                    <li>{qualification.fieldOfStudy}</li>
                                    {qualification.description && <li>{qualification.description}</li>}
                                </ul>
                                {isAdmin && (
                                    <div className="contact-card__actions">
                                        <button
                                            type="button"
                                            className="secondary-button secondary-button--small"
                                            onClick={() => handleEdit(qualification)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="secondary-button secondary-button--small"
                                            onClick={() => handleDelete(qualification._id)}
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
                        <h2 className="contact-form-heading">{editingId ? "Update Qualification" : "Add Qualification"}</h2>
                    </header>

                    {!isAdmin && (
                        <p className="contact-form__banner contact-form__banner--error" role="status">
                            You have view-only access. Only admins can edit entries.
                        </p>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="contact-form__row">
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="school">School/University Name</label>
                                <input
                                    id="school"
                                    type="text"
                                    className="contact-form__input"
                                    placeholder="e.g. University of Toronto"
                                    disabled={!isAdmin}
                                    {...register("school", { required: "School/University name is required" })}
                                />
                                {errors.school && <p className="contact-form__field-error">{errors.school.message}</p>}
                            </div>
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="degree">Degree</label>
                                <input
                                    id="degree"
                                    type="text"
                                    className="contact-form__input"
                                    placeholder="e.g. Bachelor of Science"
                                    disabled={!isAdmin}
                                    {...register("degree", { required: "Degree is required" })}
                                />
                                {errors.degree && <p className="contact-form__field-error">{errors.degree.message}</p>}
                            </div>
                        </div>

                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="fieldOfStudy">Field of Study</label>
                            <input
                                id="fieldOfStudy"
                                type="text"
                                className="contact-form__input"
                                placeholder="e.g. Computer Science"
                                disabled={!isAdmin}
                                {...register("fieldOfStudy", { required: "Field of study is required" })}
                            />
                            {errors.fieldOfStudy && <p className="contact-form__field-error">{errors.fieldOfStudy.message}</p>}
                        </div>

                        <div className="contact-form__row">
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="startDate">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    className="contact-form__input"
                                    disabled={!isAdmin}
                                    {...register("startDate", { required: "Start date is required" })}
                                />
                                {errors.startDate && <p className="contact-form__field-error">{errors.startDate.message}</p>}
                            </div>
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="endDate">End Date</label>
                                <input
                                    id="endDate"
                                    type="date"
                                    className="contact-form__input"
                                    disabled={!isAdmin}
                                    {...register("endDate")}
                                />
                            </div>
                        </div>

                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="contact-form__input contact-form__textarea"
                                placeholder="Notable coursework, achievements, activities..."
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
                                    {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Qualification"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </section>
    );
}
