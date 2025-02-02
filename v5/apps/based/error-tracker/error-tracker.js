/* error-tracker.js - Marak Squires 2025 - BuddyPond */
export default class ErrorTracker {
    constructor(bp, config = {}) {
      this.bp = bp;
      if (!config.apiEndpoint) throw new Error("API endpoint is required");
      this.apiEndpoint = config.apiEndpoint;
      this.init();
    }
  
    init() {
      window.onerror = (message, source, lineno, colno, error) => {
        let errorData 
        this.sendError({
          type: "error",
          message,
          source,
          lineno,
          colno,
          stack: error?.stack || "No stack trace",
        });
        this.bp.error = (error) => {
            this.sendError({
                type: "error",
                message: error.message,
                stack: error.stack || "No stack trace",
            }); 
        }
      };
  
      window.onunhandledrejection = (event) => {
        this.sendError({
          type: "promise_rejection",
          message: event.reason?.message || "Unhandled Promise Rejection",
          stack: event.reason?.stack || "No stack trace",
        });
      };
    }
  
    async sendError(errorData) {
        console.log('sendError', errorData);
      try {
        await fetch(this.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorData),
        });
      } catch (err) {
        console.warn("Failed to send error:", err);
      }
    }
  }
  
  // Usage:
  // const errorTracker = new SimpleErrorTracker("https://your-api.com/errors");
  