
    // the best way to determine if user has a profile seems to be to just
    // check the CDN for index.html, style.css, and profile.js files
    // if any of them 404, we will programmatically create them here
    // generateDefaultProfile() is called on auth::qtoken ( login success )
    // so on each logic we will check if the profile exists
    // if we didn't do this, we'd have to check profile on File Explorer open or Profile open or Pad open,
    // which would result in a fragmented code and a delay in UI while we check for profile existence


export default async function generateDefaultProfile(qtoken) {
    const basePath = "https://files.buddypond.com/" + qtoken.me;

    for (const [fileName, fileContent] of Object.entries(defaultProfileFiles)) {
        try {
            const response = await fetch(`${basePath}/${fileName}`);
            if (!response.ok) throw new Error('File not found, needs creation');
        } catch (error) {
            console.log(`Creating ${fileName}: ${error.message}`);
            const blob = new Blob([fileContent], { type: getFileType(fileName) });
            const file = new File([blob], fileName, {
                type: blob.type,
                lastModified: new Date()
            });
            file.filePath = `${fileName}`; // maybe

            try {
                await this.bp.apps.client.api.uploadFile(file);
                console.log(`${fileName} uploaded successfully.`);
            } catch (uploadError) {
                console.error(`Error uploading ${fileName}: ${uploadError.message}`);
            }
        }
    }
}

const defaultProfileFiles = {
    'index.html': `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Profile</title>
            <link rel="stylesheet" href="./style.css">
        </head>
        <body>
            <h1>Welcome to my Profile</h1>
            <p>This is my profile. There are many like it, but this one is mine.</p>
            <script src="./profile.js"></script>
        </body>
        </html>`,
    'style.css': `
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            margin: 0;
            padding: 0;
        }
        h1 {
            color: #007bff;
        }
        p {
            font-size: 1.2em;
        }`,
    'profile.js': `
        console.log('Hello from my profile.js');`
};

function getFileType(fileName) {
    if (fileName.endsWith('.html')) return 'text/html';
    if (fileName.endsWith('.css')) return 'text/css';
    if (fileName.endsWith('.js')) return 'application/javascript';
    return 'text/plain';
}


