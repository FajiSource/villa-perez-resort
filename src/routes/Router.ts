import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/home/Landing";
import GoogleCallback from "../pages/GoogleCallback";
import AuthLayout from "../layout/AuthLayout";
import GoogleSuccess from "../pages/GoogleSuccess";
import { ProtectedRoute } from "../components/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import BookingPage from "../pages/BookingPage";
import ViewVillas from "../pages/ViewVillas";
import Notifications from "../pages/Notifications";
import ManageAccount from "../pages/ManageAccount";
import ReadMore from "../pages/ReadMore";


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
        path: "read-more",
        Component: ReadMore
    },
    {
        Component: ProtectedRoute,
        children: [
            {
                path: "book",
                Component: BookingPage,
            },
            {
                Component: DashboardLayout,
                children: [
                    {
                        path: "dashboard",
                        Component: Dashboard,
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
        ],
    },
])

export default router