import Popup from "./popup.tsx";
import { throwExpr } from "../utils.ts";
import { createRoot } from "react-dom/client";
import React from "react";

const root = document.getElementById("root") ?? throwExpr("Root div not found");
createRoot(root).render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
