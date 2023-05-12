import Popup from "./popup.tsx";
import { throwExpr } from "../utils.ts";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root") ?? throwExpr("Root div not found");
createRoot(root).render(<Popup />);
