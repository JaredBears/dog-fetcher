import React from "react";
import { useState, useEffect } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import PageNav from "./PageNav";
import Results from "./Results";



const Search = (props) => {
    const [allBreeds, setAllBreeds] = useState([]);
    const [searchBreeds, setSearchBreeds] = useState([]);
    const [zipCode, setZipCode] = useState("");
    const [ageMin, setAgeMin] = useState(0);    
    const [ageMax, setAgeMax] = useState(0);
    const [size, setSize] = useState(25);
    const [sort, setSort] = useState("asc");
    const [resultIds, setResultIds] = useState([]);
    const [pages, setPages] = useState([]);
    const [nextPage, setNextPage] = useState(0);
    const [prevPage, setPrevPage] = useState(0);
    const [savedIds, setSavedIds] = useState([]);
    const [advanced , setAdvanced] = useState(false);
    const [matched, setMatched] = useState(false);
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if(resultIds.length > 0) {
            console.log("useEffect resultIds")
            console.log(resultIds)
            handleResults();
        } else {
            setNextPage(0);
            setPrevPage(0);
            setPages([]);
            setResults([]);
            setAdvanced(false);
            setMatched(false);
        }
    }, [resultIds]);

    const fetchBreeds = async () => {
        try {
            const response = await fetch(props.API + "/dogs/breeds", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAllBreeds(data);
            } else {
                if(response.status === 401) {
                    props.setError("You must be logged in to search");
                    props.setUser(null);
                    return;
                }
                else {
                    throw new Error(response.status);
                }
            }
        } catch (error) {
            props.setError("Error retrieving breeds");
            console.log(error.message);
            return;
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setSavedIds([]);
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (zipCode ? "&zipCodes=" + zipCode : "") + (ageMin ? "&ageMin=" + ageMin : "") + (ageMax ? "&ageMax=" + ageMax : "") + (size !== 25 ? "&size=" + size : "") + (sort ? "&sort=breed:" + sort : "");
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const searchAll = (event) => {
        event.preventDefault();
        setSavedIds([]);
        setAdvanced(false);
        fetchResults(props.API + "/dogs/search?sort=breed:asc");
    };

    const handleNext = () => {
        if(!nextPage) return;
        setCurrentPage(currentPage + 1)
        fetchResults(props.API + nextPage);
    };

    const handlePrev = () => {
        if(!prevPage) return;
        setCurrentPage(currentPage - 1)
        fetchResults(props.API + prevPage);
    };

    const fetchPage = (page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
        const from = (page - 1) * size;
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (zipCode ? "&zipCodes=" + zipCode : "") + (ageMin ? "&ageMin=" + ageMin : "") + (ageMax ? "&ageMax=" + ageMax : "") + (size ? "&size=" + size : "") + (from ? "&from=" + from : "") + (sort ? "&sort=breed:" + sort : "");
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const handleAdvanced = (event) => {
        event.preventDefault();
        fetchBreeds();
        setAdvanced(!advanced);
    };

    const fetchResults = async (url) => {
        props.setError("");
        setMatched(false);
        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setResultIds(data.resultIds);
                setNextPage(data.next);
                setPrevPage(data.prev);
                if(data.total / size > 1) {
                    setPages(Array.from(Array(Math.ceil(data.total / size)).keys()).map((page) => page + 1));
                } else {
                    setPages([]);
                }
            } else {
                if(response.status === 401) {
                    props.setError("You must be logged in to search");
                    props.setUser(null);
                    return;
                }
                else {
                    throw new Error(response.status);
                }
            }
        } catch (error) {
            props.setError("Error retrieving results");
            console.log(error.message);
            return;
        }
    };

    const handleResults = async () => {
        try {
            const response = await fetch(props.API + "/dogs/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resultIds),
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data)
                console.log(data)
            } else {
                if(response.status === 401) {
                    props.setError("You must be logged in to search");
                    props.setUser(null);
                    return;
                }
                else {
                    throw new Error(response.status);
                }
            }
        } catch (error) {
            props.setError("Error retrieving results");
            console.log(error.message);
            return;
        }
    };

    const findMatch = async () => {
        console.log(JSON.stringify(savedIds))
        try {
            const response = await fetch(props.API + "/dogs/match", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    },
                body: JSON.stringify(savedIds),
            });
            console.log(savedIds)
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setResultIds([data.match]);
                setSavedIds([]);
                setMatched(true);
                setPages([]);
            } else {
                if(response.status === 401) {
                    props.setError("You must be logged in to search");
                    props.setUser(null);
                    return;
                }
                else {
                    throw new Error(response.status);
                }
            }
        } catch (error) {
            props.setError("Error retrieving results");
            console.log("error", error.message);
            return;
        }
    };


    return (
        <div className="App-search">
            <button onClick={searchAll}>Browse All Dogs</button>
            <button onClick={handleAdvanced}>Advanced Search</button>
            {advanced &&
                <form onSubmit={handleSearch}>
                    <label htmlFor="breeds">Breeds:</label>
                    <Typeahead
                        id="breeds"
                        labelKey="name"
                        multiple
                        options={allBreeds}
                        minLength={1}
                        placeholder="Choose breeds..."
                        onChange={(selected) => {
                            setSearchBreeds(selected);
                        }}
                        selected = {searchBreeds}
                        positionFixed={true}
                    />
                    <br /><label htmlFor="zipCodes">Zip Code:</label>
                    <input type="text" id="zipCode" placeholder="Enter zip code" onChange={(event) => setZipCode(event.target.value)} />
                    <br /><label htmlFor="ageMin">Age Min:</label>
                    <input type="number" id="ageMin" placeholder="Enter age min" onChange={(event) => setAgeMin(event.target.value)} />
                    <br /><label htmlFor="ageMax">Age Max:</label>
                    <input type="number" id="ageMax" placeholder="Enter age max" onChange={(event) => setAgeMax(event.target.value)} />
                    <br /><label htmlFor="size">Size:</label>
                    <select id="size" defaultValue={"25"} onChange={(event) => setSize(event.target.value)}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <br /><label htmlFor="sort">Breed Sort Order: </label>
                    <label htmlFor="sort">Ascending</label><input type="radio" id="sort" name="sort" value="asc" onChange={(event) => setSort(event.target.value)} />
                    <label htmlFor="sort">Descending</label><input type="radio" id="sort" name="sort" value="desc" onChange={(event) => setSort(event.target.value)} />
                    <br /><input type="submit" value="Search" />
                </form>
            }
            {results.length > 0 && <Results results={results} savedIds={savedIds} setSavedIds={setSavedIds} matched={matched} findMatch={findMatch} /> }
            {pages.length > 1 && <p>Page {currentPage} / {pages.length}</p>}
            {pages.length > 1 && <PageNav pages={pages} fetchPage={fetchPage} handleNext={handleNext} handlePrev={handlePrev} nextPage={nextPage} prevPage={prevPage} currentPage={currentPage} />}
        </div>
    );
};

export default Search;