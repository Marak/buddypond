export default function startLoadingSequence(win) {
    const steps = [
        "Initializing camera...",
        "Loading vision model...",
        "Warming up tensors...",
        "Calibrating hand gestures...",
        "Initializing Synth...",
        "Finalizing setup..."
    ];

    let stepIndex = 0;
    const $loadingText = $('#loading-text', this.win.content);

    const interval = setInterval(() => {
        $loadingText.text(steps[stepIndex]);
        stepIndex++;

        // End of steps — stop interval
        if (stepIndex >= steps.length) {
            clearInterval(interval);
        }
    }, 1200); // Change step every 1.2s
}
