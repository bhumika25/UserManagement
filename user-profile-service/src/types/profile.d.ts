export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface CreateProfileBody {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
