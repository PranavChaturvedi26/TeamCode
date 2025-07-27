import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/editor/:projectId/*" element={<CodeSpace />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
