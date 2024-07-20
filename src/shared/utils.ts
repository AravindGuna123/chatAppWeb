export const setLocalStorage = (key: string, data: string): void => {
    localStorage.setItem(key, data);
  };
  
  export const getLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type ErrorType = Error | any;
  }

export interface User {
    name: string;
    email: string;
    pic: string;
}

export const userInitialState = {
  name: "",
  email: "",
  pic: "",
}
  