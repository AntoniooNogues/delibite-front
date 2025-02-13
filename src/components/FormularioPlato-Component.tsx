import React, { useEffect, useState } from 'react';
import { Modal, TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, SelectChangeEvent, OutlinedInput, InputAdornment} from '@mui/material';
import { InterfazPlato } from '@/interfaces/interfazPlato';
import axiosClient from "@/lib/axiosClient";
import { XCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { DatosSelectores } from "@/interfaces/datosSelectores";
import { Alergenos } from '@/interfaces/Catalogo';
import CloudinaryUpload from "@/components/Cloudinary-Component";
import NotificacionComponent from "@/components/Notificacion-Component";
import { Notificaciones } from '@/interfaces/Notificaciones';

const FormularioPlato = ({ plato, open, handleClose, modo }: {
    plato: InterfazPlato | undefined;
    open: boolean;
    handleClose: () => void;
    modo: 'editar' | 'crear';
}) => {
    const initialPlatoData: InterfazPlato = {
        plato_id: 0,
        nombre: '',
        descripcion: '',
        url: null,
        ingredientes: '',
        precio: 0,
        tipo: [1, ""],
        modo_empleo: [1, ""],
        calorias: 0,
        azucares: 0,
        carbohidratos: 0,
        fibra: 0,
        sal: 0,
        grasas: 0,
        grasas_saturadas: 0,
        proteina: 0,
        alergenos: []
    };
    const [platoData, setPlatoData] = useState<InterfazPlato>(modo !== 'crear' ? plato! : initialPlatoData);
    const [datosSelectores, setDatosSelectores] = useState<DatosSelectores>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setPlatoData({ ...platoData, [name]: value });
    };

    const handleAlergenosChange = (event: SelectChangeEvent<string[]>) => {
        const selectedAlergenos = event.target.value as string[];
        const updatedAlergenos = selectedAlergenos
            .map(nombre => datosSelectores?.alergenos.find(a => a.nombre === nombre))
            .filter(a => a !== undefined) as Alergenos[];

        setPlatoData({ ...platoData, alergenos: updatedAlergenos });
    };

    const cargarDatos = async () => {
        try {
            const response = await axiosClient.get<DatosSelectores>('/administracion/platos/cargarDatos');
            setDatosSelectores(response.data);
        } catch (error) {
            console.error('Error al cargar los datos selectores:', error);
        }
    }

    const handleUpdate = async () => {
        try {
            if (imageUrl) {
                platoData.url = imageUrl;
            }
            const respuesta = await axiosClient.put(`/administracion/platos/editar/${platoData.plato_id}`, platoData);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            console.log(respuesta.data)
            setTimeout(() => {
                handleClose();
            }, 2500);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
            }
        }
    };


    const handleCreate = async () => {
        try {
            console.log('PlatoData:', platoData);
            if (imageUrl) {
                platoData.url = imageUrl;
            }
            const respuesta = await axiosClient.post('/administracion/platos/crear', JSON.stringify(platoData));
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            setTimeout(() => {
                handleClose();
            }, 2500);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
            }
        }
    };

    const handleUploadComplete = (url: string) => {
        setImageUrl(url);
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto scroll">
                        <div className="flex flex-row justify-between items-center rounded-full mb-4">
                            <h2 className="text-xl font-semibold items-center" id="modal-modal-title">
                                {modo === 'editar' ? 'Editar Plato' : 'Crear Plato'}
                            </h2>
                            <button onClick={() => {
                                console.log('Cerrando modal');
                                handleClose();
                            }} className="flex items-center hover:scale-105 active:scale-95 transition-transform">
                                <XCircleIcon className="h-8 w-8 text-red-500" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <TextField label="Nombre" name="nombre" value={platoData.nombre} onChange={handleChange} fullWidth />
                            <TextField label="Descripción" name="descripcion" value={platoData.descripcion} onChange={handleChange} fullWidth multiline minRows={3} maxRows={15} />
                            <TextField label="Ingredientes" name="ingredientes" value={platoData.ingredientes} onChange={handleChange} fullWidth multiline minRows={3} maxRows={15} />
                            <FormControl >
                                <InputLabel htmlFor="outlined-adornment-precio">Precio (€)</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-precio"
                                    name="precio"
                                    type="number"
                                    value={platoData.precio || ''}
                                    onChange={handleChange}
                                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                    label="Precio (€)"
                                />
                            </FormControl>

                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="tipo-label">Tipo</InputLabel>
                                <Select labelId="tipo-label" name="tipo" value={platoData.tipo[0]} onChange={(e: SelectChangeEvent<number>) => setPlatoData({ ...platoData, tipo: [Number(e.target.value), platoData.tipo[1]] })} label="Tipo">
                                    {datosSelectores?.tipos.map((tipo: [number, string]) => (
                                        <MenuItem key={tipo[0]} value={tipo[0]}>{tipo[1]}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="modo-empleo-label">Modo de Empleo</InputLabel>
                                <Select labelId="modo-empleo-label" name="modo_empleo" value={platoData.modo_empleo[0]} onChange={(e: SelectChangeEvent<number>) => setPlatoData({ ...platoData, modo_empleo: [Number(e.target.value), platoData.modo_empleo[1]] })} label="Modo de Empleo">
                                    {datosSelectores?.modos_empleo.map((modo: [number, string]) => (
                                        <MenuItem key={modo[0]} value={modo[0]}>{modo[1]}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="alergenos-label">Alérgenos</InputLabel>
                                <Select
                                    labelId="alergenos-label"
                                    name="alergenos"
                                    multiple
                                    value={platoData.alergenos.map(a => a.nombre)}
                                    onChange={handleAlergenosChange}
                                    renderValue={(selected) => (selected as string[]).join(', ') ? (selected as string[]).join(', ') : 'Ninguno'}
                                    label="Alérgenos"
                                >
                                    {datosSelectores?.alergenos.map(alergeno => (
                                        <MenuItem key={alergeno.alergeno_id + alergeno.nombre} value={alergeno.nombre}>
                                            <Checkbox checked={platoData.alergenos.map(a => a.nombre).indexOf(alergeno.nombre) > -1} />
                                            <ListItemText primary={alergeno.nombre} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {(modo === 'crear' || (modo === 'editar' && (platoData.url?.length ?? 0) === 0)) && <CloudinaryUpload onUploadComplete={handleUploadComplete} />}
                            {(modo === 'crear' || modo === 'editar') && imageUrl && <img src={imageUrl} alt="Uploaded image" />}
                            {modo === 'editar' && (
                                <div>
                                    {platoData.url && (
                                        <div>
                                            <p className="text-gray-800 text-md font-bold">Imagen</p>
                                            <img src={platoData.url} alt="Uploaded image" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <TextField label="Calorías" name="calorias" type={"number"} value={platoData.calorias || ''} onChange={handleChange} fullWidth />
                            <TextField label="Azúcares" name="azucares" type={"number"} value={platoData.azucares || ''} onChange={handleChange} fullWidth />
                            <TextField label="Carbohidratos" name="carbohidratos" type={"number"} value={platoData.carbohidratos || ''} onChange={handleChange} fullWidth />
                            <TextField label="Fibra" name="fibra" type={"number"} value={platoData.fibra || ''} onChange={handleChange} fullWidth />
                            <TextField label="Sal" name="sal" type={"number"} value={platoData.sal || ''} onChange={handleChange} fullWidth />
                            <TextField label="Grasas" name="grasas" type={"number"} value={platoData.grasas || ''} onChange={handleChange} fullWidth />
                            <TextField label="Grasas Saturadas" name="grasas_saturadas" type={"number"} value={platoData.grasas_saturadas || ''} onChange={handleChange} fullWidth />
                            <TextField label="Proteína" name="proteina" type={"number"} value={platoData.proteina || ''} onChange={handleChange} fullWidth />

                        </div>
                        <div className="my-4 flex justify-center">
                            <button onClick={modo === 'editar' ? handleUpdate : handleCreate} className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform w-1/2">
                                {modo === 'editar' ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                    {notificacion && (
                        <NotificacionComponent
                            Notificaciones={notificacion}
                            onClose={() => setNotificacion(undefined)}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default FormularioPlato;