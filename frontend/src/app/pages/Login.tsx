import React, { useState } from "react";
import api from '../utils/api';
import { useNavigate } from "react-router-dom";
import '../pages/css/Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Peticion del backend
            const response = await api.post('auth/login', {email, password});

            // Guardar el token en el navegador
            localStorage.setItem('token', response.data.access_token);

            alert('Login exitoso');
            navigate('/agenda');

            // Aqui redirigimos a la agenda luego 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
        setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-container">
    <h2 className="login-title">Iniciar sesion</h2>
    <form onSubmit={handleLogin} className="login-form">
        <input 
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input 
            className="login-input"
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        <button type="submit" className="login-button">Ingresar</button>
    </form>
    {error && <p className="login-error">{error}</p>}
</div>
    )
}
