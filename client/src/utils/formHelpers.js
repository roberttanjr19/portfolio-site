export function getErrorMessage(err) {
    if (err.response) {
        return err.response.data?.message || err.response.data?.error || "Something went wrong. Please try again.";
    }
    if (err.request) {
        return "Network error. Please check your connection and try again.";
    }
    return "Something went wrong. Please try again.";
}

export function formatDate(dateValue) {
    if (!dateValue) return "";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}
