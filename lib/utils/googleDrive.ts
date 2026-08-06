/**
 * Google Drive Image URL Utilities
 *
 * Converts various Google Drive share link formats into
 * direct-thumbnail/embeddable image URLs that work in <img> tags.
 *
 * Supported input formats:
 *  - https://drive.google.com/file/d/<ID>/view?...
 *  - https://drive.google.com/open?id=<ID>
 *  - https://drive.google.com/uc?id=<ID>&export=view
 *  - https://drive.google.com/thumbnail?id=<ID>
 *
 * Output: https://drive.google.com/thumbnail?id=<ID>&sz=w800
 */

/** Extract the raw file ID from any recognised Google Drive URL variant. */
function extractDriveFileId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    // Pattern: /file/d/<ID>/
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch) return fileDMatch[1];

    // Pattern: ?id=<ID> or &id=<ID>  (open?id=... or uc?id=... or thumbnail?id=...)
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch) return idParamMatch[1];

    return null;
}

/**
 * Converts a Google Drive share/view URL into a direct thumbnail URL.
 * If the URL is not a Google Drive link, returns it unchanged.
 *
 * @param url  - The image URL (may or may not be a Google Drive link).
 * @param size - The desired image width in pixels (default: 800).
 * @returns    A working direct image URL.
 */
export function formatDriveImageUrl(url: string, size: number = 800): string {
    if (!url) return url;

    // Only process Google Drive URLs
    if (!url.includes('drive.google.com')) return url;

    const fileId = extractDriveFileId(url);
    if (!fileId) return url; // Unrecognised format — return as-is

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Processes an array of image URLs and converts any Google Drive links.
 */
export function formatDriveImageUrls(urls: string[], size: number = 800): string[] {
    return urls.map((url) => formatDriveImageUrl(url, size));
}
