
const Dog = (props) => {

    return (
        <div className="dog">
            <div class="grid">
                {props.matched ? "" : props.savedIds.includes(props.dog.id) ? 
                    <button className="AddRemove" onClick={() => props.handleRemove(props.dog.id)}>Remove</button> : 
                    <button className="AddRemove" onClick={() => props.handleSave(props.dog.id)}>Save</button>}
                <div className="dog-img"><img src={props.dog.img} alt={props.dog.name} /></div>
                <div className="dog-info">
                    Name: {props.dog.name}
                    <br />Age: {props.dog.age}
                    <br />Zip Code: {props.dog.zip_code}
                    <br />Breed: {props.dog.breed}
                </div>
            </div>
        </div>
    );
};

export default Dog;