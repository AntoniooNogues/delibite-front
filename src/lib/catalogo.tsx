export async function getCatalogo() {
    try {
        const response = await fetch('/api/catalogo/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al mostrar el catalogo:', error);
        throw error;
    }
}

