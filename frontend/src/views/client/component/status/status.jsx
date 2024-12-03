import {useNavigate} from "react-router-dom";

const status = ({id, name, content, image}) => {

    const navigate = useNavigate();

    const style = {
        height: '200px',
        width: '150px',
        border: '1px solid black',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundImage: 'url(' + image + ')',
        color: 'white',
        position: 'fix',
        bottom: '0px',
        marginBottom: '10px',
        overflowX: 'auto',
        borderRadius: '10px',
    }

    const onStatus_Click = () => {
        navigate(`/status/${id}`);
    }

    return (
        <div style={style} onClick={() => onStatus_Click()}>
            {name}
        </div>
    )
}

export default status