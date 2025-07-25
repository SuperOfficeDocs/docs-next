import { useEffect, useState } from "react";
import { ColorCheckbox } from "./CheckBox";
import { trimFileExtension } from "@utils/slugUtils"

const baseUrl = import.meta.env.BASE_URL ?? "" // Currently baseUrl is /docs-next/
// var pathname: string;

type filterType = {
  [filterGroupName: string]: {
    [filterItemName: string]: number
  };
}

type filterListType = {
  [filterGroupName: string]: string[];
}

type currentFiltersCollection = {
  filterGroup: string;
  filterName: string;
  active: boolean;
}

export default function PagefindSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<filterType>({});
  const [results, setResults] = useState<any[]>([]);
  const [filterState, setFilterState] = useState<currentFiltersCollection[]>([]);
  const [isFiltersChanged, setIsFiltersChanged] = useState<boolean>(false);
  const [noOfResults, setNoOfResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);


  const capitalizeFirstLetter = (str: string) => {
    if (typeof str !== 'string' || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  const checkboxOnChange = (filterGroup: string, filterName: string): void => {
    setIsFiltersChanged(true)
    setFilterState(filterState.map(
      (item) => item.filterGroup == filterGroup && item.filterName == filterName ? { ...item, active: !item.active } : item))
  }

  const getFilterState = (filterGroup: string, filterName: string): boolean => {
    return filterState.find(item => item.filterGroup == filterGroup && item.filterName == filterName)?.active ?? false
  }

  const getActiveFilters = () => {
    let tempFilterList: filterListType = {}
    filterState.filter((item) => item.active).map((item) => {
      if (tempFilterList[item.filterGroup] === undefined) {
        tempFilterList[item.filterGroup] = []
      }
      tempFilterList[item.filterGroup].push(item.filterName)
    })
    return tempFilterList
  }

  const applyFilerChanges = () => {
    if (query == "") {
      doSearch(true)
    }
    else {
      doSearch(false)
    }
  }

  let _pagefind: any;

  async function getPagefind(): Promise<any> {
    if (_pagefind) {
      return Promise.resolve(_pagefind)
    }
    try {
      _pagefind = await import(/* @vite-ignore */ `${baseUrl}/pagefind/pagefind.js`);
      return _pagefind
    }
    catch (error) {
      console.error("Pagefind search failed:", error);
      throw error
    }
  }

  async function setInitialFilters() {
    let pagefind = await getPagefind();
    const currentFilters: filterType = await pagefind.filters();
    setFilters(currentFilters)

    let filterStateTemp: currentFiltersCollection[] = [];

    Object.entries(currentFilters).map(([filterGroupName, filterGroup]) => {
      Object.entries(filterGroup).map(([filterItemName]) => {
        filterStateTemp.push({
          filterGroup: filterGroupName,
          filterName: filterItemName,
          active: false
        })
      })
    })

    setFilterState(filterStateTemp)
  }

  async function doSearch(filterOnly: boolean) {
    try {
      setLoading(true)
      let pagefind = await getPagefind();
      const currentFilterArray = getActiveFilters();
      const searchResponse = await pagefind.search(
        filterOnly ? null : query,
        {
          filters: currentFilterArray
        });
      const detailedResults = await Promise.all(
        (searchResponse.results || []).map((r: any) => r.data())
      );

      setResults(detailedResults);
      setFilters(searchResponse.filters)
      setIsFiltersChanged(false);
      setNoOfResults(searchResponse.results.length)
    } catch (error) {
      console.error("Pagefind search failed:", error);
      setResults([]);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!query) {
      setResults([]);
      setInitialFilters();
      return;
    }
    doSearch(false);

  }, [query]);

  useEffect(() => {
    // pathname = window?.location.host
    setInitialFilters();
  }, [])



  return (
    <div className="">
      {/* Search Hero */}
      <div className="w-full mx-auto py-6 bg-gradient-to-r from-[#31b494] to-[#0a5e58] text-white relative z-0 h-24 flex justify-center items-center px-72">
        <input
          placeholder="Search"
          className="w-full h-10 rounded-full px-5 text-black"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)} />
      </div>

      {/* Search Body*/}

      {loading ?
        <div className="w-full h-96 flex justify-center items-center">
          {/* Loading animation */}
          <div
            className="inline-block h-8 w-8 animate-spin text-superOfficeGreen rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
          </div>
        </div>
        :
        <div className="pl-6 pt-4 pr-2">

          {/* Search Results text */}
          <div className="h-7">
            {query != "" && !loading && <p>Found {noOfResults} results for <strong>"{query}"</strong></p>}
          </div>

          <div className="mt-2 flex flex-row">

            {/* Filters */}
            <div className="bg-lightTealGray p-4 w-[25%] h-[400px] rounded-lg">

              <div className="flex flex-row justify-between pb-3 border-b-2 border-black">
                <p className="font-bold">Filters</p>
                {/* <p className="text-superOfficeGreen">Clear All</p> */}
              </div>


              {/* filter list */}
              <ul className="flex flex-col overflow-y-auto h-[275px] 2xl:h-96">
                {Object.entries(filters).map(([filterGroupName, filterGroup], index) => (
                  <li className="mt-5" key={index + filterGroupName}>
                    <p className="font-semibold mb-2">By {capitalizeFirstLetter(filterGroupName)}</p>
                    <ul>
                      {Object.entries(filterGroup).map(([filterItemName, count], index) => (
                        <li className="ml-2 flex items-center" key={index + filterItemName}>
                          <ColorCheckbox
                            checked={getFilterState(filterGroupName, filterItemName)}
                            onChange={() => checkboxOnChange(filterGroupName, filterItemName)}
                          />
                          <label className="ml-2" htmlFor={filterItemName}>
                            {filterItemName != "" ? capitalizeFirstLetter(filterItemName) : "No filter"} ({count})
                          </label>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end gap-2">
                <button onClick={setInitialFilters} className={` mt-5 rounded-lg px-3 py-1 w-fit text-superOfficeGreen hover:text-red-400`} disabled={!(isFiltersChanged)}>Reset</button>
                <button onClick={applyFilerChanges} className={` mt-5 rounded-lg px-3 py-1 w-fit  ${(isFiltersChanged) ? "bg-superOfficeGreen text-white hover:shadow-md" : "bg-gray-200 text-slate-500"}`} disabled={!(isFiltersChanged)}>Set Filters</button>
              </div>

            </div>

            {/* Results */}
            <div className="pl-8 w-full h-96 overflow-y-auto overflow-x-hidden">
              <ul>
                {results.length === 0 && (query ? <li>No results found</li> : <li>Type in search text then press Enter</li>)}
                {results.map((result: any, index: number) => (
                  <li className="flex flex-col mb-5" key={index + result.meta.title}>
                    <a className="font-semibold text-lg text-superOfficeGreen hover:text-black hover:underline" href={trimFileExtension(result.url)}>{result.meta.title}</a>
                    {/* <a className="text-superOfficeGreen" href={result.url}>{pathname}{result.url}</a> */}
                    <p className="search-snippet" dangerouslySetInnerHTML={{ __html: result.excerpt }}></p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>}
    </div>
  );
}
