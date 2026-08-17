/**
 * ABOUT PAGE COMPONENT
 * Displays personal information and short biography
 * Information is sourced from portfolio-data.js and mapped into cards
 */

import { aboutFacts } from "../data/portfolio-data";
import { CalendarIcon, CodeIcon, LocationIcon, StudentIcon, TagIcon, UserIcon } from "../components/icons";

/**
 * InfoIcon Component
 * Maps fact type string to appropriate icon component for visual representation
 * @param {string} iconType - Icon type from aboutFacts (user, tag, calendar, location, code, student)
 * @returns {JSX.Element} Rendered icon component
 */
function InfoIcon({ iconType }) {
    const iconStyleClassName = "icon icon-small";

    switch (iconType) {
        case "user":
            return <UserIcon className={iconStyleClassName} />;
        case "tag":
            return <TagIcon className={iconStyleClassName} />;
        case "calendar":
            return <CalendarIcon className={iconStyleClassName} />;
        case "location":
            return <LocationIcon className={iconStyleClassName} />;
        case "city":
            return <LocationIcon className={iconStyleClassName} />;
        case "code":
            return <CodeIcon className={iconStyleClassName} />;
        case "student":
            return <StudentIcon className={iconStyleClassName} />;
        default:
            return <UserIcon className={iconStyleClassName} />;
    }
}

/**
 * About Component
 * Renders two-column layout with personal information and biographical content
 */
export default function About() {
    return (
        <section className="page-section">
            <header className="section-block fade-in">
                <p className="section-kicker">About</p>
                <h1>Personal Profile and Academic Background</h1>
            </header>

            <div className="info-grid">
                {/* Left card: Personal information facts */}
                <article className="surface-card fade-in">
                    <h2>Personal Information</h2>
                    <div className="facts-list">
                        {/* Map through aboutFacts and display each with icon */}
                        {aboutFacts.map((personalFact) => (
                            <div key={personalFact.label} className="info-row">
                                <span className="info-row__icon">
                                    <InfoIcon iconType={personalFact.icon} />
                                </span>
                                <div>
                                    <span className="info-row__label">{personalFact.label}</span>
                                    <strong className="info-row__value">{personalFact.value}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Right card: Biography content */}
                <article className="surface-card fade-in">
                    <h2>Short Bio</h2>
                    <p className="section-body">
                        I am a Software Engineering student passionate about learning modern technologies and creating practical applications. I enjoy turning ideas into projects while developing my technical and problem-solving skills.
                    </p>
                    <p className="section-body">
                        As a Software Engineering Technician student, I focus on building reliable full-stack applications using JavaScript, React, and Node.js, with hands-on experience in REST APIs, databases, and version-controlled team workflows. I am eager to apply this foundation to real-world engineering teams, and I am always working to sharpen my skills through coursework and independent projects.
                    </p>
                </article>
            </div>
        </section>
    );
}