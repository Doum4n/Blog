import {createBrowserRouter} from 'react-router-dom'
import Home from './home.jsx';
import UserLayout from './userLayout.jsx';
import GuestLayput from './guestLayout.jsx';
import Register from './register.jsx';
import Login from './login.jsx';
import Account from './account.jsx';
import Post from './post/post.jsx';
import PostUpload from './post/postUpload.jsx';
import Create_account from './create_acount.jsx';

import AdminLayout from '../admin/home/home.jsx';
import AdminPost from '../admin/posts/Posts.jsx';
import DashBoard from '../admin/home/home.jsx';
import UserManager from '../admin/users/UserManager.jsx';
import TopicManagement from "../admin/topic/TopicManagement.jsx";
import CommentManagement from "../admin/comments/CommentManagement.jsx";
import PostsByTopic from "./PostsByTopic.jsx";
import RecentPosts from "./RecentPosts.jsx";
import Status from "./Status.jsx";
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
                path: '/post/:id',
                element: <Post/>
            },
            {
                path: '/topic/:id',
                element: <PostsByTopic/>
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
                element: <Account/>
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
        path: 'admin/topics',
        element: <TopicManagement/>
    },
    {
        path: 'admin/comments',
        element: <CommentManagement/>
    },
])

export default router;