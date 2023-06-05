
const Dog = (props) => {

    return (
        <div className="Dog">
            {props.matched ? "" : props.savedIds.includes(props.dog.id) ? 
                <button className="AddRemove" onClick={() => props.handleRemove(props.dog.id)}>Remove</button> : 
                <button className="AddRemove" onClick={() => props.handleSave(props.dog.id)}>Save</button>}
            <div className="Dog-img"><img src={props.dog.img} alt={props.dog.name} /></div>
            <div className="Dog-name">{props.dog.name}</div>
            <div className="Dog-age">{props.dog.age}</div>
            <div className="Dog-zip">{props.dog.zip_code}</div>
            <div className="Dog-breed">{props.dog.breed}</div>
        </div>
    );
};

export default Dog;