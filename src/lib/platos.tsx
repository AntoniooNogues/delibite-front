export async function getPlatoById(id: number) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/plato/${id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch catalogo:', error);
        throw error;
    }
}