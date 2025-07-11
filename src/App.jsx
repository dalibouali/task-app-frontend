import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Details from "./pages/Details";


import './App.css'

function App() {


  return (
      <BrowserRouter>
      <div className="">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </div>
    </BrowserRouter>

  )
}

export default App
