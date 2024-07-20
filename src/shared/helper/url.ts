/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '../api/http';
import { ObjectType } from '../types';

//GET
export const getAllUsers = async (data: Record<string, number | string>): Promise<any> => {
  return await http.get('getAllUsers', data);
};


// POST
export const loginUser = async (data: Record<string, number | string>): Promise<any> => {
  return await http.post('login', data);
};

export const registerUser = async (data: Record<string, number | string>,options:ObjectType): Promise<any> => {
    return await http.post('register', data,options);
};