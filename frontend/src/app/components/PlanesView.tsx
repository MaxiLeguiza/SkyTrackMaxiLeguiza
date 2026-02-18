import React, { useState, useMemo } from 'react';
import { Plus, Edit, Wrench, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import type{ Plane, PlaneStatus } from '../types';

export const PlanesView: React.FC = () => {
  const { planes, flights, addPlane, updatePlane } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingPlane, setEditingPlane] = useState<Plane | null>(null);
  const [filterEstado, setFilterEstado] = useState<PlaneStatus | 'all'>('all');

  const filteredPlanes = useMemo(() => {
    if (filterEstado === 'all') return planes;
    return planes.filter((p) => p.estado === filterEstado);
  }, [planes, filterEstado]);

  const stats = useMemo(() => {
    return {
      total: planes.length,
      disponibles: planes.filter((p) => p.estado === 'disponible').length,
      enVuelo: planes.filter((p) => p.estado === 'en vuelo').length,
      enMantenimiento: planes.filter((p) => p.estado === 'en mantenimiento').length,
    };
  }, [planes]);

  const getFlightForPlane = (planeId: string) => {
    return flights.find((f) => f.avionId === planeId && !f.deleted && f.estado !== 'aterrizado');
  };

  const getStatusBadge = (status: PlaneStatus) => {
    const styles = {
      disponible: 'bg-green-100 text-green-800',
      'en vuelo': 'bg-blue-100 text-blue-800',
      'en mantenimiento': 'bg-orange-100 text-orange-800',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const handleEdit = (plane: Plane) => {
    setEditingPlane(plane);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlane(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Aviones</h1>
          <p className="text-gray-600">
            {filteredPlanes.length} de {planes.length} aviones
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Avión
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Aviones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Disponibles</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.disponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Vuelo</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.enVuelo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Mantenimiento</CardTitle>
            <Wrench className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.enMantenimiento}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Filtrar por estado:</Label>
            <Select
              value={filterEstado}
              onValueChange={(value) => setFilterEstado(value as PlaneStatus | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="en vuelo">En Vuelo</SelectItem>
                <SelectItem value="en mantenimiento">En Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Aviones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlanes.map((plane) => {
          const assignedFlight = getFlightForPlane(plane.id);
          return (
            <Card key={plane.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{plane.modelo}</h3>
                    <p className="text-gray-600">{plane.fabricante}</p>
                  </div>
                  {getStatusBadge(plane.estado)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matrícula:</span>
                    <span className="font-medium">{plane.matricula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacidad:</span>
                    <span className="font-medium">{plane.capacidad} pasajeros</span>
                  </div>
                </div>

                {assignedFlight && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-semibold text-blue-900">Vuelo Asignado</p>
                    <p className="text-blue-700">{assignedFlight.numeroVuelo}</p>
                    <p className="text-blue-600 text-xs">
                      {assignedFlight.origen} → {assignedFlight.destino}
                    </p>
                  </div>
                )}

                <Button variant="outline" size="sm" onClick={() => handleEdit(plane)} className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal del formulario */}
      {showForm && <PlaneFormModal plane={editingPlane} onClose={handleCloseForm} />}
    </div>
  );
};

// Formulario de Avión en Modal
interface PlaneFormModalProps {
  plane: Plane | null;
  onClose: () => void;
}

const PlaneFormModal: React.FC<PlaneFormModalProps> = ({ plane, onClose }) => {
  const { addPlane, updatePlane } = useApp();
  const isEditing = !!plane;

  const [formData, setFormData] = useState({
    modelo: plane?.modelo || '',
    matricula: plane?.matricula || '',
    capacidad: plane?.capacidad || 0,
    estado: plane?.estado || 'disponible',
    fabricante: plane?.fabricante || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      updatePlane(plane.id, formData);
    } else {
      addPlane(formData);
    }

    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isEditing ? 'Editar Avión' : 'Nuevo Avión'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Plus className="w-5 h-5 rotate-45" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                placeholder="Boeing 787-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante *</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => handleChange('fabricante', e.target.value)}
                placeholder="Boeing"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                value={formData.matricula}
                onChange={(e) => handleChange('matricula', e.target.value)}
                placeholder="LV-GHI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad (pasajeros) *</Label>
              <Input
                id="capacidad"
                type="number"
                value={formData.capacidad}
                onChange={(e) => handleChange('capacidad', parseInt(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                <SelectTrigger id="estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en vuelo">En Vuelo</SelectItem>
                  <SelectItem value="en mantenimiento">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Actualizar' : 'Crear'} Avión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
