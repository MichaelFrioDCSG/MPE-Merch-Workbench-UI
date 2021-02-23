import { IUserProfile } from './IUserProfile';
import { ITokenResponse } from './ITokenResponse';

export interface IAuthState {
  UserProfile: IUserProfile;
  TokenResponse: ITokenResponse;
}
