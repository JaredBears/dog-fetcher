import React from "react";
import { useState, useEffect} from "react";
import { Autocomplete, Box, Button, ButtonGroup, ClickAwayListener, Chip, 
        FormControl, FormControlLabel, FormHelperText, FormLabel, Grow, MenuItem, 
        MenuList, Pagination, Paper, Popper, Radio, RadioGroup, Select, TextField, Stack } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Results from "./Results";

const Search = (props) => {
    // variables for search
    const [allBreeds, setAllBreeds] = useState([]);
    const [resultIds, setResultIds] = useState([]);
    const [pages, setPages] = useState([]);
    const [savedIds, setSavedIds] = useState([]);
    const [advanced , setAdvanced] = useState(false);
    const [matched, setMatched] = useState(false);
    const [results, setResults] = useState([]);
    const [currPage, setCurrPage] = useState(1); 
    const [sort, setSort] = useState("asc");
    const [size, setSize] = useState(25);
    const [searchBreeds, setSearchBreeds] = useState([]);
    const [prevZip, setPrevZip] = useState([]);

    const [formValues, setFormValues] = useState({
        zipCode: {
            value: "",
            error: false,
            errorMessage: "Invalid Zip Code",
        },
        ageMin: {
            value: "",
            error: false,
            errorMessage: "Invalid Age or Range",
        },
        ageMax: {
            value: "",
            error: false,
            errorMessage: "Invalid Age or Range",
        },
    });


    // variables for the split button to trigger search types
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const searchOptions = ["Browse All Dogs", "Advanced Search"]

    // methods for search:

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: {
                ...formValues[name],
                value,
            },
        });
    };

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

        const formFields = Object.keys(formValues);
        let formNewValues = { ...formValues };
        let change = false;
        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            const value = formValues[field].value;
            const zipRegex = /^\d{5}$/;
            formNewValues[field].error = false;
            if (field === "zipCode") {
                if(value && !zipRegex.test(value)) {
                    formNewValues[field].error = true;
                    change = true;
                }
            }
            if (field === "ageMin" || field === "ageMax") {
                if (value && (isNaN(value) || value < 0)) {
                    formNewValues[field].error = true;
                    change = true;
                }
            }
        }

        if(formNewValues.ageMin.value && formNewValues.ageMax.value &&
            formNewValues.ageMin.value > formNewValues.ageMax.value) {
            formNewValues.ageMin.error = true;
            formNewValues.ageMax.error = true;
            change = true;
        }

        if(change) {
            setFormValues(formNewValues);
            return;
        }
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (formValues.zipCode.value ? "&zipCodes=" + formValues.zipCode.value : "") + (formValues.ageMin.value ? "&ageMin=" + formValues.ageMin.value : "") + (formValues.ageMax.value ? "&ageMax=" + formValues.ageMax.value : "") + "&size=" + size + "&sort=breed:" + sort;
        fetchResults(props.API + "/dogs/search" + searchParams);
    };

    const searchAll = () => {
        setSavedIds([]);
        setAdvanced(false);
        setCurrPage(1);
        fetchResults(props.API + "/dogs/search?sort=breed:asc");
    };

    const handlePageChange = (event, page) => {
        if (parseInt(page) === parseInt(currPage)) return;
        setCurrPage(parseInt(page));
        const from = (page - 1) * size;
        const searchParams = "?" + (searchBreeds.length > 0 ? "breeds=" + searchBreeds : "") + (formValues.zipCode.value ? "&zipCodes=" + formValues.zipCode.value : "") + (formValues.ageMin.value ? "&ageMin=" + formValues.ageMin.value : "") + (formValues.ageMax.value ? "&ageMax=" + formValues.ageMax.value : "") + (size ? "&size=" + size : "") + (from ? "&from=" + from : "") + (sort ? "&sort=breed:" + sort : "");
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
            setPages([]);
            setResults([]);
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
            <ButtonGroup 
                sx={{
                    margin: '5xp',
                }}
                variant="contained" ref={anchorRef} aria-label="split button">
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
                zIndex: 999,
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
                            width: '75%',
                            maxWidth: 500,
                            margin: 'auto',
                            border: 1,
                            borderColor: '#3B71CA',
                            borderRadius: 1,
                            p: 1,
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={(event) => {event.preventDefault(); handleSearch();}}
                        >
                        <Autocomplete
                            id="breeds"
                            multiple
                            options={allBreeds}
                            filterSelectedOptions
                            limitTags={1}
                            renderInput={(params) => (
                                <TextField {...params} label="Breed(s)" variant="outlined" size="small" placeholder="Choose breed(s)..." />
                            )}
                            onChange={(event, value) => {
                                setSearchBreeds(value);
                            }}
                            sx = {{
                                
                            }}
                            selected = {searchBreeds}
                            />
                        <TextField 
                            variant="outlined"
                            id="zipCode"
                            name="zipCode"
                            label="Zip Code"
                            value={formValues.zipCode.value}
                            error={formValues.zipCode.error}
                            helperText={formValues.zipCode.error && formValues.zipCode.errorMessage}
                            placeholder="Enter zip code"
                            onChange={handleChange} 
                            size="small"/>
                        <br />
                        <TextField 
                            variant="outlined" 
                            type="number" 
                            id="ageMin" 
                            name="ageMin"
                            label="Enter Minimum Age"
                            sx = {{
                                float: 'left',
                            }}
                            value={formValues.ageMin.value}
                            error={formValues.ageMin.error}
                            helperText={formValues.ageMin.error && formValues.ageMin.errorMessage}
                            placeholder="Min Age" 
                            onChange={handleChange} 
                            size="small"/>
                        <TextField 
                            variant="outlined" 
                            type="number" 
                            id="ageMax" 
                            name="ageMax"
                            label="Enter Maximum Age"
                            value={formValues.ageMax.value}
                            error={formValues.ageMax.error}
                            helperText={formValues.ageMax.error && formValues.ageMax.errorMessage}
                            placeholder="Max Age"
                            onChange={handleChange} 
                            size="small"/>
                        <br />
                        <FormControl
                            sx={{
                                float: 'left',
                                width: '50%',
                            }}>
                        <FormHelperText
                        sx={{
                            margin: 'auto',
                        }}>Results per page</FormHelperText>  
                        <Select 
                            id="size" 
                            defaultValue={"25"}
                            sx={{
                                margin: 'auto',
                            }}
                            onChange={(event) => setSize(event.target.value)}
                            size="small">
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                        </Select>
                        </FormControl> 
                        <RadioGroup 
                            row
                            sx={{
                                width: '50%',
                                marginLeft: 'auto',
                            }}>
                            <FormLabel 
                                sx={{
                                    margin: 'auto',
                                }}
                                component="legend">Breed Sort Order:</FormLabel>
                            <FormControlLabel 
                                value="asc" 
                                control={<Radio size="small"/>} 
                                label="Ascending" 
                                onChange={(event) => setSort(event.target.value)}
                                sx={{
                                    marginLeft: '25%',
                                }}/>
                            <FormControlLabel 
                                value="desc" 
                                control={<Radio size="small"/>}
                                label="Descending" 
                                onChange={(event) => setSort(event.target.value)}
                                sx={{
                                    marginLeft: '25%',
                                }}/>
                        </RadioGroup>
                        <Button variant="contained" type="submit" onClick={handleSearch}>Search</Button>
                    </Box>
                </div>
            }
            {pages.length > 1 && <Stack alignItems="center" sx={{margin: '10px'}}><Pagination count={pages.length} page={currPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton/></Stack>}
            {results.length > 0 && <Results results={results} savedIds={savedIds} setSavedIds={setSavedIds} matched={matched} findMatch={findMatch} /> }
            {pages.length > 1 && <Stack alignItems="center" sx={{margin: '10px'}}><Pagination count={pages.length} page={currPage} onChange={handlePageChange} color="primary" showFirstButton showLastButton/></Stack>}
        </div>
    );
};

export default Search;