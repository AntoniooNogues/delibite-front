export async function getPlatoById(id: number) {
    try {
        const response = await fetch(`/api/plato/${id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al mostrar los detalles del plato:', error);
        throw error;
    }
}