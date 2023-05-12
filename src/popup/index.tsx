import Popup from "./popup.tsx";
import { throwExpr } from "../utils.ts";
import { render } from "preact";

const root = document.getElementById("root") ?? throwExpr("Root div not found");
render(<Popup />, root);
