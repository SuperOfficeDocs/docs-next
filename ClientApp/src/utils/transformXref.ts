export function transformXref(html: string) {
  return html.replace(
    /<xref href="([^"]+)"[^>]*><\/xref>/g,
    (_match, href) => {
      const segments = href.split(".");
      const linkText = segments[segments.length - 1];
      const url = `/${href.replace(/\./g, "/")}`;
      return `<a class="text-orange-700 no-underline hover:underline font-normal" href="${url}">${linkText}</a>`;
    }
  );
}
