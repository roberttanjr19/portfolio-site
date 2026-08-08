import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signup, signin } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorMessage(err) {
    if (err.response) {
        return err.response.data?.message || err.response.data?.error || "Something went wrong. Please try again.";
    }
    if (err.request) {
        return "Network error. Please check your connection and try again.";
    }
    return "Something went wrong. Please try again.";
}

export default function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit({ fullName, email, password }) {
        setServerError("");
        try {
            await signup(fullName, email, password);
            const { token, user } = await signin(email, password);
            login(token, user);
            setSuccessMessage("Account created! Redirecting...");
            setTimeout(() => navigate("/projects"), 900);
        } catch (err) {
            setServerError(getErrorMessage(err));
        }
    }

    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">Sign Up</p>
                <h1>Create an Account</h1>
            </header>

            <div className="contact-form-wrapper fade-in">
                <header className="section-block">
                    <p className="section-kicker">Get Started</p>
                    <h2 className="contact-form-heading">Sign Up</h2>
                </header>

                {serverError && (
                    <p className="contact-form__banner contact-form__banner--error" role="alert">
                        {serverError}
                    </p>
                )}
                {successMessage && (
                    <p className="contact-form__banner contact-form__banner--success" role="status">
                        {successMessage}
                    </p>
                )}

                <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="contact-form__field">
                        <label className="contact-form__label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="contact-form__input"
                            placeholder="e.g. Robert Tan"
                            {...register("fullName", { required: "Full name is required" })}
                        />
                        {errors.fullName && <p className="contact-form__field-error">{errors.fullName.message}</p>}
                    </div>

                    <div className="contact-form__field">
                        <label className="contact-form__label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="contact-form__input"
                            placeholder="e.g. you@email.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                            })}
                        />
                        {errors.email && <p className="contact-form__field-error">{errors.email.message}</p>}
                    </div>

                    <div className="contact-form__row">
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="contact-form__input"
                                placeholder="At least 6 characters"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                            />
                            {errors.password && <p className="contact-form__field-error">{errors.password.message}</p>}
                        </div>

                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="contact-form__input"
                                placeholder="Re-enter your password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === watch("password") || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="contact-form__field-error">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="contact-form__actions">
                        <button type="submit" className="primary-button" disabled={isSubmitting}>
                            {isSubmitting ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>

                    <p className="contact-form__footer">
                        Already have an account? <Link to="/signin">Sign In</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
