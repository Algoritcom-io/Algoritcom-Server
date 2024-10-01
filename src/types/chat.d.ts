export interface User {
  id: string;
  name: string;
  pictureProfile: string;
}

export interface Message {
  message: string;
  user: User;
  date: Date;
}
