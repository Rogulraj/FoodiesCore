export interface User {
  _id?: string;
  email: string;
  password: string;
}

export interface UserWithCookie extends User {
  cookie: string;
}
