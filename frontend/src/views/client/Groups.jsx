import {Container} from "react-bootstrap";
import {useEffect, useState} from "react";
import Group from "./Group.jsx";
import {Divider, TextField} from "@mui/material";

const style = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginTop: "10px",
}

const Groups = () => {

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetch(`http://0.0.0.0/groups/index`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGroups(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    return (
        <Container>
            <div style={{display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", gap: '10px', marginBottom: "10px"}}>
                <h1>Community</h1>
                <TextField label="Seach" variant="outlined"/>
            </div>
            <Divider />
            <h2>Community list</h2>
            <div style={style}>
                {groups.map((group) => (
                    <div>
                        <div key={group.id}>
                            <img src={group.coverPhotoUrl} alt={group.name}
                                 style={{width: '100%', borderRadius: '10%'}}/>
                            {group.name}
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default Groups;