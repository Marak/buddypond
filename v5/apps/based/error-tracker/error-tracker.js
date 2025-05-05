/* error-tracker.js - Marak Squires 2025 - BuddyPond */
export default class ErrorTracker {
    constructor(bp, config = {}) {
        this.bp = bp;
        if (!config.apiEndpoint) throw new Error("API endpoint is required");
        this.apiEndpoint = config.apiEndpoint;
        // Flag to disable reporting after a stack overflow
        this.isReportingDisabled = false;
        this.init();
    }

    init() {
        // Attach reportError to bp
        this.bp.reportError = (error) => {
            if (this.isReportingDisabled) return;
            this.sendError({
                type: "error",
                message: error.message,
                stack: error.stack || "No stack trace",
            });
        };

        // Global error handler
        window.onerror = (message, source, lineno, colno, error) => {
            // Skip if reporting is disabled
            if (this.isReportingDisabled) return;
            // Skip errors marked as originating from ErrorTracker
            if (error?.isFromErrorTracker) return;

            // Check for stack overflow
            const isStackOverflow = message.includes("Maximum call stack size exceeded") ||
                                   error?.message.includes("Maximum call stack size exceeded");

            this.sendError({
                type: "error",
                message,
                source,
                lineno,
                colno,
                stack: error?.stack || "No stack trace",
            });

            // Disable reporting after a stack overflow
            if (isStackOverflow) {
                console.warn("Stack overflow detected; disabling error reporting.");
                this.isReportingDisabled = true;
            }
        };

        // Unhandled promise rejection handler
        window.onunhandledrejection = (event) => {
            // Skip if reporting is disabled
            if (this.isReportingDisabled) return;
            // Skip errors marked as originating from ErrorTracker
            if (event.reason?.isFromErrorTracker) return;

            // Check for stack overflow
            const isStackOverflow = event.reason?.message.includes("Maximum call stack size exceeded");

            this.sendError({
                type: "promise_rejection",
                message: event.reason?.message || "Unhandled Promise Rejection",
                stack: event.reason?.stack || "No stack trace",
            });

            // Disable reporting after a stack overflow
            if (isStackOverflow) {
                console.warn("Stack overflow detected; disabling error reporting.");
                this.isReportingDisabled = true;
            }
        };
    }

    async sendError(errorData) {
        // Skip if reporting is disabled
        if (this.isReportingDisabled) return;

        console.log('sendError', errorData);
        try {
            await fetch(this.apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(errorData),
            });
        } catch (err) {
            // Mark the error as originating from ErrorTracker
            err.isFromErrorTracker = true;
            console.warn("Failed to send error:", err);
            // Do not rethrow or report this error
        }
    }
}