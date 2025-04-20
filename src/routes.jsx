import {
  HomeIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  UserGroupIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { Home, Tables } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import User from "./pages/dashboard/Users";
import Product from "./pages/dashboard/Products";
import Message from "./pages/dashboard/Message";
import Reports from "./pages/dashboard/Reports";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <User />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "products",
        path: "/products",
        element: <Product />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "message",
        path: "/message",
        element: <Message />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "reports",
        path: "/reports",
        element: <Reports />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
