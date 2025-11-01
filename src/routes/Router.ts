import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/home/Landing";


const router = createBrowserRouter([
    {
        path: "/",
        Component: Landing
    }
])

export default router