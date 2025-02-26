
interface UserFormData {
    username: string;
    password: string;
}

export async function adminLogin(formData: UserFormData) {
    try {
        const response = await fetch('/api/administracion/login_check', {
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
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}
