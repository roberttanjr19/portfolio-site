import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CopyButton from "../components/copy-button";
import { contactMethods } from "../data/portfolio-data";
import { EmailIcon, InstagramIcon, PhoneIcon } from "../components/icons";
import { createContact } from "../services/api";
import { getErrorMessage } from "../utils/formHelpers";

function ContactIcon({ contactIconType }) {
    const iconStyleClassName = "icon";

    switch (contactIconType) {
        case "phone":
            return <PhoneIcon className={iconStyleClassName} />;
        case "instagram":
            return <InstagramIcon className={iconStyleClassName} />;
        case "email":
        default:
            return <EmailIcon className={iconStyleClassName} />;
    }
}

export default function Contact() {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            contactNumber: "",
            email: "",
            message: "",
        },
    });

    async function onSubmit(data) {
        const { firstName, lastName, contactNumber, email, message } = data;
        setError(null);
        try {
            await createContact({ firstName, lastName, contactNumber, email, message });
            setSuccessMessage("Message sent successfully!");
            reset();
            setTimeout(() => setSuccessMessage(""), 3000);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error("Failed to send message:", err);
            setError(getErrorMessage(err));
            setTimeout(() => setError(null), 3000);
        }
    }

    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">Contact</p>
                <h1>Contact Cards</h1>
            </header>

            <div className="contact-grid">
                {contactMethods.map((contactMethod) => (
                    <article key={contactMethod.label} className="contact-card fade-in">
                        <div className="contact-card__icon" aria-hidden="true">
                            <ContactIcon contactIconType={contactMethod.icon} />
                        </div>
                        <div className="contact-card__body">
                            <p className="contact-card__label">{contactMethod.label}</p>
                            <a className="contact-card__value" href={contactMethod.href}>
                                {contactMethod.value}
                            </a>
                        </div>
                        <div className="contact-card__actions">
                            <a className="secondary-button secondary-button--small" href={contactMethod.href}>
                                Open
                            </a>
                            <CopyButton value={contactMethod.copyValue} label="Copy" />
                        </div>
                    </article>
                ))}
            </div>

            <div className="contact-form-wrapper fade-in">
                <header className="section-block">
                    <p className="section-kicker">Send a Message</p>
                    <h2 className="contact-form-heading">Get in Touch</h2>
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

                <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="contact-form__row">
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="contact-form__input"
                                placeholder="e.g. Robert"
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && <p className="contact-form__field-error">{errors.firstName.message}</p>}
                        </div>
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="contact-form__input"
                                placeholder="e.g. Tan"
                                {...register("lastName", { required: "Last name is required" })}
                            />
                            {errors.lastName && <p className="contact-form__field-error">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="contact-form__row">
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="contactNumber">Contact Number</label>
                            <input
                                id="contactNumber"
                                type="tel"
                                className="contact-form__input"
                                placeholder="e.g. +1 416-000-0000"
                                {...register("contactNumber", { required: "Contact number is required" })}
                            />
                            {errors.contactNumber && (
                                <p className="contact-form__field-error">{errors.contactNumber.message}</p>
                            )}
                        </div>
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
                    </div>

                    <div className="contact-form__field">
                        <label className="contact-form__label" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            className="contact-form__input contact-form__textarea"
                            placeholder="Write your message here..."
                            {...register("message", { required: "Message is required" })}
                        />
                        {errors.message && <p className="contact-form__field-error">{errors.message.message}</p>}
                    </div>

                    <div className="contact-form__actions">
                        <button type="submit" className="primary-button" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
