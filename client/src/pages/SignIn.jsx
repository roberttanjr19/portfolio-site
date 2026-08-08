import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signin } from "../services/api";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(err) {
    if (err.response) {
        return err.response.data?.error || err.response.data?.message || "Invalid email or password.";
    }
    if (err.request) {
        return "Network error. Please check your connection and try again.";
    }
    return "Something went wrong. Please try again.";
}

export default function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit({ email, password }) {
        setServerError("");
        try {
            const { token, user } = await signin(email, password);
            login(token, user);
            setSuccessMessage("Signed in! Redirecting...");
            const redirectTo = location.state?.from?.pathname || "/contact";
            setTimeout(() => navigate(redirectTo, { replace: true }), 900);
        } catch (err) {
            setServerError(getErrorMessage(err));
            reset((prev) => ({ email: prev.email, password: "" }));
        }
    }

    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">Sign In</p>
                <h1>Welcome Back</h1>
            </header>

            <div className="contact-form-wrapper fade-in">
                <header className="section-block">
                    <p className="section-kicker">Members</p>
                    <h2 className="contact-form-heading">Sign In</h2>
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
                        <label className="contact-form__label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="contact-form__input"
                            placeholder="e.g. you@email.com"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="contact-form__field-error">{errors.email.message}</p>}
                    </div>

                    <div className="contact-form__field">
                        <label className="contact-form__label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="contact-form__input"
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="contact-form__field-error">{errors.password.message}</p>}
                    </div>

                    <div className="contact-form__actions">
                        <button type="submit" className="primary-button" disabled={isSubmitting}>
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    <p className="contact-form__footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
