import "./App.scss";
import React from "react";
import InsertJson from "./components/InsertJson/InsertJson";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [data, setData] = React.useState(null);
  const onSubmit = (infoParsed) => {
    setData(infoParsed);
    console.log(infoParsed);
  };

  return (
    <div className="app">
      <h1 className="app__title">Bienvenido al dashboard de Trello</h1>
      <InsertJson onSubmit={onSubmit}></InsertJson>
      <Dashboard data={data}></Dashboard>
    </div>
  );
}

export default App;
