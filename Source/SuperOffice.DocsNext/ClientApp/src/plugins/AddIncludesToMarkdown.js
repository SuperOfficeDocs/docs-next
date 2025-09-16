import fs from 'fs';
import path from 'path';
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';

/**
 * Remark plugin to process [!include[...](...)] syntax in Markdown files.
 * Replaces include directives with the content of referenced files and adjusts relative paths.
 */
export default function remarkIncludeDirective() {
  return (tree, file) => {

    // Process all node types that can contain children with include directives
    visit(tree, (node, index, parent) => {
      // Check if this node can contain text children that might have includes
      if (node.children && Array.isArray(node.children)) {
        processIncludeInNode(node, index, parent, file);
      }
    });

    // Process video directives in blockquotes and other nodes
    visit(tree, (node, index, parent) => {
      // Check blockquotes and paragraphs for video directives
      if ((node.type === 'blockquote' || node.type === 'paragraph') && node.children) {
        processVideoDirective(node, index, parent, file);
      }
    });
  };
}


/**
 * Process video directives in blockquotes and paragraphs
 * Handles pattern: > [!Video URL] or [!Video URL]
 */
function processVideoDirective(node, index, parent, file) {
  if (!node.children || node.children.length === 0) return;

  let targetParagraph = null;

  if (node.type === 'blockquote') {
    targetParagraph = node.children.find(child => child.type === 'paragraph');
  } else if (node.type === 'paragraph') {
    targetParagraph = node;
  }

  if (!targetParagraph || !targetParagraph.children) return;

  let textContent = '';
  let hasVideoDirective = false;
  let videoUrl = '';

  // Collect all text content from the paragraph children
  for (const child of targetParagraph.children) {
    if (child.type === 'text') {
      textContent += child.value;
    } else if (child.type === 'link') {
      textContent += child.url;
    }
  }

  

  // Check if this looks like a video directive: [!Video URL]
  const videoMatch = textContent.match(/\[!Video\s+(https?:\/\/[^\]\s]+)\]/);
  if (videoMatch) {
    hasVideoDirective = true;
    videoUrl = videoMatch[1];
  }

  if (!hasVideoDirective) return;
  
  try {
    // Create the iframe HTML
    const iframeHtml = `<div class="embeddedvideo"><iframe src="${videoUrl}" frameborder="0" allowfullscreen="true"></iframe></div>`;
    
    // Create an HTML node to replace the blockquote or paragraph
    const htmlNode = {
      type: 'html',
      value: iframeHtml
    };

    // Replace the entire node with the iframe
    if (parent && parent.children) {
      parent.children.splice(index, 1, htmlNode);
    }

  } catch (err) {
    console.warn(`[remarkIncludeDirective] Could not process video directive: ${videoUrl}`, err.message);
  }
}


/**
 * Process include directives within any node that has children
 * Handles pattern: text("[!include") + link + text("]...") where the last text may contain additional content
 */
function processIncludeInNode(node, index, parent, file) {
  if (!node.children || node.children.length < 3) return;

  // Look for the pattern: text("[!include") + link + text("]...")
  // Process from right to left to avoid index shifting issues
  for (let i = node.children.length - 3; i >= 0; i--) {
    const [firstNode, linkNode, lastNode] = [
      node.children[i],
      node.children[i + 1], 
      node.children[i + 2]
    ];

    const isIncludePattern = (
      firstNode.type === 'text' && firstNode.value === '[!include' &&
      linkNode.type === 'link' &&
      lastNode.type === 'text' && lastNode.value.startsWith(']')
    );

    if (!isIncludePattern) continue;

    const includePath = linkNode.url;

    try {
      const includeContent = loadAndProcessIncludeFile(includePath, file);
      const parsedContent = fromMarkdown(includeContent);

      // Handle the remaining text after ']'
      const remainingText = lastNode.value.substring(1); // Remove the ']' character
      
      if (isEntireNodeContent(node, i) && remainingText.trim() === '') {
        // Replace entire node content if include is the only content
        parent?.children.splice(index, 1, ...parsedContent.children);
        return; 
      } else {
        const replacementNodes = [...parsedContent.children];
        
        // If there's remaining text after ']', add it as a text node
        if (remainingText) {
          replacementNodes.push({
            type: 'text',
            value: remainingText
          });
        }
        
        // Replace the three nodes with the include content and any remaining text
        node.children.splice(i, 3, ...replacementNodes);
      }

    } catch (err) {
      console.warn(`[remarkIncludeDirective] Could not include: ${includePath}`, err.message);
    }
  }
}


/**
 * Load and process an include file
 */
function loadAndProcessIncludeFile(includePath, currentFile) {
  const currentDir = path.dirname(currentFile.path);
  const fullPath = path.resolve(currentDir, includePath);
  
  // Read and clean the file content
  let content = fs.readFileSync(fullPath, 'utf-8');
  content = removeComments(content);
  
  // Adjust relative paths in the content
  const adjustedContent = adjustRelativePaths(content, fullPath, currentFile.path);
  return adjustedContent;
}

/**
 * Remove HTML comments from content
 */
function removeComments(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

/**
 * Adjust relative paths in included content
 */
function adjustRelativePaths(content, includeFilePath, currentFilePath) {
  const includeDir = path.dirname(includeFilePath);
  const currentFileDir = path.dirname(currentFilePath);
  
  // Fix relative paths in markdown links: [text](path)
  content = adjustMarkdownLinks(content, includeDir, currentFileDir);
  
  // Fix relative paths in reference definitions: [1]: path
  content = adjustReferenceDefinitions(content, includeDir, currentFileDir);
  
  return content;
}

/**
 * Adjust relative paths in markdown links [text](path)
 */
function adjustMarkdownLinks(content, includeDir, currentFileDir) {
  return content.replace(
    /\]\((?!https?:\/\/)(?!\/)(.*?)\)/g, 
    (match, relativePath) => {
      const adjustedPath = resolveRelativePath(relativePath, includeDir, currentFileDir);
      // console.log(`[remarkIncludeDirective] Adjusting link: ${relativePath} -> ${adjustedPath}`);
      return `](${adjustedPath})`;
    }
  );
}

/**
 * Adjust relative paths in reference definitions [label]: path
 */
function adjustReferenceDefinitions(content, includeDir, currentFileDir) {
  return content.replace(
    /^\[([^\]]+)\]:\s*(.+)$/gm,
    (match, label, urlOrPath) => {
      urlOrPath = urlOrPath.trim();
      
      // Fix malformed URLs that got corrupted with includes/ prefix
      if (urlOrPath.startsWith('includes/')) {
        return fixMalformedUrl(label, urlOrPath);
      }
      
      if (isAbsoluteUrl(urlOrPath)) {
        return match;
      }
      
      if (urlOrPath.startsWith('/')) {
        return match;
      }
      
      // Adjust relative paths
      try {
        const adjustedPath = resolveRelativePath(urlOrPath, includeDir, currentFileDir);
        return `[${label}]: ${adjustedPath}`;
      } catch (err) {
        console.warn(`[remarkIncludeDirective] Failed to adjust reference: ${urlOrPath}`, err.message);
        return match;
      }
    }
  );
}

/**
 * Resolve a relative path from include directory to current file directory
 */
function resolveRelativePath(relativePath, includeDir, currentFileDir) {
  const absolutePath = path.resolve(includeDir, relativePath);
  const adjustedPath = path.relative(currentFileDir, absolutePath);
  // Convert to forward slashes for URLs
  return adjustedPath.split(path.sep).join('/');
}

/**
 * Fix malformed URLs that got corrupted with includes/ prefix
 */
function fixMalformedUrl(label, malformedUrl) {

  // Remove the includes/ prefix and any following whitespace
  let cleanUrl = malformedUrl.replace(/^includes\/\s*/, '');
  
  if (cleanUrl.startsWith('http:/') && !cleanUrl.startsWith('http://')) {
    cleanUrl = cleanUrl.replace('http:/', 'https://');
  }
  
  return `[${label}]: ${cleanUrl}`;
}

/**
 * Check if a URL starts with http:// or https://)
 */
function isAbsoluteUrl(url) {
  return /^https?:\/\//.test(url);
}

/**
 * Check if the include pattern is the entire node content
 */
function isEntireNodeContent(node, startIndex) {
  return node.children.length === 3 && startIndex === 0;
}