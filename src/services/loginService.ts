import api from './api'
import AuthService from './authService'

export const login = async (usuario: string, contraseña: string) => {
    try {
        const body = { nombre: usuario, contraseña: contraseña }
        const response = await api.post('/api/usuario/login', body)
        
        AuthService.setAuth(response.data)
        
        return response.data
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        throw error
    }
}

export const logout = () => {
    AuthService.logout()
}