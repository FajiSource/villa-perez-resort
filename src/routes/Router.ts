import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/home/Landing";
import GoogleCallback from "../pages/GoogleCallback";
import AuthLayout from "../layout/AuthLayout";
import GoogleSuccess from "../pages/GoogleSuccess";


const router = createBrowserRouter([
    {
        path: "/",
        Component: Landing,
    },
    {
        path:"auth",
        Component: AuthLayout
    },
    {
        path:"auth/google",
        Component: GoogleCallback
    },
    {
        path: "auth/google/success",
        Component: GoogleSuccess
    }
])

export default router