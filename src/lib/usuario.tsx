
export async function registro(formData: { [key: string]: string; }) {
    try {
        console.log(formData)
        const response = await fetch('/api/registro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al registrar', error);
        throw error;
    }
}