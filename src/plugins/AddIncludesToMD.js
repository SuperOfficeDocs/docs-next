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
    // console.log(`[remarkIncludeDirective] Processing: ${tree}`);

    visit(tree, 'paragraph', (node, index, parent) => {
      processIncludeInParagraph(node, index, parent, file);
    });
  };
}


/**
 * Process include directives within paragraph nodes
 * Handles pattern: text("[!include") + link + text("]")
 */
function processIncludeInParagraph(node, index, parent, file) {
  if (!node.children || node.children.length < 3) return;

  // Look for the pattern: text("[!include") + link + text("]")
  for (let i = 0; i < node.children.length - 2; i++) {
    const [firstNode, linkNode, lastNode] = [
      node.children[i],
      node.children[i + 1], 
      node.children[i + 2]
    ];

    const isIncludePattern = (
      firstNode.type === 'text' && firstNode.value === '[!include' &&
      linkNode.type === 'link' &&
      lastNode.type === 'text' && lastNode.value === ']'
    );

    if (!isIncludePattern) continue;

    const includePath = linkNode.url;
    // console.log(`[remarkIncludeDirective] Found include pattern: ${includePath}`);

    try {
      const includeContent = loadAndProcessIncludeFile(includePath, file);
      const parsedContent = fromMarkdown(includeContent);

      // Replace nodes with parsed content
      if (isEntireParagraph(node, i)) {
        // Replace entire paragraph
        parent?.children.splice(index, 1, ...parsedContent.children);
      } else {
        // Replace just the three nodes
        node.children.splice(i, 3, ...parsedContent.children);
      }

      // console.log(`[remarkIncludeDirective] Successfully replaced include directive`);
      return; 

    } catch (err) {
      console.warn(`[remarkIncludeDirective] Could not include: ${includePath}`, err.message);
      // replaceWithError(node, i, includePath);
      return;
    }
  }
}


/**
 * Load and process an include file
 */
function loadAndProcessIncludeFile(includePath, currentFile) {
  const currentDir = path.dirname(currentFile.path);
  const fullPath = path.resolve(currentDir, includePath);
  
  // console.log(`[remarkIncludeDirective] Resolving: ${fullPath}`);
  
  // Read and clean the file content
  let content = fs.readFileSync(fullPath, 'utf-8');
  content = removeComments(content);
  
  // console.log(`[remarkIncludeDirective] Successfully loaded content from: ${includePath}`);
  
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
  
  // console.log(`[remarkIncludeDirective] Current file dir: ${currentFileDir}`);
  // console.log(`[remarkIncludeDirective] Include file dir: ${includeDir}`);
  
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
      console.log(`[remarkIncludeDirective] Adjusting link: ${relativePath} -> ${adjustedPath}`);
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
        //console.log(`[remarkIncludeDirective] Fixing malformed reference: ${match}`);
        return fixMalformedUrl(label, urlOrPath);
      }
      
      // Don't modify absolute URLs
      if (isAbsoluteUrl(urlOrPath)) {
        //console.log(`[remarkIncludeDirective] Keeping absolute URL: ${match}`);
        return match;
      }
      
      // Don't modify absolute paths
      if (urlOrPath.startsWith('/')) {
        //console.log(`[remarkIncludeDirective] Keeping absolute path: ${match}`);
        return match;
      }
      
      // Adjust relative paths
      //console.log(`[remarkIncludeDirective] Processing relative reference: ${urlOrPath}`);
      try {
        const adjustedPath = resolveRelativePath(urlOrPath, includeDir, currentFileDir);
        //console.log(`[remarkIncludeDirective] Adjusting reference: ${urlOrPath} -> ${adjustedPath}`);
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
  
  // Fix missing 's' in https if needed
  if (cleanUrl.startsWith('http:/') && !cleanUrl.startsWith('http://')) {
    cleanUrl = cleanUrl.replace('http:/', 'https://');
  }
  
  //console.log(`[remarkIncludeDirective] Repaired URL: ${cleanUrl}`);
  return `[${label}]: ${cleanUrl}`;
}

/**
 * Check if a URL is absolute (starts with http:// or https://)
 */
function isAbsoluteUrl(url) {
  return /^https?:\/\//.test(url);
}

/**
 * Check if the include pattern is the entire paragraph
 */
function isEntireParagraph(node, startIndex) {
  return node.children.length === 3 && startIndex === 0;
}

// /**
//  * Replace include pattern with error message
//  */
// function replaceWithError(node, startIndex, includePath) {
//   const errorNode = {
//     type: 'strong',
//     children: [{
//       type: 'text',
//       value: `Include error: Could not load ${includePath}`
//     }]
//   };
  
//   node.children.splice(startIndex, 3, errorNode);
// }