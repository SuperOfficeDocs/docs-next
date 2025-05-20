import { useEffect } from 'react';

interface Link {
  text?: string;
  href?: string;
  ariaLabel?: string;
  icon?: string;
}

export interface FooterProps {
  links: Link[];
}

export default function FooterIsland({ links }: FooterProps) {
  useEffect(() => {
    const footer = document.getElementById('scroll-footer');
    const scrollContainer = document.querySelector<HTMLElement>('[data-scroll-container]');
    if (!footer || !scrollContainer) return;

    const checkScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 30;
      footer.classList.toggle('opacity-100', nearBottom);
      footer.classList.toggle('opacity-0', !nearBottom);
      footer.classList.toggle('pointer-events-none', !nearBottom);
    };

    scrollContainer.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <footer
      id="scroll-footer"
      className="fixed bottom-0 left-0 w-full z-50 bg-superOfficeGreen text-white opacity-0 pointer-events-none transition-opacity duration-500"
    >
      <div className="mx-auto px-2 md:px-4 max-w-7xl md:flex items-center justify-between">
        <div className="text-sm mr-4">
          Copyright &copy; {new Date().getFullYear()}{' '}
          <a href="https://www.superoffice.com/">SuperOffice</a>
          <span className="hidden xl:inline"> · All rights reserved.</span>
        </div>
        {links.length > 0 && (
          <nav className="py-6 md:py-8 md:flex md:items-center md:justify-between" aria-label="resources">
            <ul className="md:flex ml-2 lg:ml-4 md:mb-0">
              {links.map((link, i) => (
                <li key={i} className="flex items-center mb-2 md:mb-0">
                  <a
                    href={link.href}
                    className="focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 text-center mr-1 md:mr-0"
                  >
                    {link.text}
                  </a>
                  {i < links.length - 1 && <span className="text-gray-400 mx-1 hidden md:inline">|</span>}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
