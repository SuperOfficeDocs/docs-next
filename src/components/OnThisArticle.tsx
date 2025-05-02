import { useEffect, useState } from "react";

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TocProps {
  headings: Heading[];
  showSubHeading?: boolean;
}

const OnThisArticle: React.FC<TocProps> = ({ headings, showSubHeading = true }) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const groupedHeadings = () => {
    const result: { main: Heading; subs: Heading[] }[] = [];
    let currentMain: Heading | null = null;

    for (const heading of headings) {
      if (heading.depth === 2) {
        currentMain = heading;
        result.push({ main: heading, subs: [] });
      } else if (heading.depth > 2 && currentMain) {
        result[result.length - 1].subs.push(heading);
      }
    }

    return result;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setActiveSlug(id);
          }
        });
      },
      {
        rootMargin: "0px 0px -30% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const isActive = (slug: string) => slug === activeSlug;
  const shouldHighlightMain = (mainSlug: string, subSlugs: string[]) =>
    isActive(mainSlug) || subSlugs.includes(activeSlug ?? "");

  return (
    <nav className="toc overflow-y-auto overflow-x-hidden max-h-full">
      <p className="font-bold text-xs uppercase">In This Article</p>
      <ul className="space-y-1.5 mt-2 text-gray-600">
        {groupedHeadings().map(({ main, subs }) => {
          const subSlugs = subs.map((s) => s.slug);
          const expand = shouldHighlightMain(main.slug, subSlugs);
          const highlightMain = shouldHighlightMain(main.slug, subSlugs);

          return (
            <li key={main.slug}>
              <a
                href={`#${main.slug}`}
                className={`toc-link block text-xs font-normal pl-2
                  ${ highlightMain ? "text-superOfficeGreen font-semibold" : "" }
                  ${ highlightMain ? "border-l-2 border-superOfficeGreen" : ""}
                  `}
                data-slug={main.slug}
              >
                {main.text}
              </a>

              {showSubHeading && subs.length > 0 && (
                <ul
                  className={`pl-3 mt-2 space-y-1 transition-all duration-200 ${
                    expand ? "max-h-[1000px] opacity-100" : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  {subs.map((sub) => (
                    <li key={sub.slug}>
                      <a
                        href={`#${sub.slug}`}
                        className={`toc-link block text-xs font-normal ${
                          isActive(sub.slug) ? "text-superOfficeGreen" : ""
                        }`}
                        data-slug={sub.slug}
                      >
                        <span className="w-4">{isActive(sub.slug) ? ">" : ""}</span>{sub.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default OnThisArticle;
