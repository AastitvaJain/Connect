import type { EmailLoginRequest } from '../models/requests/EmailLoginRequest';
import type { AuthUserDto, AuthDto } from '../models/AuthUserDto';
import type { AuthRequest } from '../models/requests/AuthRequest';
import type { UpdatePasswordRequest } from '../models/requests/UpdatePasswordRequest';
import { request } from './request';

export const createEmailLogin = (data: EmailLoginRequest) =>
    request<AuthUserDto>({
      method: 'POST',
      url: '/email-logins',
      data,
      auth: false 
    } as any);

export const createAuth = (data: AuthRequest) =>
    request<AuthDto>({
      method: 'POST',
      url: '/auths',
      data,
      auth: false 
    } as any);

export const updatePassword = (data: UpdatePasswordRequest) =>
    request<AuthDto>({
      method: 'POST',
      url: '/update-passwords',
      data,
      auth: true 
    } as any);

export const logout = () =>
    request<AuthDto>({
      method: 'POST',
      url: '/logouts',
      auth: true 
    } as any);
