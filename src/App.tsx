import "./App.css";
import Table from "./components/Table";
import { records } from "./data/api";

function App() {
  return (
    <div className="App">
      <Table data={records} />
    </div>
  );
}

export default App;
