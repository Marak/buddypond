
// the best way to determine if user has a profile seems to be to just
// check the CDN for index.html, style.css, and profile.js files
// if any of them 404, we will programmatically create them here
// generateDefaultProfile() is called on auth::qtoken ( login success )
// so on each logic we will check if the profile exists
// if we didn't do this, we'd have to check profile on File Explorer open or Profile open or Pad open,
// which would result in a fragmented code and a delay in UI while we check for profile existence


export default async function generateDefaultProfile(qtoken) {
    const basePath = "https://files.buddypond.com/" + qtoken.me;

    // TODO: move to portfolio / faucet
    // await requestDefaultCoinAllocations.call(this, qtoken);


    for (const [fileName, fileContent] of Object.entries(defaultProfileFiles)) {
        try {
            const response = await fetch(`${basePath}/${fileName}`);
            if (!response.ok) throw new Error('File not found, needs creation');

            // check if not 200 response
            // if not, throw error
            if (response.status !== 200) throw new Error('File not found, needs creation');

            // check if new location is four-ohh-four, if so, throw error
            if (response.url === 'https://buddypond.com/four-ohh-four') {
                throw new Error('File not found, needs creation');
            }

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
        <!-- You can replace all of this with plain text if you wish --->
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


async function requestDefaultCoinAllocations(qtoken) {
    // before generating the default profile files ( for home page)
    // we need to establish the users initial MEGA ( Megabytes ) asset allocation in their portfolio
    // since the user's initial state will have no record, we can simply attempt to add
    // backend will allow initial allocation of 10 MEGA to all users

    //
    // Request default MEGA allocation
    //
    try {
        await this.bp.load('portfolio');


        await this.bp.apps.portfolio.resource.apiRequest('POST', 'portfolio/' + qtoken.me + '/MEGA', {
            symbol: 'MEGA',
            owner: qtoken.me,
            amount: 10,
            available: 10,
            price: 0.1,
            cost: 0
        });

    } catch (error) {
        console.log('Error creating MEGA asset for user', error);
    }

    //
    // Request default GBP allocation
    //
    try {
        await this.bp.load('portfolio'); // should be cached at this stage
        await this.bp.apps.portfolio.resource.apiRequest('POST',  'portfolio/' + qtoken.me + '/GBP', {
            symbol: 'GBP',
            owner: qtoken.me,
            amount: 10000,
            available: 10000,
            price: 0.001,
            cost: 0
        });
    } catch (error) {
        console.log('Error creating GBP asset for user', error);
    }
}