import { useEffect, useState } from "react";
import { ColorCheckbox } from "./CheckBox";


const baseUrl = import.meta.env.BASE_URL ?? "" // Currently baseUrl is /docs-next/
var pathname: string;

type filterType = {
  [filterGroupName: string]: {
    [filterItemName: string]: number
  };
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



  const checkboxOnChange = (filterGroup: string, filterName: string): void => {
    setIsFiltersChanged(true)
    setFilterState(filterState.map(
      (item) => item.filterGroup == filterGroup && item.filterName == filterName ? { ...item, active: !item.active } : item))
  }

  const getFilterState = (filterGroup: string, filterName: string): boolean => {
    return filterState.find(item => item.filterGroup == filterGroup && item.filterName == filterName)?.active ?? false
  }

  const getActiveFilters = () => {
    return filterState.filter((item) => item.active).map((item) => { return { [item.filterGroup]: item.filterName } })
  }

  const applyFilerChanges = () => {
    // console.log("click")
    setIsFiltersChanged(false)
    doSearch()
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

  async function doSearch() {
    try {
      let pagefind = await getPagefind();
      console.log("test")
      const currentFilterArray = getActiveFilters();
      console.log("current", currentFilterArray)
      const searchResponse = await pagefind.search(query, {
        filters: Object.assign({}, ...currentFilterArray)
      });
      const detailedResults = await Promise.all(
        (searchResponse.results || []).map((r: any) => r.data())
      );
      setResults(detailedResults);
      console.log("result", detailedResults)
    } catch (error) {
      console.error("Pagefind search failed:", error);
      setResults([]);
    }
  }

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    doSearch();

  }, [query]);

  useEffect(() => {
    pathname = window?.location.host
    setInitialFilters()
  }, [])


  // useEffect(() => {
  //   console.log(filterState)
  // }, [filterState])


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
      <div className="p-6">

        {/* Search Results text */}
        {query != "" && <p>Search Results for <strong>{query}</strong></p>}


        <div className="mt-10 flex flex-row">

          {/* Filters */}
          <div className="bg-lightTealGray p-4 w-[25%] h-80 rounded-lg">

            <div className="flex flex-row justify-between pb-3 border-b-2 border-black">
              <p className="font-bold">Filters</p>
              <p className="text-superOfficeGreen">Clear All</p>
            </div>



            <ul className="flex flex-col">
              {Object.entries(filters).map(([filterGroupName, filterGroup]) => (
                <li className="mt-5" key={filterGroupName}>
                  <p className="font-semibold">By {filterGroupName}</p>
                  <ul>
                    {Object.entries(filterGroup).map(([filterItemName, count], index) => (
                      <li className="ml-2" key={index + filterItemName}>
                        <ColorCheckbox
                          checked={getFilterState(filterGroupName, filterItemName)}
                          onChange={() => checkboxOnChange(filterGroupName, filterItemName)}
                        />
                        <label className="ml-2" htmlFor={filterItemName}>
                          {filterItemName} ({count})
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div>
              {isFiltersChanged && <button onClick={applyFilerChanges} className="text-superOfficeGreen">Set Filters</button>}
            </div>

          </div>

          {/* Results */}
          <div className="pl-10 w-[60%] overflow-y-auto">
            <ul>
              {results.length === 0 && (query ? <li>No results found</li> : <li>Type in search text then press Enter</li>)}
              {results.map((result: any) => (
                <li className="flex flex-col mb-5" key={result.id + result.meta.title}>
                  <a className="font-semibold text-lg" href={result.url}>{result.meta.title}</a>
                  <a className="text-superOfficeGreen" href={result.url}>{pathname}{result.url}</a>
                  <p className="search-snippet" dangerouslySetInnerHTML={{ __html: result.excerpt }}></p>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </div>
    </div>
  );
}
