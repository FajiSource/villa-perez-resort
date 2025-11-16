import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/home/Landing";
import GoogleCallback from "../pages/GoogleCallback";
import AuthLayout from "../layout/AuthLayout";
import GoogleSuccess from "../pages/GoogleSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import BookingPage from "../pages/BookingPage";
import ViewVillas from "../pages/ViewVillas";
import Notifications from "../pages/Notifications";
import ManageAccount from "../pages/ManageAccount";


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
    },
    {
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: Landing,
            },
            {
                path: "dashboard",
                Component: Dashboard,
            },
            {
                path: "book",
                Component: BookingPage,
            },
            {
                path: "bookings",
                Component: Bookings,
            },
            {
                path: "villas",
                Component: ViewVillas,
            },
            {
                path: "notifications",
                Component: Notifications,
            },
            {
                path: "account",
                Component: ManageAccount,
            },
        ],
    },
])

export default router