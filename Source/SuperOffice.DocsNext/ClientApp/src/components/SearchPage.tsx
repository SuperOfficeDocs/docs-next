import { useRef, useEffect, useState } from "react";
import { ColorCheckbox } from "./CheckBox";
import { trimFileExtension } from "@utils/slugUtils"
import axios from 'axios';
import Pagination from "./Pagination";
import {
  MagnifyingGlass,
  CaretDown, CaretUp
} from "@phosphor-icons/react";



type filterType = {
  [filterGroupName: string]: string[]
}

type currentFiltersCollection = {
  filterGroup: string;
  filterName: string;
  active: boolean;
}

type resultsType = {
  documents: {
    [fieldName: string]: any
  },
  pagination?: {
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

type HighlightProps = {
  text: string;
  query: string;
};

// Component to highlight searched text
const HighlightText: React.FC<HighlightProps> = ({ text, query }) => {


  if (!query) return <>{text}</>;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        regex.test(part) ? (
          <span key={idx} className="bg-yellow-100 font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};


export default function SearchComp() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filters, setFilters] = useState<filterType>({});
  const [results, setResults] = useState<Partial<resultsType>>({});
  const [filterState, setFilterState] = useState<currentFiltersCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [autoComplete, setAutoComplete] = useState<string[]>();
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(true);
  const searchBoxRef = useRef<HTMLDivElement>(null);



  const capitalizeFirstLetter = (str: string) => {
    if (typeof str !== 'string' || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const checkboxOnChange = (filterGroup: string, filterName: string): void => {
    setFilterState(filterState.map(
      (item) => (item.filterGroup == filterGroup && item.filterName == filterName) ? { ...item, active: !item.active } : item))
  }

  const getFilterState = (filterGroup: string, filterName: string): boolean => {
    return filterState.find(item => item.filterGroup == filterGroup && item.filterName == filterName)?.active ?? false
  }

  const getActiveFilters = () => {
    let tempFilterList: filterType = {}
    filterState.filter((item) => item.active).map((item) => {
      if (tempFilterList[item.filterGroup] === undefined) {
        tempFilterList[item.filterGroup] = []
      }
      tempFilterList[item.filterGroup].push(item.filterName)
    })
    return tempFilterList
  }

  const setPreferredLanguage = () => {

    let langArray: string[] = [];

    filterState.filter(item => item.active && item.filterGroup == "language").map(
      item => {
        langArray.push(item.filterName)
      }
    )
    localStorage.setItem("SuperOfficeDocs-lang", JSON.stringify(langArray))
  }

  const getLanguageDisplayName = (language: string) => {
    const languageMap: Record<string, string> = {
      "english": 'EN',
      'danish': 'DA',
      'dutch': 'NL',
      'german': 'DE',
      'norwegian': 'NO',
      'swedish': 'SV'
    };
    return languageMap[language.toLowerCase()] || language.toUpperCase();
  }

  const getCurrentResultCount = (): string => {
    const pageSize = 20;
    const totalCount = results.pagination?.totalCount ?? 0;
    const pageNo = results.pagination?.pageNumber ?? 1;

    if (totalCount === 0) return "No results found";

    const start = Math.min((pageNo - 1) * pageSize + 1, totalCount);
    const end = Math.min(pageNo * pageSize, totalCount);

    return `Showing ${start}-${end} of ${totalCount} results`;
  };

  const resetFilterOptions = () => {
    localStorage.setItem("SuperOfficeDocs-lang", '["English"]');
    setFilterState(prev =>
      prev.map(item => ({ ...item, active: false }))
    );

  }

  const setInitialFilters = async () => {
    const selectedLanguage = JSON.parse(localStorage.getItem("SuperOfficeDocs-lang") ?? '["English"]')

    const currentFilters: filterType = {
      language: [
        "English",
        "Danish",
        "Dutch",
        "German",
        "Norwegian",
        "Swedish",
      ],
    };
    setFilters(currentFilters)

    let filterStateTemp: currentFiltersCollection[] = [];

    Object.entries(currentFilters).forEach(([filterGroupName, filterGroup]) => {
      filterGroup.forEach((filterItem) => {
        filterStateTemp.push({
          filterGroup: filterGroupName,
          filterName: filterItem,
          active: (filterGroupName === "language" && selectedLanguage.includes(filterItem)) ? true : false
        })
      })
    })
    setFilterState(filterStateTemp)
  }

  const doSearch = async (changePageNumber: boolean = false, customQuery?: string) => {
    try {
      setLoading(true)
      setAutoComplete([]);
      setError("");

      const searchQuery = customQuery ?? query

      var pageNum;
      if (changePageNumber) {
        pageNum = pageNo;
      }
      else {
        pageNum = 1
        setPageNo(1)
      }


      if (searchQuery.length == 0) {
        setResults({})
        setSearchedQuery("");
      }
      else {

        if (searchQuery.length < 2) {
          setError("Please enter at least 2 characters")
          throw Error("Validation failed. Query is less than 2 characters");
        }
        if (getActiveFilters().language?.join(",") == undefined) {
          checkboxOnChange("language", "English")
        }
        const currentFilterList = getActiveFilters().language?.join(",") ?? "English";

        const searchResponse = await axios.get("/api/search/search", {
          params: {
            q: searchQuery,
            languages: currentFilterList,
            page: pageNum
          },
        });
        setResults(searchResponse.data as resultsType);
        setSearchedQuery(customQuery ?? query)
        if (customQuery) {
          setQuery(customQuery)
        }

      }
    } catch (error) {
      setResults({});
    }
    finally {
      setLoading(false)
    }
  }

  const setAutoCompleteSuggestions = async () => {
    const response = await axios.get("/api/search/autocomplete", {
      params: {
        q: query,
      },
    });
    setAutoComplete(response.data as string[])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && autoComplete && autoComplete.length > 0) {
        doSearch(false, autoComplete[highlightedIndex]);
      } else {
        doSearch();
      }
    }


    if (!autoComplete || autoComplete.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < autoComplete.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : autoComplete.length - 1
      );
    }
  };


  const updateUrl = (filters: filterType) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);

    Object.entries(filters).forEach(([group, values]) => {
      if (values.length > 0) {
        params.set(group, values.map(v => encodeURIComponent(v.toLowerCase())).join(","));
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    setError("")
    if (!query) {
      setResults({});
      setInitialFilters();
      return;
    }
    setAutoCompleteSuggestions();
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("query") || "");
    setInitialFilters();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setAutoComplete([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const activeFilters = getActiveFilters();
    updateUrl(activeFilters);
    setPreferredLanguage()
    doSearch();
  }, [filterState]);


  useEffect(() => {
    doSearch(true)
  }, [pageNo])



  return (
    <div className="w-full">
      {/* Search Hero */}
      <div className="w-full px-6 py-3 md:px-28 lg:px-72 lg:py-6 bg-gradient-to-r from-[#31b494] to-[#0a5e58] text-white lg:h-20 flex justify-center items-center">
        {/* Search box wrapper */}
        <div ref={searchBoxRef} className="relative flex w-full max-w-[600px]">
          <input
            id="searchInput"
            placeholder="Enter search terms..."
            className="w-full h-10 rounded-s-full px-5  text-black focus:outline-none"
            type="search"
            onKeyDown={handleKeyDown}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1); // reset highlight on typing
            }}
          />
          <button
            onClick={() => doSearch()}
            className="focus:outline-none pl-3 rounded-e-full pr-5 py-3 inline-flex items-center h-10 text-superOfficeGreen font-medium bg-white"
          >
            <MagnifyingGlass />
          </button>

          {/* Autocomplete Dropdown */}
          {query && autoComplete && autoComplete.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-1 w-[90%] mx-auto bg-white border rounded shadow z-10">
              {autoComplete
                .filter((item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                )
                .map((item, index) => (
                  <li
                    key={index}
                    onClick={() => doSearch(false, item)}
                    className={`px-3 py-2 cursor-pointer text-black ${index === highlightedIndex
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {item}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search Body*/}

      <div className="flex flex-col items-center h-full md:h-[480px] 2xl:h-[600px] p-2 md:flex-row md:mt-2 md:pl-6 md:pt-4 mx-2 lg:mx-20">

        {/* Filters Menu */}
        <div className={`bg-lightTealGray py-2 px-4 md:py-4 w-full md:w-[25%] h-fit rounded-lg mb-3`}>
          <div className={`flex flex-row justify-between ${filtersExpanded && "border-b-[1px] pb-3"} border-black`}>
            <p className="font-bold">Filters</p>
            <button className="block" onClick={() => setFiltersExpanded(!filtersExpanded)}>{filtersExpanded ? <CaretUp /> : <CaretDown />}</button>
          </div>
          {filtersExpanded && <>
            {/* filter list */}
            <ul className={`flex flex-col overflow-y-auto h-fit max-h-80 min-h-40`}>
              {Object.entries(filters).map(([filterGroupName, filterGroup], index) => (
                <li className="mt-5" key={index + filterGroupName}>
                  <p className="font-semibold mb-2">{capitalizeFirstLetter(filterGroupName)}</p>
                  <ul>
                    {filterGroup.map((filterItemName, index) => (
                      <li className="ml-2 flex items-center" key={index + filterItemName}>
                        <ColorCheckbox
                          checked={getFilterState(filterGroupName, filterItemName)}
                          onChange={() => checkboxOnChange(filterGroupName, filterItemName)}
                        />
                        <label className="ml-2" htmlFor={filterItemName}>
                          {filterItemName != "" ? capitalizeFirstLetter(filterItemName) : "No filter"}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {/* Filter buttons */}
            <div className="flex justify-center w-full mt-5">
              <button onClick={() => resetFilterOptions()} className={`bg-gray-500 rounded-md px-3 py-1 w-full text-white hover:text-superOfficeGreen`}>Reset</button>
            </div>
          </>}
        </div>

        {loading ?

          <div className="w-full h-[450px] py-10 flex justify-center items-center">
            {/* Loading animation */}
            <div
              className="inline-block h-8 w-8 animate-spin text-superOfficeGreen rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
            </div>
          </div>

          :

          <div className="w-full px-2 md:pl-8 h-full">

            {error == "" ?
              <>
                {/* Search Results text */}
                <div className="">
                  {((results.documents?.length == undefined) && !loading) &&
                    <div className="h-full lg:flex lg:h-[450px] justify-center items-center flex-col">
                      <div className="text-center mb-2">
                        <p className="p-2">Welcome to Documentation Search</p>
                        <p className="p-2">Enter search terms above to find documentation across multiple languages.</p>
                      </div>

                      <ul className="list-inside list-disc flex flex-col space-y-3">
                        <li>Use quotes for exact phrases: <span className="bg-lightTealGray px-1 text-superOfficeGreen font-thin">"exact phrase"</span></li>
                        <li>Use multiple words to refine results</li>
                        <li>Select specific languages from the sidebar</li>
                        <li>Use the autocomplete suggestions for faster searching</li>
                      </ul>
                    </div>}
                </div>

                {/* Results list */}
                {(!loading && searchedQuery && (results.documents?.length > 0 ?
                  <>
                    <ul className="h-[400px] 2xl:h-[600px] px-4 overflow-y-auto overflow-x-hidden">
                      <div className="flex text-center justify-center flex-col py-6">
                        {query && (
                          <>
                            <p className="text-xl">Search results for
                              <span className="font-bold text-superOfficeGreen"> "{searchedQuery}"</span>
                            </p>
                          </>
                        )}
                        <span className="text-gray-500 mt-2">{getCurrentResultCount()}</span>
                      </div>
                      {results.documents?.map((result: any, index: number) => (
                        <li className="flex flex-col py-5 mb-3 border-t-[1px] border-gray-300" key={index + result.title}>
                          <a className="font-semibold text-lg text-superOfficeGreen hover:text-black hover:underline" href={trimFileExtension(result.url)}>{result.title}</a>
                          <p className="py-2"><HighlightText
                            text={result.content.length > 200 ? result.content.slice(0, 200) + "..." : result.content}
                            query={searchedQuery}
                          /></p>
                          <div className="flex flex-row justify-between"><a href={trimFileExtension(result.url)} className="text-superOfficeGreen text-sm">{result.url}</a><p className="bg-lightTealGray rounded-xl text-sm px-1 md:px-2">{getLanguageDisplayName(result.language)}</p></div>
                        </li>
                      ))}
                    </ul>

                    <Pagination currentPage={pageNo} totalPages={results.pagination?.totalPages ?? 0} onPageChange={setPageNo} />
                  </>
                  :
                  // No Results found section
                  <div className="flex flex-col h-[450px] justify-center items-center">
                    <div className="text-center mb-2">
                      <p className="text-2xl mb-2">No results found for "{searchedQuery}"</p>
                      <p className="text-gray-600">Try adjusting your search terms or check the spelling.</p>
                    </div>
                    <ul className="list-disc flex flex-col space-y-2 mt-5">
                      <li>Make sure all words are spelled correctly</li>
                      <li>Try different keywords</li>
                      <li>Try more general keywords</li>
                      <li>Try selecting different languages</li>
                    </ul>
                  </div>
                ))}

              </>
              :
              // Error section
              <div className="flex h-[450px]  flex-col">
                <div className="pl-10 pt-5">
                  <p className="p-2">{error}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div >
  );
}
