import Nav from "./components/Nav.jsx";
import Dashboard from "./components/Dashboard.jsx";
import History from "./components/History.jsx";
import ProjectView from "./components/ProjectView.jsx";
import { Routes, Route } from "react-router-dom";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Nav />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History/>}/>
        {/* ProjectView is now rendered as a modal within History, so remove its direct route */}
      </Routes>
    </div>
  );
}

export default App;
