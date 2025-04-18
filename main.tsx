import React from "react";
import ReactDOM from "react-dom/client";
import UsersTable from "./UsersTable";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UsersTable />
  </React.StrictMode>
);
