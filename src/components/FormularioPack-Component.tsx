import React, { useEffect, useState } from 'react';
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, ListItemText, SelectChangeEvent } from '@mui/material';
import { XCircleIcon } from "@heroicons/react/20/solid";
import axiosClient from "@/lib/axiosClient";
import {cargarPlatosPack, Pack, Plato} from "@/interfaces/Administracion-Interfaces";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';
import axios from "axios";

const FormularioPack = ({ pack, open, handleClose, modo }: {
    pack: Pack | undefined;
    open: boolean;
    handleClose: () => void;
    modo: 'editar' | 'crear';
}) => {
    const initialPack: Pack = {
        pack_id: 0,
        nombre: '',
        descripcion: '',
        precio: 0,
        visibilidad: true,
        platos: []
    };
    const [packData, setPackData] = useState<Pack>(modo !== 'crear' ? pack! : initialPack);
    const [platosDatos, setPlatosDatos] = useState<cargarPlatosPack>();
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPackData({ ...packData, [name]: value });
    };

    const handlePlatosChange = (event: SelectChangeEvent<string[]>) => {
        const selectedPlatos = event.target.value as string[];
        const updatedPlatos = selectedPlatos
            .map(nombre => platosDatos?.platos.find((a: Plato) => a.nombre === nombre))
            .filter((a): a is Plato => a !== undefined);

        setPackData({ ...packData, platos: updatedPlatos });
    };

    const cargarDatos = async () => {
        try {
            const response = await axiosClient.get<cargarPlatosPack>('/administracion/packs/cargarDatos');
            setPlatosDatos(response.data);
        } catch (error) {
            console.error('Error al cargar los datos selectores:', error);
        }
    }

    const handleUpdate = async () => {
        if (packData.platos.length < 2 || packData.platos.length > 10) {
            setNotificacion({ titulo: 'Error', mensaje: 'Debe seleccionar entre 2 y 10 platos.', code: 400, tipo: 'error' });
            return;
        }
        try {
            const respuesta = await axiosClient.put(`/administracion/packs/editar/${packData.pack_id}`, packData);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setTimeout(() => {
                handleClose();
            }, 2500);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al editar el pack: Error desconocido', code: 500, tipo: 'error' });
            }
        }
    };

    const handleCreate = async () => {
        if (packData.platos.length < 2 || packData.platos.length > 10 || !packData.nombre || !packData.descripcion || packData.precio <= 0) {
            setNotificacion({ titulo: 'Error', mensaje: 'Debe seleccionar entre 2 y 10 platos y completar todos los campos.', code: 400, tipo: 'error' });
            return;
        }
        try {
            const respuesta = await axiosClient.post('/administracion/packs/crear', JSON.stringify(packData));
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setTimeout(() => {
                handleClose();
            }, 2500);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            }
            setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el pack: Error desconocido', code: 500, tipo: 'error' });
        }
    };

    useEffect(() => {
        cargarDatos();
        console.log(packData);
    }, []);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto scroll">
                        <div className="flex flex-row justify-between items-center rounded-full mb-4">
                            <h2 className="text-xl font-semibold items-center" id="modal-modal-title">
                                {modo === 'editar' ? 'Editar Pack' : 'Crear Pack'}
                            </h2>
                            <button onClick={handleClose} className="flex items-center hover:scale-105 active:scale-95 transition-transform">
                                <XCircleIcon className="h-8 w-8 text-red-500" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <TextField label="Nombre" name="nombre" value={packData.nombre} onChange={handleChange} fullWidth />
                            <TextField label="Descripción" name="descripcion" value={packData.descripcion} onChange={handleChange} fullWidth multiline minRows={3} maxRows={15} />
                            <TextField label="Precio" name="precio" value={packData.precio} onChange={handleChange} fullWidth />
                            <div>
                                {modo === 'crear' ? (
                                    <section>
                                        <h3 className="text-lg font-semibold">Precio de los Platos Seleccionados:
                                            <span className="font-normal"> {packData.platos.reduce((total, plato) => total + plato.precio, 0).toFixed(2)}€</span>
                                        </h3>
                                        <h3 className="text-lg font-semibold">Precio recomendado (15% de descuento):
                                            <span className="font-normal"> {(packData.platos.reduce((total, plato) => total + plato.precio, 0) * 0.85).toFixed(2)}€</span>
                                        </h3>
                                    </section>
                                ) : (
                                    <section>
                                        <h3 className="text-lg font-semibold">Precio del Pack:
                                            <span className="font-normal"> {packData.precio}€ </span>
                                        </h3>
                                        <h3 className="text-lg font-semibold">Precio recomendado (15% de descuento):
                                            <span className="font-normal"> {(packData.precio * 0.85).toFixed(2)}€</span>
                                        </h3>
                                    </section>
                                )}
                            </div>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="platos-label">Platos</InputLabel>
                                <Select
                                    labelId="platos-label"
                                    name="platos"
                                    multiple
                                    value={packData.platos.map(p => p.nombre)}
                                    onChange={handlePlatosChange}
                                    renderValue={(selected) => (selected as string[]).join(', ')}
                                    label="Packs"
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                '& .Mui-selected': {
                                                    backgroundColor: '#c0daca !important',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {platosDatos?.platos.map((plato: Plato) => (
                                        <MenuItem key={plato.id} value={plato.nombre}>
                                            <ListItemText primary={plato.nombre} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div>
                                <h3 className="text-lg font-semibold">Platos Seleccionados:</h3>
                                <ul>
                                    {packData.platos.map(plato => (
                                        <li key={plato.id}>{plato.nombre}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="my-4 flex justify-center">
                            <button onClick={modo === 'editar' ? handleUpdate : handleCreate} className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform w-1/2">
                                {modo === 'editar' ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                        {notificacion && (
                            <NotificacionComponent
                                Notificaciones={notificacion}
                                onClose={() => setNotificacion(undefined)}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FormularioPack;