const Comment = ({name_post_owner, title, comment}) => {
    return (
        <div style={{position: 'relative'}}>
            <h2>{name_post_owner}</h2>
            <h3>{title}</h3>
            <p>{comment}</p>
        </div>
    )
}

export default Comment