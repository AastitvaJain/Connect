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
      withAuth: false 
    });

export const createAuth = (data: AuthRequest) =>
    request<AuthDto>({
      method: 'POST',
      url: '/auths',
      data,
      withAuth: false 
    });

export const updatePassword = (data: UpdatePasswordRequest) =>
    request<AuthDto>({
      method: 'POST',
      url: '/update-passwords',
      data,
      withAuth: true 
    });

export const logoutUser = () =>
    request<AuthDto>({
      method: 'POST',
      url: '/logouts',
      withAuth: true 
    });
