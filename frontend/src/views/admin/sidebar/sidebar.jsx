import {Link} from 'react-router-dom'
import './sidebar.css'

const SideBar = () => {
    return (
        <div className="sidebar">
            <div className="top">logo</div>
            <hr/>
            <div className="center">
                <ul>
                    <Link to="/admin/dashboard" style={{textDecoration: "none"}}>
                        <li>
                            <span>
                                DashBoard
                            </span>
                        </li>
                    </Link>
                    <p><b>Data</b></p>
                    <Link to="/admin/hashtags" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Hashtag
                        </span>
                        </li>
                    </Link>
                    <li>
                        <span>
                            Faultfinding
                        </span>
                    </li>
                    <Link to="/admin/posts" style={{textDecoration: "none"}}>
                        <li>
                            <span>
                                Posts
                            </span>
                        </li>
                    </Link>
                    <Link to="/admin/forums" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Forums
                        </span>
                        </li>
                    </Link>
                    <Link to="/admin/topics" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Topics
                        </span>
                        </li>
                    </Link>
                    <Link to="/admin/groups" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Community
                        </span>
                        </li>
                    </Link>
                    <p><b>Users and interactions</b></p>
                    <Link to="/admin/users" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Users account
                        </span>
                        </li>
                    </Link>
                    <Link to="/admin/comments" style={{textDecoration: "none"}}>
                        <li>
                        <span>
                            Comments
                        </span>
                        </li>
                    </Link>
                    <li>
                        <span>
                            Faultfinding
                        </span>
                    </li>
                    <p><b>Notifications and warnings</b></p>
                    <li>
                        <span>
                            Notifications
                        </span>
                    </li>
                    <li>
                        <span>
                            Warnings
                        </span>
                    </li>
                    <li>
                        <span>
                            Announce
                        </span>
                    </li>
                    <li>
                        <span>
                            <b>Statistics and reporting</b>
                        </span>
                    </li>
                    <li>
                        <span>
                            <b>System settings</b>
                        </span>
                    </li>
                    <li>
                        <span>
                            <b>Support and feedback</b>
                        </span>
                    </li>
                </ul>
            </div>
            <div className="botton"></div>
        </div>
    )
}

export default SideBar