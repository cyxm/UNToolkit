import { createRoot } from "react-dom/client";
import ButtonUsage from "./widget";

const domNode = document.getElementById('navigation')
const root = createRoot(domNode);
root.render(<ButtonUsage />)