import { RolUsuario } from './osa.models';

export interface UsuarioAuth {
  username: string;
  nombre: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UsuarioAuth;
}
