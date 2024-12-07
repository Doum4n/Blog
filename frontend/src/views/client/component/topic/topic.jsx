import Button from "@mui/material/Button";
import {Divider} from "@mui/material";
import {useNavigate} from "react-router-dom";
import topic from "../Topic.jsx";

const Topic = ({id, title, content, name, username, created_at}) => {
    const navigate = useNavigate();

    return (
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'wheat', marginTop: '10px', marginBottom: '10px', padding: '10px', gap: '10px'}}>
            <div style={{alignItems: 'start'}}>
                <h3><b>{username}</b></h3>
                <p>{new Date(created_at).toLocaleString()}</p>
                <div onClick={() => navigate(`/topic/${id}`)}>
                    {title}
                </div>
                <br/>
                {content}
            </div>
            <Divider/>
            <div style={{display: 'flex', justifyContent: 'end', alignItems: 'end'}}>
                <Button variant="contained">Reply</Button>
            </div>
        </div>
    )
}

export default Topic;