import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { TocItem } from "~/types/TableOfContentTypes";
import { trimFileExtension } from "~/utils/slugUtils";

type TableOfContentListProps = {
  inputItems: TocItem[];
  slug: string;
  isMainTable: boolean;
  onStateChange?: (selfIndex: number) => void;
  parentIndex?: number;
};

export default function TableOfContentList({
  inputItems,
  slug,
  isMainTable,
  onStateChange,
  parentIndex = 0,
}: TableOfContentListProps) {

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [showToC, setShowToC] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isParentActive, setIsParentActive] = useState<number>(-1);
  const [isSelfActive, setIsSelfActive] = useState<boolean>(false);

  useEffect(() => {
    const hasActiveItem = inputItems.some(item => {
      const itemPath = generatePath(item);
      return itemPath === currentPath;
    });

    if ((hasActiveItem || isSelfActive) && typeof onStateChange === "function") {
      onStateChange(parentIndex);
    }
  }, [currentPath, inputItems, onStateChange, isSelfActive]);

  useEffect(() => {
    if (isParentActive != -1) {
      setIsSelfActive(true)
      toggleItem(isParentActive)
    }
  }, [isParentActive])

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [window.location.pathname])

  document.addEventListener("astro:page-load", () => {
    setCurrentPath(window.location.pathname)
  });

  /**
   * Handles state changes in the parent component.
   * @param selfIndex - The index of the element that triggered the state change
   */
  const onStateChangeInParent = (selfIndex: number) => {
    setIsParentActive(selfIndex)
  }

  /**
   * Determines if a table of contents item is currently active.
   * 
   * @param item - The table of contents item to check
   * @param index - The index of the item in the table of contents
   * @returns True if the item's path matches the current path or if the item is an active parent
   */
  const isActive = (item: TocItem, index: number): boolean => {
    return generatePath(item) == currentPath || index == isParentActive
  }

  /**
   * Toggles the open/closed state of an item in the table of contents.
   * 
   * @param index - The index of the item to toggle
   * @returns void
   * 
   */
  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  /**
   * Generates a URL path for a table of contents item.
   * 
   * @param item - The table of contents item to generate a path for
   * @returns A string representing the generated URL path
   * 
   */
  const generatePath = (item: TocItem): string => {
    // uid is only defined in toc files with YamlMime:TableOfContent
    if (item.uid != undefined) {
      const currentPathExceptLastTerm = currentPath.substring(0, currentPath.lastIndexOf("/"))
      return `${currentPathExceptLastTerm}/${item.uid}`;
    }

    // Use topicHref if available, otherwise fall back to href.
    const rawPath = item.topicHref || item.href;
    if (!rawPath) {
      // console.warn(`[generatePath] Missing href/topicHref for TOC item:`, item);
      return "#";
    }
    const formattedURL = `${slug}/${trimFileExtension(rawPath)}`.replace("/index", "")
    const resolvedPath = new URL(formattedURL, "http://docs.superoffice.com").pathname;
    return resolvedPath;
  };

  /**
   * Generates a URL slug for a table of contents item by combining the base slug with the item's topic href.
   * @param item - The table of contents item containing topic href information
   * @returns A string representing the complete URL slug. If the item has no topic href, returns the base slug
   */
  const generateSlug = (item: TocItem) => {
    return (item.href?.endsWith('toc.yml') || item.href?.endsWith('toc.yaml')) ? `${slug}/${item.href.replace(/\/toc/g, "").replace(/\.(md|yml|yaml)$/g, "")}` : slug;
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`w-full overflow-auto  ${isMainTable ? "mx-3 xl:mx-10 lg:h-[78vh]" : "pl-4 md:pl-3"}`}>

      {/* Show/Hide ToC Button. Only visible on mobile view */}
      <div
        onClick={() => {
          setShowToC(!showToC);
        }}
        className={`${showToC ? "bg-sky-900" : "bg-superOfficeGreen"} flex h-10 rounded-md w-full md:m-0 lg:hidden ${isMainTable ? "block" : "hidden"}`}
      >
        <p className="p-2 m-auto text-white text-sm">
          Show / Hide Table of Content
        </p>
      </div>

      {/* ToC outer div */}
      <div
        className={`w-full max-w-md mx-auto rounded-md  ${isMainTable && "h-fit overflow-y-auto overflow-x-hidden"} 
        lg:block ${isMainTable && (showToC ? "block" : "hidden")}`}
      >

        {/* Input box ToC Search */}
        {
          isMainTable && (
            <div
              className={`px-3 pt-3 w-full flex justify-center`}
            >

              <input
                className="rounded-md h-8 w-full focus:outline-none px-4"
                onChange={handleSearchTermChange}
                value={searchTerm}
                placeholder="Enter here to filter"
              />
            </div>
          )
        }

        {/* ToC items */}
        {inputItems?.map((item, index) => (
          <div key={index}>
            {item.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
              <button
                onClick={() => toggleItem(index)}
                className={`w-full text-left flex items-center px-3 pb-2 text-sm text-gray-600 hover:text-black  ${isMainTable && "pt-3"}`}
              >
                <div className="w-6">
                  {item.items && (openIndexes.includes(index) ? "▼" : "▶")}
                </div>

                <a
                  href={generatePath(item)}
                  className={`w-full break-words text-wrap overflow-hidden ${(isActive(item, index))
                    ? "text-superOfficeGreen font-semibold"
                    : ""
                    }`}
                >
                  {item.name}
                </a>
              </button>
            )}

            {item.items && (
              <div className={`w-full ${(openIndexes.includes(index)) ? " block" : "hidden"}`}>

                {/* Recursively call TableOfContentList for expanded sub items */}
                <TableOfContentList
                  slug={generateSlug(item)}
                  inputItems={item.items}
                  isMainTable={false}
                  onStateChange={onStateChangeInParent}
                  parentIndex={index}
                />

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
