import { UserGroup, UserState } from './Enums';

export interface AuthUserDto {
  user: UserDto;
  auth: AuthDto;
}

export interface UserDto {
    id: number;
    emailId?: string;
    name?: string;
    group: UserGroup;
    state: UserState;
  }

export interface AuthDto {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}