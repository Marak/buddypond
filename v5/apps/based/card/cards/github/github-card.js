

export default async function applyData(el, data, cardClass) {
    const $el = $(el);

    $el.find('.card-url-url').text(data.url);
    $el.find('.card-url-url').attr('href', data.url);
    $el.find('.card-url-url').attr('target', '_blank');
    $el.find('.card-github-file').text(data.filename);
    $el.find('.card-github-repo').text(`${data.owner}/${data.repo}`);

    // Append Prism.js for syntax highlighting
    // TODO: vendor these deps
    await cardClass.bp.appendScript("https://cdn.jsdelivr.net/npm/prismjs@1.23.0/prism.min.js");
    await cardClass.bp.appendCSS("https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism-coy.css");

    $el.find('.card-github-header').click(() => {
        // opens a new link to the github file
        window.open(data.url, '_blank');
    });

    // Fetch and display GitHub snippet with expand/collapse functionality
    fetchGitHubSnippet(data.url, $el);
}

async function fetchGitHubSnippet(url, $el) {
    try {
        const apiUrl = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch");

        let code = await response.text();
        const lines = code.split("\n");

        // Initial snippet (first 10 lines)
        let shortSnippet = lines.join("\n");
        let fullSnippet = code;

        const language = apiUrl.split('.').pop(); // Infer language from extension
        const $codeBlock = $el.find("code");

        // Set initial short snippet
        $codeBlock.text(shortSnippet);
        $codeBlock.addClass(`language-${language}`);
        Prism.highlightElement($codeBlock[0]);

      
    } catch (error) {
        console.log("Error fetching GitHub snippet:", error);
        $el.find("code").text("Error loading preview.");
    }
}
