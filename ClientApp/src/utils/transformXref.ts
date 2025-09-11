export function transformXref(html: string) {
  return html?.replace(
    /<xref href="([^"]+)"[^>]*><\/xref>/g,
    (_match, href) => {
      const segments = href.split(".");
      const linkText = segments[segments.length - 1];
      return `<a class="text-orange-700 not-prose no-underline hover:underline" href="${href}">${linkText}</a>`;
    }
  );
}
