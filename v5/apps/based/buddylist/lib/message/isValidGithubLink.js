export default function isValidGithubLink(url) {
    const regex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/;
    const match = url.match(regex);
    return match ? match.slice(1) : null; 
    // Returns [owner, repo, branch, filePath] or null
}
