import {createBrowserRouter} from 'react-router-dom'
import Home from './home/home.jsx';
import UserLayout from './layout/userLayout.jsx';
import GuestLayput from './guestLayout.jsx';
import Register from './register.jsx';
import Login from './login.jsx';
import MyAccount from './MyAccount.jsx';
import Post from './post/post.jsx';
import PostUpload from './post/postUpload.jsx';
import Create_account from './create_acount.jsx';

import AdminLayout from '../admin/home/home.jsx';
import AdminPost from '../admin/posts/Posts.jsx';
import DashBoard from '../admin/home/home.jsx';
import UserManager from '../admin/users/UserManager.jsx';
import ForumManagement from "../admin/forum/ForumManagement.jsx";
import CommentManagement from "../admin/comments/CommentManagement.jsx";
import PostsByTopic from "./PostsByTopic.jsx";
import RecentPosts from "./RecentPosts.jsx";
import Status from "./Status.jsx";
import OtherAccount from "./OtherAccount.jsx";
import Group from "./Group.jsx";
import Groups from "./Groups.jsx";
import Topic from "./component/Topic.jsx";
import TopicManager from "../admin/topics/TopicManager.jsx";
import GroupManager from "../admin/group/GroupManager.jsx";
import HashTagManager from "../admin/hashtag/HashTagManager.jsx";
import AdminLogin from "../admin/login.jsx";
import EditPost from "./post/editPost.jsx";
import EditTopic from "./service/EditTopic.jsx";
const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout/>,
        children: [
            {
                path: '/home',
                element: <Home/>,
            },
            {
                path: 'post/upload',
                element: <PostUpload/>
            },
            {
                path: 'post/update/:id',
                element: <EditPost/>
            },
            {
                path: 'post/upload/group/:id',
                element: <PostUpload/>
            },
            {
                path: '/topic/:id',
                element: <Topic/>,
            },
            {
                path: '/topic/edit/:id',
                element: <EditTopic/>
            },
            {
                path: '/post/:id',
                element: <Post/>
            },
            {
                path: '/forum/:id',
                element: <PostsByTopic/>
            },
            {
                path: '/user/:uuid',
                element: <OtherAccount/>
            },
            {
                path: '/group/:id',
                element: <Group/>
            },
            {
                path: '/groups',
                element: <Groups/>
            },
            {
                path: '/posts/recent',
                element: <RecentPosts/>
            },
            {
                path: '/status/:id',
                element: <Status/>
            },
            {
                path: 'account',
                element: <MyAccount/>
            },
        ],
    },

    {
        path: '/',
        element: <GuestLayput/>,
        children: [
            {
                path: '/login',
                element: <Login/>,
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/create',
                element: <Create_account/>
            }
        ],
    },
    {
        path: '/admin',
        element: <DashBoard/>,
        // children: [
        //     {
                // path: '/posts',
                // element: <AdminPost/>
        //     }
        // ]
    },
    {
        path: 'admin/posts',
        element: <AdminPost/>
    },
    {
        path: 'admin/dashboard',
        element: <DashBoard/>
    },
    {
        path: 'admin/users',
        element: <UserManager/>
    },
    ///admin/categories
    {
        path: 'admin/forums',
        element: <ForumManagement/>
    },
    {
        path: 'admin/topics',
        element: <TopicManager/>
    },
    {
        path: 'admin/comments',
        element: <CommentManagement/>
    },
    {
        path: 'admin/groups',
        element: <GroupManager/>
    },
    {
        path: 'admin/hashtags',
        element: <HashTagManager/>
    },
    {
        path: '/admin/login',
        element: <AdminLogin/>
    }
])

export default router;