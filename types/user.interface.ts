export interface IUser {
  uuid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  specialization: string | null;
  cv: string | null;
  profileCompleteness: number;
  rating: number;
  phoneNumber: string | null;
  emailConfirmed: boolean;
  lastOnlineAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
