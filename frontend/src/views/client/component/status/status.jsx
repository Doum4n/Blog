import {useNavigate} from "react-router-dom";

const status = ({id, name, content, image}) => {

    const navigate = useNavigate();

    const style = {
        height: '200px',
        width: '150px',
        flexShrink: 0,
        border: '1px solid black',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundImage: 'url(' + image + ')',
        color: 'white',
        position: 'fix',
        bottom: '0px',
        marginBottom: '10px',
        borderRadius: '10px',
        boxShadow: 'inset 0px 20px 15px rgba(0, 0, 0, 0.2)'
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