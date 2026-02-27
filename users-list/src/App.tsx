import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import UsersList from "./UsersList";


const App = () => (
  <div style={{ padding: 20 }}>
    <h2>Users List (Remote)</h2>
    <p>Si ves esto, el remote <b>users-list</b> está funcionando ✅</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);