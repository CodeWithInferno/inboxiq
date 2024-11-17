// src/utils/sanitizeEmailContent.js
const cheerio = require('cheerio');

/**
 * Sanitizes email content by removing all HTML, styles, and scripts.
 * Returns plain text that can be sent to OpenAI.
 * 
 * @param {string} htmlContent - The raw HTML email content.
 * @returns {string} - Cleaned plain text content.
 */
function sanitizeEmailContent(htmlContent) {
  const $ = cheerio.load(htmlContent);

  // Remove all script, style, and metadata elements
  $('script, style, meta, link').remove();

  // Extract text content from <body>
  let mainContent = $('body').text();

  // Further clean up excessive whitespace and newlines
  mainContent = mainContent.replace(/\s\s+/g, ' ').trim();

  return mainContent;
}

module.exports = sanitizeEmailContent;

export default sanitizeEmailContent;