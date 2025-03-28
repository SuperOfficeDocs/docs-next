import React from "react";

export default function LanguageSelect({
  currentLocale,
  url,
}: {
  currentLocale: string;
  url: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [language, setLanguage] = React.useState<string>("");

  // Format : [Language, ShortForm, WordFor"Languages"]
  const languageList = [
    ["Dansk", "da", "Sprog"],
    ["Deutch", "de", "Sprachen"],
    ["Dutch", "nl", "Talen"],
    ["English", "en", "Languages"],
    ["Norsk", "no", "Språk"],
    ["Svenska", "sv", "Språk"],
  ];

  React.useEffect( () => {
    for (const selectedLanguage of languageList) {
      if (currentLocale == selectedLanguage[1]) {
        setLanguage(selectedLanguage[2]);
      }
    }
  },[])

  return (
    <div className="h-full">
      <button
        className="h-full flex w-32 justify-center items-center text-superOfficeGreen text-center hover:bg-gray-200"
        onClick={() => setExpanded((curr) => !curr)}
      >{language}</button>
      <div
        className={`absolute z-50 py-2 w-40 shadow-md rounded-md mt-1 overflow-hidden  bg-white ${expanded ? "block" : "hidden"}`}
      >
        <ul className=" [&>li]:px-5  [&>li]:py-1 text-sm">
          {languageList.map((item) => {
            return (
              <li
                className={` ${currentLocale == item[1] ? "bg-superOfficeGreen text-white" : "hover:bg-gray-200"}`}
              >
                <a href={url.replace(currentLocale, item[1])}>{item[0]}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
