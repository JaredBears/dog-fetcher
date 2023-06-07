import React from "react";
import { useState, useEffect} from "react";
import { Autocomplete, Box, Button, ButtonGroup, ClickAwayListener, FormControl, FormControlLabel, FormHelperText, FormLabel, Grow,
        MenuItem, MenuList, Pagination, Paper, Popper, Radio, RadioGroup, Select, TextField } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Results from "./Results";

const Search = (props) => {
    // variables for search
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
    const [currPage, setCurrPage] = useState(1); 

    // variables for the split button to trigger search types
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const searchOptions = ["Browse All Dogs", "Advanced Search"]

    // methods for search:

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
            return;
        }
    };

    const handleSearch = () => {
        setSavedIds([]);
        setCurrPage(1);
        if(!ageMax){
            setAgeMax(100);
        }
        if(ageMin < 0 || ageMax < 0) {
            props.setError("Age must be a positive number");
            setResultIds([])
            return;
        }
        if(ageMin > ageMax) {
            props.setError("Minimum age must be less than maximum age");
            setResultIds([])
            return;
        }
        if(zipCode.length > 0 && !zipCode.match(/^\d{5}$/)) {
            props.setError("Zip code must be 5 digits");
            setResultIds([])
            return;
        }
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (zipCode ? "&zipCodes=" + zipCode : "") + (ageMin ? "&ageMin=" + ageMin : "") + (ageMax ? "&ageMax=" + ageMax : "") + (size !== 25 ? "&size=" + size : "") + (sort ? "&sort=breed:" + sort : "");
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const searchAll = () => {
        setAdvanced(false);
        setSavedIds([]);
        setAdvanced(false);
        setCurrPage(1);
        fetchResults(props.API + "/dogs/search?sort=breed:asc");
    };

    const handlePageChange = (event, page) => {
        if (parseInt(page) === parseInt(currPage)) return;
        setCurrPage(parseInt(page));
        const from = (page - 1) * size;
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (zipCode ? "&zipCodes=" + zipCode : "") + (ageMin ? "&ageMin=" + ageMin : "") + (ageMax ? "&ageMax=" + ageMax : "") + (size ? "&size=" + size : "") + (from ? "&from=" + from : "") + (sort ? "&sort=breed:" + sort : "");
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const handleNext = () => {
        if(!nextPage) return;
        setCurrPage(parseInt(currPage) + 1)
        fetchResults(props.API + nextPage);
    };

    const handlePrev = () => {
        if(!prevPage) return;
        setCurrPage(parseInt(currPage) - 1)
        fetchResults(props.API + prevPage);
    };

    const fetchPage = (page) => {
        if (parseInt(page) === parseInt(currPage)) return;
        setCurrPage(parseInt(page));
        const from = (page - 1) * size;
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (zipCode ? "&zipCodes=" + zipCode : "") + (ageMin ? "&ageMin=" + ageMin : "") + (ageMax ? "&ageMax=" + ageMax : "") + (size ? "&size=" + size : "") + (from ? "&from=" + from : "") + (sort ? "&sort=breed:" + sort : "");
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const handleAdvanced = () => {
        fetchBreeds();
        setAdvanced(true);
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
                const from = parseInt(data.next.slice(data.next.search("from=") + 5));
                if(from < data.total) {
                    setNextPage(data.next);
                } else {
                    setNextPage(0);
                }
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
            return;
        }
    };

    
    useEffect(() => {
        if(resultIds.length > 0) {
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
            return;
        }
    };

    const findMatch = async () => {
        try {
            const response = await fetch(props.API + "/dogs/match", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    },
                body: JSON.stringify(savedIds),
            });
            if (response.ok) {
                const data = await response.json();
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
            return;
        }
    };

    //methods for split button menu

    const handleClick = () => {
        if(searchOptions[selectedIndex] === "Browse All Dogs") {
            searchAll();
        }
        else if(searchOptions[selectedIndex] === "Advanced Search") {
            handleAdvanced();
        }
    };

    const handleMenuItemClick = (event, index) => {
        if(index === 0) {
            searchAll();
        }
        else if(index === 1) {
            handleAdvanced();
        }
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        setOpen(false);
    };



    return (
        <div className="App-search">
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button onClick={handleClick}>{searchOptions[selectedIndex]}</Button> 
                <Button size="small" 
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}><ArrowDropDownIcon /></Button>
            </ButtonGroup>
            <Popper
                sx={{
                zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                    transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                        {searchOptions.map((option, index) => (
                            <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                            >
                            {option}
                            </MenuItem>
                        ))}
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>

            {advanced &&
                <div className="App-search-advanced">
                    <Box 
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={(event) => {event.preventDefault(); handleSearch();}}
                        >
                        <Autocomplete
                            id="breeds"
                            labelKey="name"
                            multiple
                            options={allBreeds}
                            filterSelectedOptions
                            limitTags={3}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Choose breeds..." />
                            )}
                            onChange={(event, value) => {
                                setSearchBreeds(value);
                            }}
                            selected = {searchBreeds}
                            />
                        <TextField variant="outlined" type="text" id="zipCode" placeholder="Enter zip code" onChange={(event) => setZipCode(event.target.value)} />
                        <TextField variant="outlined" type="number" id="ageMin" placeholder="Enter age min" onChange={(event) => setAgeMin(event.target.value)} />
                        <TextField variant="outlined" type="number" id="ageMax" placeholder="Enter age max" onChange={(event) => setAgeMax(event.target.value)} />
                        <FormControl>
                        <Select 
                            id="size" 
                            label="Results per page"
                            defaultValue={"25"}
                            onChange={(event) => setSize(event.target.value)}>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                        </Select>
                        <FormHelperText>Results per page</FormHelperText>  
                        </FormControl> 
                        <RadioGroup 
                            row>
                            <FormLabel component="legend">Breed Sort Order:</FormLabel>
                            <FormControlLabel value="asc" control={<Radio />} label="Ascending" onChange={(event) => setSort(event.target.value)} />
                            <FormControlLabel value="desc" control={<Radio />} label="Descending" onChange={(event) => setSort(event.target.value)} />
                        </RadioGroup>
                        <br /><Button variant="contained" type="submit" onClick={handleSearch}>Search</Button>
                    </Box>
                </div>
            }
            {pages.length > 1 && <Pagination count={pages.length} page={currPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton/>}
            {results.length > 0 && <Results results={results} savedIds={savedIds} setSavedIds={setSavedIds} matched={matched} findMatch={findMatch} /> }
            {pages.length > 1 && <Pagination count={pages.length} page={currPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton/>}
        </div>
    );
};

export default Search;