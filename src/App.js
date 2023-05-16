import "./App.css";
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
    <div className="App">
      <h1>Bienvenido al dashboard de Trello</h1>
      <InsertJson onSubmit={onSubmit}></InsertJson>
      <Dashboard data={data}></Dashboard>
    </div>
  );
}

export default App;
