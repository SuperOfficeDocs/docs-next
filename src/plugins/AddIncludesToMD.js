// import fs from 'fs';
// import path from 'path';
// import { visit } from 'unist-util-visit';

// /**
//  * Remark plugin to process [!include[...](...)] syntax in Markdown files.
//  */
// export default function remarkIncludeDirective() {
//   return (tree, file) => {
//     // Log all Markdown files being processed
//     console.log(`[remarkIncludeDirective] Processing: ${file.path}`);

//     visit(tree, 'link', (node, index, parent) => {
//       if (!node || !node.children || node.children.length === 0) return;

//       const textNode = node.children[0];
//       const label = textNode.value || '';

//       const match = `[!include[${label}](${node.url})]`.match(/\[!include\[(.*?)\]\((.*?)\)\]/);

//       if (match) {
//         const includePath = match[2];

//         // ✅ Resolve relative to the directory of the current file
//         const currentDir = path.dirname(file.path);
//         const fullPath = path.resolve(currentDir, includePath);

//         // console.log(`[remarkIncludeDirective] Matched include: ${includePath}`);
//         // console.log(`[remarkIncludeDirective] Full path: ${fullPath}`);

//         try {
//           const includeContent = fs.readFileSync(fullPath, 'utf-8');

//           const newNode = {
//             type: 'html',
//             value: includeContent,
//           };

//           if (parent && typeof index === 'number') {
//             parent.children.splice(index, 1, newNode);
//           }
//         } catch (err) {
//           // console.warn(`[remarkIncludeDirective] Could not include: ${includePath}`, err);

//           const errorNode = {
//             type: 'html',
//             value: `<blockquote><strong>Include error:</strong> ${includePath}</blockquote>`,
//           };

//           if (parent && typeof index === 'number') {
//             parent.children.splice(index, 1, errorNode);
//           }
//         }
//       }
//     });
//   };
// }




import fs from 'fs';
import path from 'path';
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';

/**
 * Remark plugin to process [!include[...](...)] syntax in Markdown files.
 */
export default function remarkIncludeDirective() {
  return (tree, file) => {
    console.log(`[remarkIncludeDirective] Processing: ${file.path}`);

    // Look for paragraphs that contain the broken-up include pattern
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length < 3) return;

      // Look for the pattern: text("[!include") + link + text("]")
      for (let i = 0; i < node.children.length - 2; i++) {
        const firstNode = node.children[i];
        const linkNode = node.children[i + 1];
        const lastNode = node.children[i + 2];

        // Check if we have the include pattern
        if (
          firstNode.type === 'text' && 
          firstNode.value === '[!include' &&
          linkNode.type === 'link' &&
          lastNode.type === 'text' && 
          lastNode.value === ']'
        ) {
          
          const includePath = linkNode.url;
          console.log(`[remarkIncludeDirective] Found include pattern: ${includePath}`);

          try {
            // Resolve relative to the directory of the current file
            const currentDir = path.dirname(file.path);
            const fullPath = path.resolve(currentDir, includePath);
            
            console.log(`[remarkIncludeDirective] Resolving: ${fullPath}`);
            
            let includeContent = fs.readFileSync(fullPath, 'utf-8');
            
            // Remove any markdown comments and clean up
            includeContent = includeContent
              .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
              .trim();
            
            console.log(`[remarkIncludeDirective] Successfully loaded content from: ${includePath}`);
            
            // Fix relative paths in the included content
            const includeDir = path.dirname(fullPath);
            const currentFileDir = path.dirname(file.path);
            
            console.log(`[remarkIncludeDirective] Current file dir: ${currentFileDir}`);
            console.log(`[remarkIncludeDirective] Include file dir: ${includeDir}`);
            
            // Update relative paths in the included content
            includeContent = includeContent.replace(
              /\]\((?!https?:\/\/)(?!\/)(.*?)\)/g, 
              (match, relativePath) => {
                // Resolve the path relative to the include file's directory
                const absolutePath = path.resolve(includeDir, relativePath);
                // Make it relative to the current file's directory
                const adjustedPath = path.relative(currentFileDir, absolutePath);
                // Convert to forward slashes for URLs
                const adjustedPathPosix = adjustedPath.split(path.sep).join('/');
                console.log(`[remarkIncludeDirective] Adjusting path: ${relativePath} -> ${adjustedPathPosix}`);
                return `](${adjustedPathPosix})`;
              }
            );
            
            // Also update image reference definitions
            includeContent = includeContent.replace(
              /^\[([^\]]+)\]:\s*(?!https?:\/\/)(?!\/)(.*?)$/gm,
              (match, label, relativePath) => {
                // Resolve the path relative to the include file's directory
                const absolutePath = path.resolve(includeDir, relativePath);
                // Make it relative to the current file's directory
                const adjustedPath = path.relative(currentFileDir, absolutePath);
                // Convert to forward slashes for URLs
                const adjustedPathPosix = adjustedPath.split(path.sep).join('/');
                console.log(`[remarkIncludeDirective] Adjusting reference: ${relativePath} -> ${adjustedPathPosix}`);
                return `[${label}]: ${adjustedPathPosix}`;
              }
            );
            
            // Parse the included content as markdown
            const parsedContent = fromMarkdown(includeContent);
            
            // Check if this paragraph contains only the include directive
            if (node.children.length === 3 && i === 0) {
              // Replace the entire paragraph with the parsed content
              if (parent && typeof index === 'number') {
                parent.children.splice(index, 1, ...parsedContent.children);
              }
            } else {
              // Replace just the three nodes (text + link + text) with the parsed content
              node.children.splice(i, 3, ...parsedContent.children);
            }
            
            console.log(`[remarkIncludeDirective] Successfully replaced include directive`);
            return; // Exit after processing one include per paragraph
            
          } catch (err) {
            console.warn(`[remarkIncludeDirective] Could not include: ${includePath}`, err.message);
            
            // Replace the three nodes with an error message
            const errorNode = {
              type: 'strong',
              children: [{
                type: 'text',
                value: `Include error: Could not load ${includePath}`
              }]
            };
            
            node.children.splice(i, 3, errorNode);
            return;
          }
        }
      }
    });

    // Also check for complete include patterns in text nodes (fallback)
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value) return;

      const includeRegex = /\[!include\[.*?\]\((.*?)\)\]/g;
      let match;
      let hasMatches = false;
      let newContent = node.value;

      while ((match = includeRegex.exec(node.value)) !== null) {
        hasMatches = true;
        const [fullMatch, includePath] = match;
        
        console.log(`[remarkIncludeDirective] Found include in text: ${includePath}`);

        try {
          const currentDir = path.dirname(file.path);
          const fullPath = path.resolve(currentDir, includePath);
          
          let includeContent = fs.readFileSync(fullPath, 'utf-8');
          includeContent = includeContent
            .replace(/<!--[\s\S]*?-->/g, '')
            .trim();
          
          // Fix relative paths
          const includeDir = path.dirname(fullPath);
          const currentFileDir = path.dirname(file.path);
          
          // Update relative paths in the included content
          includeContent = includeContent.replace(
            /\]\((?!https?:\/\/)(?!\/)(.*?)\)/g, 
            (match, relativePath) => {
              // Resolve the path relative to the include file's directory
              const absolutePath = path.resolve(includeDir, relativePath);
              // Make it relative to the current file's directory
              const adjustedPath = path.relative(currentFileDir, absolutePath);
              // Convert to forward slashes for URLs
              const adjustedPathPosix = adjustedPath.split(path.sep).join('/');
              return `](${adjustedPathPosix})`;
            }
          );
          
          // Also update image reference definitions
          includeContent = includeContent.replace(
            /^\[([^\]]+)\]:\s*(?!https?:\/\/)(?!\/)(.*?)$/gm,
            (match, label, relativePath) => {
              // Resolve the path relative to the include file's directory
              const absolutePath = path.resolve(includeDir, relativePath);
              // Make it relative to the current file's directory
              const adjustedPath = path.relative(currentFileDir, absolutePath);
              // Convert to forward slashes for URLs
              const adjustedPathPosix = adjustedPath.split(path.sep).join('/');
              return `[${label}]: ${adjustedPathPosix}`;
            }
          );
          
          newContent = newContent.replace(fullMatch, includeContent);
          
        } catch (err) {
          console.warn(`[remarkIncludeDirective] Could not include: ${includePath}`, err.message);
          newContent = newContent.replace(fullMatch, `**Include error: Could not load ${includePath}**`);
        }
      }

      if (hasMatches) {
        if (parent && typeof index === 'number') {
          try {
            const parsedContent = fromMarkdown(newContent);
            parent.children.splice(index, 1, ...parsedContent.children);
          } catch (parseErr) {
            node.value = newContent;
          }
        }
      }
    });
  };
}