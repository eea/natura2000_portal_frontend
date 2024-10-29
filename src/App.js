import './App.css';
import './lib/semantic/semantic.css';
import './scss/styles.scss';

import { Route, Routes, HashRouter } from 'react-router-dom';
import Home from "./pages/Home";
import Sites from "./pages/search/Sites";
import Habitats from "./pages/search/Habitats";
import Species from "./pages/search/Species";
import Tools from "./pages/Tools";
import Reports from "./pages/Reports";
import Downloads from "./pages/Downloads";
import About from "./pages/About";
import SDF from "./pages/SDF";

const App = () => {
  return (
    <>
      <HashRouter>
       <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/search/sites' element={<Sites/>} />
         <Route path='/search/habitats' element={<Habitats/>} />
         <Route path='/search/species' element={<Species/>} />
         <Route path='/tools' element={<Tools/>} />
         <Route path='/reports' element={<Reports/>} />
         <Route path='/downloads' element={<Downloads/>} />
         <Route path='/about' element={<About/>} />
         <Route path='/sdf' element={<SDF/>} />
       </Routes>
       </HashRouter>
    </>
  );
}

export default App;
