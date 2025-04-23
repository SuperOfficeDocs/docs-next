import { useEffect } from "react";

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TocProps {
  headings: Heading[];
}

const OnThisArticle: React.FC<TocProps> = ({ headings }) => {
  const filteredHeadings = headings.filter((h) => h.depth > 1);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(".toc-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slug = entry.target.id;
          const activeLink = document.querySelector<HTMLAnchorElement>(
            `.toc-link[data-slug="${slug}"]`
          );

          if (entry.isIntersecting && activeLink) {
            links.forEach((link) =>
              link.classList.remove("text-superOfficeGreen", "font-semibold")
            );
            activeLink.classList.add("text-superOfficeGreen", "font-semibold");
          }
        });
      },
      {
        rootMargin: "0px 0px -30% 0px",
        threshold: 0,
      }
    );

    // Observe each matching heading section
    const sections = Array.from(links).map((link) =>
      document.getElementById(link.hash.slice(1))
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="toc">
      <p className="font-bold text-xs uppercase">In This Article</p>
      <ul className="pl-1">
        {filteredHeadings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              data-slug={heading.slug}
              className="text-xs font-light toc-link"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default OnThisArticle;
