import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div>
                guest
            </div>
            <Outlet/>
        </>
    );
};

export default Layout;
