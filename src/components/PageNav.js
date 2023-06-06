const PageNav = (props) => {
    const disablePrev = props.prevPage ? "" : "disabled";
    const disableNext = props.nextPage ? "" : "disabled";

    return (
        <div className="PageNav">
            <button onClick={props.handlePrev} disabled={disablePrev}>Prev</button>
            <select default={props.currentPage} onChange={(event) => props.fetchPage(event.target.value)}>
                {props.pages.map((page) => {
                    return <option key={page} value={page}>{page}</option>
                })}
            </select>
            <button onClick={props.handleNext} disabled={disableNext}>Next</button>
        </div>
    );
};

export default PageNav;