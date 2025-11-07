import type { Usuario } from "../types/usuario";

export type LoginResponse = {
    success: boolean,
    token?: string,
    usuario?: Omit<Usuario, 'contraseña'>,
    message?: string
}

export class AuthService {
    private static TOKEN_KEY = 'auth_token';
    private static USER_KEY = 'user_data';

    static setAuth(authData: LoginResponse): void {
        if (authData.token) {
            localStorage.setItem(this.TOKEN_KEY, authData.token);
        } else {
            localStorage.removeItem(this.TOKEN_KEY);
        }

        if (authData.usuario) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(authData.usuario));
        } else {
            localStorage.removeItem(this.USER_KEY);authData.token
        }
    }

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static getUser(): any | null {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token; 
    }

    static logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = '/login';
    }

    static hasRole(role: string | string[]): boolean {
        const user = this.getUser();
        if (!user || !user.roles) return false;

        if (Array.isArray(role)) {
            return role.some(r => user.roles.includes(r));
        }
        return user.roles.includes(role);
    }

    static isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
}

export default AuthService;