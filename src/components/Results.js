import { Button } from "@mui/material";
import Dog from './Dog';

const Results = (props) => {
// the results should convert the results array into a list of Dog components
// the results should then be displayed in a grid
// Each Dog component should have a button to save the dog to the user's favorites
// or if the dog is already saved, a button to remove the dog from the user's favorites

    const handleSave = (id) => {
        props.setSavedIds([...props.savedIds, id]);
    };

    const handleRemove = (id) => {
        props.setSavedIds(props.savedIds.filter((savedId) => savedId !== id));
    };

    return (
        <div className="Results">
            <p>Click on a Photo to see Full Size Image</p>
            {props.matched ? <p>Here is your matching companion!</p> : 
            props.savedIds.length > 0 && <Button variant="contained" onClick={props.findMatch}>Find Match</Button>}
            {props.results.map((dog) => {
                return <Dog key={dog.id} dog={dog} handleSave={handleSave} handleRemove={handleRemove} savedIds={props.savedIds} matched={props.matched} />
            })} 
        </div>
    );
};

export default Results;