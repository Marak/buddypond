const defaultProfileFiles = {
    'index.html': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My BuddyPond Profile</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <h1>My Profile</h1>
    <div class="profile-section">
        <p>Welcome to my BuddyPond profile, hosted on the BuddyPond CDN!</p>
        <p><strong>Customize Your Profile:</strong></p>
        <ul>
            <li>This default profile includes <code>index.html</code>, <code>style.css</code>, and <code>profile.js</code>.</li>
            <li>You may use any files, the only requirement is <code>index.html</code> must be located in root.</li>
            <li>Edit or upload files in the <strong>File Explorer</strong> app (root directory).</li>
            <li>Add any static files (HTML, CSS, JS, images) or projects (e.g., React, Vue).</li>
            <li>Use relative paths (e.g., <code>./style.css</code>) to link files.</li>
        </ul>
        <p><strong>Example:</strong> Click to change text color.</p>
        <button id="toggleButton">Toggle Text Color</button>
        <p class="color-text">This text changes color!</p>
    </div>
    <script src="./profile.js"></script>
</body>
</html>`,
    'style.css': `
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    padding: 20px;
    line-height: 1.5;
}
h1 {
    color: #007bff;
    text-align: center;
}
.profile-section {
    max-width: 600px;
    margin: 0 auto;
}
ul {
    padding-left: 20px;
    font-size: 0.9em;
}
code {
    background: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
}
button {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    margin: 10px auto;
}
button:hover {
    background-color: #0056b3;
}
.color-text {
    font-size: 1.1em;
    text-align: center;
    transition: color 0.3s ease;
}
.color-text.toggled {
    color: #dc3545;
}`,
    'profile.js': `
const text = document.querySelectorAll('.color-text');
const button = document.getElementById('toggleButton');
button.addEventListener('click', () => {
    text.forEach(item => item.classList.toggle('toggled'));
});
`
};

export default defaultProfileFiles;