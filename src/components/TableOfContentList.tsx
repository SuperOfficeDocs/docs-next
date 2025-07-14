import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { TocItem } from "~/types/TableOfContentTypes";
import { trimFileExtension } from "~/utils/slugUtils";

const base = import.meta.env.BASE_URL;

type TableOfContentListProps = {
  inputItems: TocItem[];
  slug: string;
  isMainTable: boolean;
  isWebApiTOC: boolean;
};

export default function TableOfContentList({
  inputItems,
  slug,
  isMainTable,
  isWebApiTOC,
}: TableOfContentListProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [showToC, setShowToC] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");

  document.addEventListener("astro:page-load", () => {
    setCurrentPath(window.location.pathname)
  });

  useEffect( () => {
    setCurrentPath(window.location.pathname);
  },[window.location.pathname])

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const generatePath = (item: TocItem): string => {
    if (isWebApiTOC) {
      return `${base}/en/api/reference/webapi/${item.uid}`;
    }
    const rawPath = item.topicHref || item.href;
    if (!rawPath) {
      console.warn(`[generatePath] Missing href/topicHref for TOC item:`, item);
      return "#";
    }
    return `${base}/${slug}/${trimFileExtension(rawPath)}`;
  };

  const generateSlug = (item: TocItem) => {
    if (isWebApiTOC) {
      return slug;
    }

    return item.topicHref ? `${slug}/${item.topicHref.slice(0, -9)}` : slug;
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`w-full overflow-auto ${isMainTable && "md:mx-3 xl:mx-10 md:h-[78vh]"} ${!isMainTable && "pl-4 md:pl-3"}`}>
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
        <div
          className={`px-3 pt-3 w-full flex justify-center ${!isMainTable && "hidden"} `}
        >
          {/* Input for ToC Search */}
          <input
            className="rounded-md h-8 w-full focus:outline-none px-4"
            onChange={handleSearchTermChange}
            value={searchTerm}
            placeholder="Enter here to filter"
          />
        </div>

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
                  className={`w-full break-words text-wrap overflow-hidden ${
                    generatePath(item) == currentPath
                      ? "text-superOfficeGreen font-semibold"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              </button>
            )}

            {openIndexes.includes(index) && item.items && (
              <div className="w-full">
                <TableOfContentList
                  slug={generateSlug(item)}
                  inputItems={item.items}
                  isMainTable={false}
                  isWebApiTOC={isWebApiTOC}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
