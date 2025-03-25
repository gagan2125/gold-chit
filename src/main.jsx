import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Test from "./pages/Test.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <App />
      {/* <Test/> */}
    </BrowserRouter>
  </>
);
