import { Card, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import Image from "./Image";
const Dog = (props) => {

    return (
        <Card className="dog">
            <div className="dog-img"><Image src={props.dog.img} alt={props.dog.name} border={true} zoom={true} /></div>
            <div className="dog-info">
                Name: {props.dog.name}
                <br />Age: {props.dog.age}
                <br />Zip Code: {props.dog.zip_code}
                <br />Breed: {props.dog.breed}
            </div>
            {props.matched ? "" : props.savedIds.includes(props.dog.id) ? 
                <IconButton className="AddRemove" onClick={() => props.handleRemove(props.dog.id)}><FavoriteIcon color="error" /></IconButton> : 
                <IconButton className="AddRemove" onClick={() => props.handleSave(props.dog.id)}><FavoriteBorderOutlinedIcon /></IconButton>}
        </Card>
    );
};

export default Dog;