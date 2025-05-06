// similiar to generateDefaultProfile(), but is not intended to be called each logic
// also will have separate code path for pad templates
import defaultPadFiles from './defaultPadFiles.js';

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
            // don't wait for the default pad to generate each file
            // just generate (3) at once and keep going
            // TODO: we could track progress and show in UI, etc...
            // await this.bp.apps.client.api.uploadFile(file);
            this.bp.apps.client.api.uploadFile(file);
            console.log(`${fileName} uploaded successfully.`);
        } catch (uploadError) {
            console.error(`Error uploading ${fileName}: ${uploadError.message}`);
        }
    }
}

function getFileType(fileName) {
    if (fileName.endsWith('.html')) return 'text/html';
    if (fileName.endsWith('.css')) return 'text/css';
    if (fileName.endsWith('.js')) return 'application/javascript';
    return 'text/plain';
}