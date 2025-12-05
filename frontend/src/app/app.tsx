import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import '../app/pages/css/App.css'
import Agenda from './pages/Agenda';

export function App() {
  return (
    <div className="app-container">
      {/* Barra de navegación */}
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/Agenda" className="nav-link">Agenda</Link>

      </nav>

      {/* Definición de Rutas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/" element={<h1 className="home-title">Bienvenido a la Veterinaria 🐾</h1>} />
      </Routes>
    </div>
  );
}

export default App;