// Default index.html content for a new BuddyPad
const defaultIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your BuddyPad</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <h1>Your BuddyPad</h1>
    <div class="welcome-section">
        <p>Welcome to your BuddyPad, a custom page hosted on the BuddyPond CDN!</p>
        <p><strong>About BuddyPads:</strong></p>
        <p>BuddyPads are custom routed pages on BuddyPond, allowing you to host any static content. Each BuddyPad is stored as a virtual directory in our CDN, accessible via the <strong>Buddy Files</strong> app in the "pads" folder.</p>
        <p><strong>How to Customize Your BuddyPad:</strong></p>
        <ul>
            <li><strong>This Default Pad</strong>: This page includes <code>index.html</code> (structure), <code>style.css</code> (styling), and <code>index.js</code> (interactivity). These are linked using relative paths (e.g., <code>./style.css</code>, <code>./index.js</code>).</li>
            <li><strong>Upload Any Files</strong>: Use the <strong>Buddy Files</strong> app (navigate to the "pads" folder) to upload any static files, such as HTML, CSS, JS, images, or entire projects (e.g., React, Vue, or static sites).</li>
            <li><strong>Flexible Structure</strong>: You're not limited to these default files. Create multiple files, folders, or complex project structures. The BuddyPond CDN serves your content as configured.</li>
            <li><strong>Accessing Your Pad</strong>: Your BuddyPad is hosted at a unique URL and served directly from our CDN for fast, reliable delivery.</li>
        </ul>
        <p><strong>Try It Out:</strong> Click the button below to toggle the color of the boxes, demonstrating how HTML, CSS, and JS work together.</p>
        <button id="toggleButton">Toggle Box Colors</button>
        <div class="box-container">
            <div class="color-box"></div>
            <div class="color-box"></div>
            <div class="color-box"></div>
        </div>
    </div>
    <script src="./index.js"></script>
</body>
</html>
`;

// Default style.css content for a new BuddyPad
const defaultStyleCss = `
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
}
h1 {
    color: #007bff;
    text-align: center;
}
.welcome-section {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
ul {
    padding-left: 20px;
}
code {
    background: #f0f0f0;
    padding: 2px 4px;
    border-radius: 4px;
}
button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
}
button:hover {
    background-color: #0056b3;
}
.box-container {
    display: flex;
    gap: 20px;
    justify-content: center;
}
.color-box {
    width: 100px;
    height: 100px;
    background-color: #28a745;
    border-radius: 10px;
    transition: background-color 0.3s ease;
}
.color-box.toggled {
    background-color: #dc3545;
}
`;

// Default index.js content for a new BuddyPad
const defaultJs = `
console.log('Welcome to your BuddyPad!');
// Example: Using querySelectorAll to add interactivity
const boxes = document.querySelectorAll('.color-box');
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
    boxes.forEach(box => {
        box.classList.toggle('toggled');
    });
});
`;

let defaultFiles = {
    'index.html': defaultIndexHtml,
    'style.css': defaultStyleCss,
    'index.js': defaultJs
};

export default defaultFiles;