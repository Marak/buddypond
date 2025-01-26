export default async function viewSource (url = 'https://raw.githubusercontent.com/Marak/buddypond/refs/heads/master/index.html') {
    // fetch the content as text
    const response = await fetch(url);
    const content = await response.text();
    await this.bp.load('editor-monaco', {
        content: content
    });
    this.bp.apps['editor-monaco'].open();
}