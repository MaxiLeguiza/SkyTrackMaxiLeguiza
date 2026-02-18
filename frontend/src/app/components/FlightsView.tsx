import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { FlightForm } from './FlightForm';
import type { Flight, FlightStatus } from '../types';

export const FlightsView: React.FC = () => {
  const { flights, user, deleteFlight, updateFlight } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigen, setFilterOrigen] = useState<string>('all');
  const [filterDestino, setFilterDestino] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<FlightStatus | 'all'>('all');

  const activeFlights = useMemo(() => flights.filter((f) => !f.deleted), [flights]);

  // Obtener listas únicas de orígenes y destinos
  const origenes = useMemo(() => {
    const unique = Array.from(new Set(activeFlights.map((f) => f.origen)));
    return unique.sort();
  }, [activeFlights]);

  const destinos = useMemo(() => {
    const unique = Array.from(new Set(activeFlights.map((f) => f.destino)));
    return unique.sort();
  }, [activeFlights]);

  // Filtrar vuelos
  const filteredFlights = useMemo(() => {
    return activeFlights.filter((flight) => {
      const matchesSearch =
        flight.numeroVuelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destino.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOrigen = filterOrigen === 'all' || flight.origen === filterOrigen;
      const matchesDestino = filterDestino === 'all' || flight.destino === filterDestino;
      const matchesEstado = filterEstado === 'all' || flight.estado === filterEstado;

      return matchesSearch && matchesOrigen && matchesDestino && matchesEstado;
    });
  }, [activeFlights, searchTerm, filterOrigen, filterDestino, filterEstado]);

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

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este vuelo?')) {
      deleteFlight(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFlight(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterOrigen('all');
    setFilterDestino('all');
    setFilterEstado('all');
  };

  const hasActiveFilters =
    searchTerm !== '' || filterOrigen !== 'all' || filterDestino !== 'all' || filterEstado !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Vuelos</h1>
          <p className="text-gray-600">
            {filteredFlights.length} de {activeFlights.length} vuelos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vuelo
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Búsqueda</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar vuelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Origen</label>
              <Select value={filterOrigen} onValueChange={setFilterOrigen}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los orígenes</SelectItem>
                  {origenes.map((origen) => (
                    <SelectItem key={origen} value={origen}>
                      {origen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destino</label>
              <Select value={filterDestino} onValueChange={setFilterDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los destinos</SelectItem>
                  {destinos.map((destino) => (
                    <SelectItem key={destino} value={destino}>
                      {destino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filterEstado}
                onValueChange={(value) => setFilterEstado(value as FlightStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="embarcando">Embarcando</SelectItem>
                  <SelectItem value="en vuelo">En Vuelo</SelectItem>
                  <SelectItem value="aterrizado">Aterrizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Vuelos */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFlights.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No se encontraron vuelos con los filtros aplicados
            </CardContent>
          </Card>
        ) : (
          filteredFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{flight.numeroVuelo}</h3>
                        <p className="text-gray-600 mt-1">
                          {flight.origen} → {flight.destino}
                        </p>
                      </div>
                      {getStatusBadge(flight.estado)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Salida</p>
                        <p className="font-medium">
                          {new Date(flight.fechaSalida).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-600">{flight.horaSalida}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Llegada</p>
                        <p className="font-medium">
                          {new Date(flight.fechaLlegada).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-600">{flight.horaLlegada}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Avión: </span>
                        <span className="font-medium">
                          {flight.avionId ? `#${flight.avionId}` : 'Sin asignar'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tripulación: </span>
                        <span className="font-medium">{flight.tripulacionIds.length} miembros</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(flight)} className="flex-1 lg:flex-none">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    {user?.role === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(flight.id)}
                        className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <FlightForm flight={editingFlight} onClose={handleCloseForm} />
      )}
    </div>
  );
};
