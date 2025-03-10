import { useState } from "react";
import type { TocItem } from "~/types/TableOfContentTypes";

type TableOfContentListProps = {
  inputItems: TocItem[];
  slug: string;
  isMainTable: boolean;
};

export default function TableOfContentList({
  inputItems,
  slug,
  isMainTable,
}: TableOfContentListProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const generatePath = (item: TocItem): string => {
    return item.topicHref
      ? `/${slug}/${item.topicHref?.slice(0, -3)}`
      : `/${slug}/${item.href?.slice(0, -3)}`;
  };

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-lg  ${isMainTable && "h-[400px] overflow-y-scroll"} `}
    >
      {inputItems?.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggleItem(index)}
            className={`w-full text-left flex items-center px-3 pb-2 text-sm text-gray-600 hover:text-black  ${isMainTable && " pb-4 "}`}
          >
            <span className="w-7">
              {item.items && (openIndexes.includes(index) ? "▼" : "▶")}
            </span>

            <a
              href={generatePath(item)}
              className={` w-40 ${
                generatePath(item) == window.location.pathname
                  ? "text-superOfficeGreen font-semibold"
                  : ""
              }`}
            >
              {item.name}
            </a>
          </button>

          {openIndexes.includes(index) && item.items && (
            <div className="pl-6">
              <TableOfContentList
                slug={item.href ? `${slug}/${item.href.slice(0, -8)}` : slug}
                inputItems={item.items}
                isMainTable={false}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
