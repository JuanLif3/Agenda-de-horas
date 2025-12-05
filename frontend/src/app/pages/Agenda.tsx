import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../pages/css/Agenda.css';

export default function Agenda() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Estados para el formulario
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const navigate = useNavigate();

  // 1. Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citasRes, mascotasRes, serviciosRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/pets'),     // Para llenar el select de mascotas
          api.get('/services')  // Para llenar el select de servicios
        ]);
        
        setAppointments(citasRes.data);
        setPets(mascotasRes.data);
        setServices(serviciosRes.data);
      } catch (error) {
        alert('Error cargando datos. ¿Estás logueado?');
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  // 2. Manejar nueva reserva
  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', {
        date: date, // Debe ser formato ISO completo, ej: "2025-12-10T10:00:00"
        petId: selectedPet,
        serviceId: selectedService,
        notes
      });
      alert('¡Hora reservada con éxito!');
      window.location.reload(); // Recargar para ver la nueva cita
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al reservar');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>📅 Mi Agenda Veterinaria</h1>
        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </div>

      {/* Formulario de Reserva */}
      <div className="booking-section">
        <h3>Reservar Nueva Hora</h3>
        <form onSubmit={handleReservar} className="booking-form">
          
          <div className="form-group">
            <label>Mascota:</label>
            <select className="form-control" value={selectedPet} onChange={e => setSelectedPet(e.target.value)} required>
              <option value="">Seleccionar...</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Servicio:</label>
            <select className="form-control" value={selectedService} onChange={e => setSelectedService(e.target.value)} required>
              <option value="">Seleccionar...</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name} (${s.price})</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha y Hora:</label>
            {/* Input datetime-local facilita elegir fecha/hora */}
            <input 
              type="datetime-local" 
              className="form-control"
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group full-width">
            <label>Notas:</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Ej: Es primera vez..." 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary full-width">Confirmar Reserva</button>
        </form>
      </div>

      {/* Listado de Citas */}
      <h3>Mis Reservas ({appointments.length})</h3>
      <div className="appointments-list">
        {appointments.map(appt => (
          <div key={appt.id} className="appointment-card">
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <strong>{new Date(appt.date).toLocaleString()}</strong>
                <span className="badge">{appt.status}</span>
            </div>
            <p>🐾 <strong>Mascota:</strong> {appt.pet?.name}</p>
            <p>💉 <strong>Servicio:</strong> {appt.service?.name}</p>
            {appt.notes && <p>📝 <em>{appt.notes}</em></p>}
          </div>
        ))}
        {appointments.length === 0 && <p>No tienes reservas futuras.</p>}
      </div>
    </div>
  );
}