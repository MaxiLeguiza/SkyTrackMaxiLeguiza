import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Flight, FlightStatus } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface FlightFormProps {
  flight: Flight | null;
  onClose: () => void;
}

export const FlightForm: React.FC<FlightFormProps> = ({ flight, onClose }) => {
  const { addFlight, updateFlight, planes, crew, updateCrewMember } = useApp();
  const isEditing = !!flight;

  const [formData, setFormData] = useState({
    numeroVuelo: flight?.numeroVuelo || '',
    origen: flight?.origen || '',
    destino: flight?.destino || '',
    fechaSalida: flight?.fechaSalida || '',
    horaSalida: flight?.horaSalida || '',
    fechaLlegada: flight?.fechaLlegada || '',
    horaLlegada: flight?.horaLlegada || '',
    estado: flight?.estado || 'programado',
    avionId: flight?.avionId ? flight.avionId : 'none',
    tripulacionIds: flight?.tripulacionIds || [],
  });

  const availableCrew = crew.filter(
    (c) => c.disponible || formData.tripulacionIds.includes(c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const flightData = {
      ...formData,
      avionId: formData.avionId === 'none' ? null : formData.avionId,
    };

    if (isEditing) {
      // Actualizar disponibilidad de tripulación
      const oldCrewIds = flight.tripulacionIds;
      const newCrewIds = formData.tripulacionIds;

      // Liberar tripulación removida
      oldCrewIds.forEach((crewId) => {
        if (!newCrewIds.includes(crewId)) {
          updateCrewMember(crewId, { disponible: true });
        }
      });

      // Marcar como no disponible la nueva tripulación
      newCrewIds.forEach((crewId) => {
        if (!oldCrewIds.includes(crewId)) {
          updateCrewMember(crewId, { disponible: false });
        }
      });

      updateFlight(flight.id, flightData);
    } else {
      // Marcar tripulación como no disponible
      formData.tripulacionIds.forEach((crewId) => {
        updateCrewMember(crewId, { disponible: false });
      });

      addFlight(flightData);
    }

    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCrewMember = (crewId: string) => {
    setFormData((prev) => ({
      ...prev,
      tripulacionIds: prev.tripulacionIds.includes(crewId)
        ? prev.tripulacionIds.filter((id) => id !== crewId)
        : [...prev.tripulacionIds, crewId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="min-h-screen w-full flex items-center justify-center py-8">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isEditing ? 'Editar Vuelo' : 'Nuevo Vuelo'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Actualiza la información del vuelo' : 'Completa los datos del nuevo vuelo'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Información del Vuelo</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroVuelo">Número de Vuelo *</Label>
                    <Input
                      id="numeroVuelo"
                      value={formData.numeroVuelo}
                      onChange={(e) => handleChange('numeroVuelo', e.target.value)}
                      placeholder="ST-101"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleChange('estado', value)}
                    >
                      <SelectTrigger id="estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programado">Programado</SelectItem>
                        <SelectItem value="embarcando">Embarcando</SelectItem>
                        <SelectItem value="en vuelo">En Vuelo</SelectItem>
                        <SelectItem value="aterrizado">Aterrizado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origen">Origen *</Label>
                    <Input
                      id="origen"
                      value={formData.origen}
                      onChange={(e) => handleChange('origen', e.target.value)}
                      placeholder="Buenos Aires (EZE)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino *</Label>
                    <Input
                      id="destino"
                      value={formData.destino}
                      onChange={(e) => handleChange('destino', e.target.value)}
                      placeholder="Madrid (MAD)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Horarios</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaSalida">Fecha de Salida *</Label>
                    <Input
                      id="fechaSalida"
                      type="date"
                      value={formData.fechaSalida}
                      onChange={(e) => handleChange('fechaSalida', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaSalida">Hora de Salida *</Label>
                    <Input
                      id="horaSalida"
                      type="time"
                      value={formData.horaSalida}
                      onChange={(e) => handleChange('horaSalida', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaLlegada">Fecha de Llegada *</Label>
                    <Input
                      id="fechaLlegada"
                      type="date"
                      value={formData.fechaLlegada}
                      onChange={(e) => handleChange('fechaLlegada', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaLlegada">Hora de Llegada *</Label>
                    <Input
                      id="horaLlegada"
                      type="time"
                      value={formData.horaLlegada}
                      onChange={(e) => handleChange('horaLlegada', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Asignación de Avión */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">Avión</h3>

                <div className="space-y-2">
                  <Label htmlFor="avionId">Seleccionar Avión</Label>
                  <Select
                    value={formData.avionId}
                    onValueChange={(value) => handleChange('avionId', value)}
                  >
                    <SelectTrigger id="avionId">
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {planes.map((plane) => (
                        <SelectItem key={plane.id} value={plane.id}>
                          {plane.modelo} - {plane.matricula} ({plane.estado})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Asignación de Tripulación */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-2">
                  Tripulación ({formData.tripulacionIds.length} asignados)
                </h3>

                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {availableCrew.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.tripulacionIds.includes(member.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleCrewMember(member.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {member.nombre} {member.apellido}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.rol} - {member.licencia}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.tripulacionIds.includes(member.id)}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Actualizar' : 'Crear'} Vuelo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};