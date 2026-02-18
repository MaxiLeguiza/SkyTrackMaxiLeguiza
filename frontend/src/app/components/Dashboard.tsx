import React, { useMemo } from 'react';
import { Plane, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Flight, FlightStatus } from '../types';

export const Dashboard: React.FC = () => {
  const { flights, planes, updateFlight } = useApp();

  const activeFlights = useMemo(
    () => flights.filter((f) => !f.deleted),
    [flights]
  );

  const stats = useMemo(() => {
    const statusCount = {
      programado: 0,
      embarcando: 0,
      'en vuelo': 0,
      aterrizado: 0,
      cancelado: 0,
    };

    activeFlights.forEach((f) => {
      statusCount[f.estado]++;
    });

    return {
      total: activeFlights.length,
      enVuelo: statusCount['en vuelo'],
      programados: statusCount['programado'],
      completados: statusCount['aterrizado'],
      planesDisponibles: planes.filter((p) => p.estado === 'disponible').length,
    };
  }, [activeFlights, planes]);

  const flightsInProgress = useMemo(
    () => activeFlights.filter((f) => f.estado === 'en vuelo' || f.estado === 'embarcando'),
    [activeFlights]
  );

  const nextFlight = useMemo(() => {
    const programados = activeFlights.filter((f) => f.estado === 'programado');
    if (programados.length === 0) return null;

    return programados.sort((a, b) => {
      const dateA = new Date(`${a.fechaSalida}T${a.horaSalida}`);
      const dateB = new Date(`${b.fechaSalida}T${b.horaSalida}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  }, [activeFlights]);

  const getStatusBadge = (status: FlightStatus) => {
    const styles = {
      programado: 'bg-gray-100 text-gray-800',
      embarcando: 'bg-yellow-100 text-yellow-800',
      'en vuelo': 'bg-blue-100 text-blue-800',
      aterrizado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const handleStatusChange = (flightId: string, newStatus: FlightStatus) => {
    updateFlight(flightId, { estado: newStatus });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <p className="text-gray-600">Vista general de las operaciones de SkyTrack Airlines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vuelos</CardTitle>
            <Plane className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-500 mt-1">Activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Vuelo</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.enVuelo}</div>
            <p className="text-sm text-gray-500 mt-1">Actualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Programados</CardTitle>
            <Clock className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.programados}</div>
            <p className="text-sm text-gray-500 mt-1">Próximos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aviones Disponibles</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.planesDisponibles}</div>
            <p className="text-sm text-gray-500 mt-1">Listos</p>
          </CardContent>
        </Card>
      </div>

      {/* Flight Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vuelos en Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Vuelos en Curso</CardTitle>
            <CardDescription>Vuelos actualmente en operación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flightsInProgress.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay vuelos en curso</p>
            ) : (
              flightsInProgress.map((flight) => (
                <div
                  key={flight.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-lg">{flight.numeroVuelo}</p>
                      <p className="text-sm text-gray-600">
                        {flight.origen} → {flight.destino}
                      </p>
                    </div>
                    {getStatusBadge(flight.estado)}
                  </div>
                  <div className="flex gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Salida</p>
                      <p className="font-medium">{flight.horaSalida}</p>
                    </div>
                    <div className="flex-1 border-l border-gray-200 pl-2">
                      <p className="text-gray-500">Llegada</p>
                      <p className="font-medium">{flight.horaLlegada}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {flight.estado === 'embarcando' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(flight.id, 'en vuelo')}
                        className="flex-1"
                      >
                        Iniciar Vuelo
                      </Button>
                    )}
                    {flight.estado === 'en vuelo' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(flight.id, 'aterrizado')}
                        className="flex-1"
                      >
                        Aterrizar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Próximo Vuelo */}
        <Card>
          <CardHeader>
            <CardTitle>Próximo Despegue</CardTitle>
            <CardDescription>Siguiente vuelo programado</CardDescription>
          </CardHeader>
          <CardContent>
            {nextFlight ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-2xl">{nextFlight.numeroVuelo}</p>
                      <p className="text-gray-700 mt-1">
                        {nextFlight.origen} → {nextFlight.destino}
                      </p>
                    </div>
                    {getStatusBadge(nextFlight.estado)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div>
                      <p className="text-sm text-gray-600">Salida programada</p>
                      <p className="font-bold text-lg">
                        {new Date(nextFlight.fechaSalida).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-gray-700">{nextFlight.horaSalida}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Llegada estimada</p>
                      <p className="font-bold text-lg">
                        {new Date(nextFlight.fechaLlegada).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-gray-700">{nextFlight.horaLlegada}</p>
                    </div>
                  </div>
                  {nextFlight.tripulacionIds.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                      <p className="text-sm text-gray-600">Tripulación asignada</p>
                      <p className="font-medium">{nextFlight.tripulacionIds.length} miembros</p>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleStatusChange(nextFlight.id, 'embarcando')}
                  >
                    Iniciar Embarque
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay vuelos programados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimos vuelos completados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeFlights
              .filter((f) => f.estado === 'aterrizado')
              .slice(0, 5)
              .map((flight) => (
                <div
                  key={flight.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{flight.numeroVuelo}</p>
                      <p className="text-sm text-gray-600">
                        {flight.origen} → {flight.destino}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(flight.estado)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
