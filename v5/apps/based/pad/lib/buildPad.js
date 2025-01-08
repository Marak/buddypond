// similiar to generateDefaultProfile(), but is not intended to be called each logic
// also will have separate code path for pad templates

export default async function buildPad(padName, template = 'default') {
    const basePath = "https://files.buddypond.com/" + this.bp.me;

    for (const [fileName, fileContent] of Object.entries(defaultPadFiles)) {
        console.log(`Creating ${fileName}`);
        const blob = new Blob([fileContent], { type: getFileType(fileName) });
        const file = new File([blob], fileName, {
            type: blob.type,
            lastModified: new Date()
        });
        file.filePath = 'pads/' +  padName + `/${fileName}`;
        console.log(`Uploading ${fileName}...`, file);
        try {
            await this.bp.apps.client.api.uploadFile(file);
            console.log(`${fileName} uploaded successfully.`);
        } catch (uploadError) {
            console.error(`Error uploading ${fileName}: ${uploadError.message}`);
        }
    }
}

const defaultPadFiles = {
    'index.html': `
            <!-- You can replace all of this with plain text if you wish --->
            <!DOCTYPE html>
            <html>
            <head>
                <title>My Pad</title>
                <link rel="stylesheet" href="./style.css">
            </head>
            <body>
                <h1>My Pad</h1>
                <p>
                
              <p>This is my Pad. There are many like it, but this one is mine.</p>
<p>My Pad is my best friend. It is my life. I must master it as I must master my life.</p>
<p>Without me, my Pad is useless. Without my Pad, I am useless. I must code my Pad well. I must build better solutions
    than my competitors who are trying to innovate. I must deploy before they deploy.</p>
<p>My Pad and I know that what counts in development is not the lines we write, the complexity of our algorithms, nor
    the frameworks we use. We know that it is the user experience that counts. We will deliver.</p>
<p>My Pad is human, even as I [am human], because it is my life. Thus, I will learn it as a sibling. I will learn its
    weaknesses, its strength, its components, its dependencies, its interface and its architecture. I will keep my Pad
    maintained and optimized, even as I am focused and prepared. We will become part of each other.</p>
<p>Before the heavens, I swear this creed. My Pad and I are the creators of possibilities. We are the masters of innovation. We
    are the enablers of better lives.</p>
<p>So be it, until excellence is achieved and there are no bugs, only features!</p>
                
                </p>
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


