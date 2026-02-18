import React, { useState, useMemo } from 'react';
import { Plus, Edit, UserCheck, UserX, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import type { CrewMember } from '../types';

export const CrewView: React.FC = () => {
  const { crew, flights, addCrewMember, updateCrewMember } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [filterDisponible, setFilterDisponible] = useState<'all' | 'disponible' | 'ocupado'>('all');

  const filteredCrew = useMemo(() => {
    if (filterDisponible === 'all') return crew;
    if (filterDisponible === 'disponible') return crew.filter((c) => c.disponible);
    return crew.filter((c) => !c.disponible);
  }, [crew, filterDisponible]);

  const stats = useMemo(() => {
    return {
      total: crew.length,
      disponibles: crew.filter((c) => c.disponible).length,
      ocupados: crew.filter((c) => !c.disponible).length,
      capitanes: crew.filter((c) => c.rol === 'Capitán').length,
      copilotos: crew.filter((c) => c.rol === 'Copiloto').length,
      azafatas: crew.filter((c) => c.rol.includes('Azafata') || c.rol.includes('Azafato')).length,
    };
  }, [crew]);

  const getAssignedFlight = (memberId: string) => {
    return flights.find(
      (f) =>
        f.tripulacionIds.includes(memberId) &&
        !f.deleted &&
        (f.estado === 'programado' || f.estado === 'embarcando' || f.estado === 'en vuelo')
    );
  };

  const handleEdit = (member: CrewMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Tripulación</h1>
          <p className="text-gray-600">
            {filteredCrew.length} de {crew.length} miembros
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Miembro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tripulación</CardTitle>
            <Users className="w-5 h-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Disponibles</CardTitle>
            <UserCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.disponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Servicio</CardTitle>
            <UserX className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.ocupados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Por Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Capitanes:</span> <span className="font-medium">{stats.capitanes}</span>
              </p>
              <p>
                <span className="text-gray-600">Copilotos:</span> <span className="font-medium">{stats.copilotos}</span>
              </p>
              <p>
                <span className="text-gray-600">Azafatas:</span> <span className="font-medium">{stats.azafatas}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Label>Filtrar:</Label>
            <Button
              variant={filterDisponible === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterDisponible('all')}
            >
              Todos
            </Button>
            <Button
              variant={filterDisponible === 'disponible' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterDisponible('disponible')}
            >
              Disponibles
            </Button>
            <Button
              variant={filterDisponible === 'ocupado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterDisponible('ocupado')}
            >
              En Servicio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tripulación */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrew.map((member) => {
          const assignedFlight = getAssignedFlight(member.id);
          return (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {member.nombre} {member.apellido}
                    </h3>
                    <p className="text-gray-600">{member.rol}</p>
                  </div>
                  <Badge className={member.disponible ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {member.disponible ? 'Disponible' : 'En servicio'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licencia:</span>
                    <span className="font-medium">{member.licencia}</span>
                  </div>
                </div>

                {assignedFlight && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-semibold text-blue-900">Vuelo Asignado</p>
                    <p className="text-blue-700">{assignedFlight.numeroVuelo}</p>
                    <p className="text-blue-600 text-xs">
                      {assignedFlight.origen} → {assignedFlight.destino}
                    </p>
                    <p className="text-blue-600 text-xs mt-1">Estado: {assignedFlight.estado}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal del formulario */}
      {showForm && <CrewFormModal member={editingMember} onClose={handleCloseForm} />}
    </div>
  );
};

// Formulario de Tripulación en Modal
interface CrewFormModalProps {
  member: CrewMember | null;
  onClose: () => void;
}

const CrewFormModal: React.FC<CrewFormModalProps> = ({ member, onClose }) => {
  const { addCrewMember, updateCrewMember } = useApp();
  const isEditing = !!member;

  const [formData, setFormData] = useState({
    nombre: member?.nombre || '',
    apellido: member?.apellido || '',
    rol: member?.rol || '',
    licencia: member?.licencia || '',
    disponible: member?.disponible ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      updateCrewMember(member.id, formData);
    } else {
      addCrewMember(formData);
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
            <CardTitle>{isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Plus className="w-5 h-5 rotate-45" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Carlos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  placeholder="Rodríguez"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Input
                id="rol"
                value={formData.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
                placeholder="Capitán, Copiloto, Azafata..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licencia">Licencia *</Label>
              <Input
                id="licencia"
                value={formData.licencia}
                onChange={(e) => handleChange('licencia', e.target.value)}
                placeholder="ATP-001234"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disponible"
                checked={formData.disponible}
                onChange={(e) => handleChange('disponible', e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="disponible" className="cursor-pointer">
                Disponible para asignación
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Actualizar' : 'Crear'} Miembro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
