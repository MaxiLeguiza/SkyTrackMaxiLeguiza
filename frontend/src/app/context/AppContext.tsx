import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppContextType, User, Flight, Plane, CrewMember } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

// Datos cargados únicamente desde el backend (sin mocks ni localStorage)

const testUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin' },
  { id: '2', username: 'operador', role: 'operador' },
];

// ====================
// AppProvider
// ====================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

  const devAuthHeaders = () => {
    const token = localStorage.getItem('skytrack_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Mapeo de estados
  const statusToBackend = (s: string) =>
    ({ programado: 'PROGRAMADO', embarcando: 'EMBARCADO', 'en vuelo': 'EN_VUELO', aterrizado: 'ATERRIZADO', cancelado: 'CANCELADO' } as any)[s];

  const statusFromBackend = (s: string) =>
    ({ PROGRAMADO: 'programado', EMBARCADO: 'embarcando', EN_VUELO: 'en vuelo', ATERRIZADO: 'aterrizado', CANCELADO: 'cancelado' } as any)[s] ?? 'programado';

  // ====================
  // Carga inicial de datos
  // ====================
  useEffect(() => {
    const loadAll = async () => {
      try {
        // Si no hay token pero hay credenciales guardadas, intentar login automático
        const storedToken = localStorage.getItem('skytrack_token');
        if (!storedToken) {
          const storedUser = localStorage.getItem('skytrack_username');
          const storedPass = localStorage.getItem('skytrack_password');
          if (storedUser && storedPass) {
            await login(storedUser, storedPass).catch(() => {});
          }
        }

        const headers = devAuthHeaders();
        const [fRes, pRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/flights`, { headers }),
          fetch(`${API_BASE}/aviones`, { headers }),
          fetch(`${API_BASE}/tripulantes`, { headers }),
        ]);
        if (!fRes.ok) throw new Error('flights failed');

        const flightsFromApi = await fRes.json();
        const mappedFlights = flightsFromApi.map((f: any) => ({
          id: f.id,
          numeroVuelo: f.numeroVuelo ?? `ST-${f.id.slice(-4)}`,
          origen: f.origen,
          destino: f.destino,
          fechaSalida: f.fechaSalida ?? new Date(f.createdAt).toISOString().slice(0, 10),
          horaSalida: f.horaSalida ?? '00:00',
          fechaLlegada: f.fechaLlegada ?? f.fechaSalida ?? new Date(f.updatedAt).toISOString().slice(0, 10),
          horaLlegada: f.horaLlegada ?? '00:00',
          estado: statusFromBackend(f.estado),
          avionId: f.avionId ?? null,
          tripulacionIds: (f.tripulacionAsignada || []).map((t: any) => t.tripulante?.id).filter(Boolean),
          deleted: !!f.deleted,
        }));
        setFlights(mappedFlights);

        const planesApi = await pRes.json();
        setPlanes(planesApi);

        const crewApi = await cRes.json();
        setCrew(crewApi);
      } catch (err) {
        console.warn('API load failed — datos no cargados desde backend', err);
        // No usar mocks ni localStorage: dejar listas vacías para prevenir datos inconsistentes
        setFlights([]);
        setPlanes([]);
        setCrew([]);
      }
    };
    loadAll();
  }, []);

  // ====================
  // LOGIN / LOGOUT
  // ====================
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      if (!res.ok) return false;
      const body = await res.json();
      const u = body.user;
      const mappedUser = { id: u.id, username: u.nombreusuario || u.email, role: (u.role || 'operador').toLowerCase() };
      setUser(mappedUser);
      localStorage.setItem('skytrack_user', JSON.stringify(mappedUser));
      localStorage.setItem('skytrack_username', username);
      localStorage.setItem('skytrack_password', password);
      if (body.access_token) localStorage.setItem('skytrack_token', body.access_token);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    ['skytrack_user', 'skytrack_username', 'skytrack_password', 'skytrack_token'].forEach(k => localStorage.removeItem(k));
  };

  // ====================
  // CRUD VUELOS
  // ====================
  const addFlight = (flight: Omit<Flight, 'id' | 'deleted'>) => {
    const optimistic: Flight = { ...flight, id: Date.now().toString(), deleted: false };
    setFlights((p) => [...p, optimistic]);

    (async () => {
      try {
        // Enviar solo los campos permitidos por CreateVuelosDto (no enviar tripulacionIds aquí)
        const payload: any = { ...flight, estado: statusToBackend(flight.estado) };
        delete payload.tripulacionIds;

        const res = await fetch(`${API_BASE}/flights`, { method: 'POST', headers: devAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('create failed');
        const created = await res.json();

        // Si el vuelo original incluía tripulacionIds, persistir las asignaciones usando el endpoint dedicado
        if (flight.tripulacionIds && flight.tripulacionIds.length) {
          await Promise.all(
            flight.tripulacionIds.map((crewId) =>
              fetch(`${API_BASE}/vuelos/${created.id}/tripulantes/${crewId}`, { method: 'POST', headers: devAuthHeaders() })
            )
          );
          // actualizar disponibilidad local del crew
          setCrew((prev) => prev.map((c) => (flight.tripulacionIds!.includes(c.id) ? { ...c, disponible: false } : c)));
        }

        const mapped = {
          ...created,
          estado: statusFromBackend(created.estado),
          deleted: !!created.deleted,
          tripulacionIds: flight.tripulacionIds ?? [],
        };
        setFlights((p) => p.map((f) => (f.id === optimistic.id ? mapped : f)));
      } catch (err) {
        console.error('Error creando vuelo:', err);
      }
    })();
  }; 

  const updateFlight = (id: string, updatedFlight: Partial<Flight>) => {
    // Actualización optimista local
    setFlights((p) => p.map((f) => (f.id === id ? { ...f, ...updatedFlight } : f)));

    (async () => {
      try {
        const prev = flights.find((f) => f.id === id) || { tripulacionIds: [] };

        // Manejar asignaciones/remociones de tripulación si vienen en el payload
        if (updatedFlight.tripulacionIds) {
          const newIds = updatedFlight.tripulacionIds || [];
          const oldIds = prev.tripulacionIds || [];

          const toAdd = newIds.filter((x) => !oldIds.includes(x));
          const toRemove = oldIds.filter((x) => !newIds.includes(x));

          // Asignar nuevos
          await Promise.all(
            toAdd.map((crewId) =>
              fetch(`${API_BASE}/vuelos/${id}/tripulantes/${crewId}`, { method: 'POST', headers: devAuthHeaders() }).then((r) => {
                if (!r.ok) console.warn('assign crew failed', crewId, r.status);
              })
            )
          );

          // Quitar removidos
          await Promise.all(
            toRemove.map((crewId) =>
              fetch(`${API_BASE}/vuelos/${id}/tripulantes/${crewId}`, { method: 'DELETE', headers: devAuthHeaders() }).then((r) => {
                if (!r.ok) console.warn('remove crew failed', crewId, r.status);
              })
            )
          );

          // Actualizar disponibilidad local del crew
          setCrew((prevCrew) =>
            prevCrew.map((c) => {
              if (toAdd.includes(c.id)) return { ...c, disponible: false };
              if (toRemove.includes(c.id)) return { ...c, disponible: true };
              return c;
            }),
          );
        }

        // Preparar payload para el endpoint /flights (no incluir tripulacionIds)
        const payload: any = { ...updatedFlight };
        if (payload.estado) payload.estado = statusToBackend(payload.estado);
        delete payload.tripulacionIds;

        const res = await fetch(`${API_BASE}/flights/${id}`, { method: 'PUT', headers: devAuthHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('update failed');
      } catch (err) {
        console.error('Error actualizando vuelo:', err);
      }
    })();
  };

  const deleteFlight = (id: string) => {
    setFlights((p) => p.map((f) => (f.id === id ? { ...f, deleted: true } : f)));
    (async () => {
      try { await fetch(`${API_BASE}/flights/${id}`, { method: 'DELETE', headers: devAuthHeaders() }); } 
      catch (err) { console.error('Error eliminando vuelo:', err); }
    })();
  };

  // ====================
  // CRUD AVIONES
  // ====================
  const addPlane = (plane: Omit<Plane, 'id'>) => {
    const optimistic: Plane = { ...plane, id: Date.now().toString() };
    setPlanes((prev) => [...prev, optimistic]);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/aviones`, { method: 'POST', headers: devAuthHeaders(), body: JSON.stringify(plane) });
        if (!res.ok) throw new Error('create failed');
        const created: Plane = await res.json();
        setPlanes((prev) => prev.map(p => p.id === optimistic.id ? created : p));
      } catch (err) { console.error('Error creando avión:', err); }
    })();
  };

  const updatePlane = (id: string, updatedPlane: Partial<Plane>) => {
    setPlanes((prev) => prev.map(p => p.id === id ? { ...p, ...updatedPlane } : p));

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/aviones/${id}`, { method: 'PUT', headers: devAuthHeaders(), body: JSON.stringify(updatedPlane) });
        if (!res.ok) throw new Error('update failed');
        const updated: Plane = await res.json();
        setPlanes((prev) => prev.map(p => p.id === id ? updated : p));
      } catch (err) { console.error('Error actualizando avión:', err); }
    })();
  };

  // ====================
  // CRUD TRIPULANTES
  // ====================
  const addCrewMember = (member: Omit<CrewMember, 'id'>) => {
    const optimistic: CrewMember = { ...member, id: Date.now().toString() };
    setCrew((prev) => [...prev, optimistic]);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tripulantes`, { method: 'POST', headers: devAuthHeaders(), body: JSON.stringify(member) });
        if (!res.ok) throw new Error('create failed');
        const created: CrewMember = await res.json();
        setCrew((prev) => prev.map(m => m.id === optimistic.id ? created : m));
      } catch (err) { console.error('Error creando tripulante:', err); }
    })();
  };

  const updateCrewMember = (id: string, updatedMember: Partial<CrewMember>) => {
    setCrew((prev) => prev.map(m => m.id === id ? { ...m, ...updatedMember } : m));

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tripulantes/${id}`, { method: 'PUT', headers: devAuthHeaders(), body: JSON.stringify(updatedMember) });
        if (!res.ok) throw new Error('update failed');
        const updated: CrewMember = await res.json();
        setCrew((prev) => prev.map(m => m.id === id ? updated : m));
      } catch (err) { console.error('Error actualizando tripulante:', err); }
    })();
  };

  // ====================
  // Context Value
  // ====================
  const value: AppContextType = {
    user,
    flights,
    planes,
    crew,
    login,
    logout,
    addFlight,
    updateFlight,
    deleteFlight,
    addPlane,
    updatePlane,
    addCrewMember,
    updateCrewMember,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ====================
// Hook personalizado
// ====================
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
