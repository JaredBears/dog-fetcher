import { Card, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import Image from "./Image";
const Dog = (props) => {

    return (
        <div style={{display: 'flex', justifyContent: 'center', margin: 'auto'}}><Card
            sx = {{
                padding: '1rem',
                margin: '1rem',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '50%',
                minWidth: '300px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
            }}>
            <div className="dog-img"><Image src={props.dog.img} alt={props.dog.name} zoom={true} /></div>
            <div>
                Name: {props.dog.name}
                <br />Age: {props.dog.age}
                <br />Zip Code: {props.dog.zip_code}
                <br />Breed: {props.dog.breed}
            </div>
            {props.matched ? "" : props.savedIds.includes(props.dog.id) ? 
                <IconButton className="AddRemove" onClick={() => props.handleRemove(props.dog.id)}><FavoriteIcon color="error" /></IconButton> : 
                <IconButton className="AddRemove" onClick={() => props.handleSave(props.dog.id)}><FavoriteBorderOutlinedIcon /></IconButton>}
        </Card></div>
    );
};

export default Dog;