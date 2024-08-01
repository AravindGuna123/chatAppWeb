/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '../api/http';
import { ObjectType } from '../types';

//GET
export const getAllUsers = async (data: Record<string, number | string>): Promise<any> => {
  return await http.get('getAllUsers', data);
};

export const fetchChat = async (data: Record<string, number | string>): Promise<any> => {
  return await http.get('fetchChat', data);
};

export const getChatsList = async (data: Record<string, number | string>): Promise<any> => {
  return await http.get('fetchChats', data);
};


// POST
export const loginUser = async (data: Record<string, number | string>): Promise<any> => {
  return await http.post('login', data);
};

export const registerUser = async (data: Record<string, number | string>): Promise<any> => {
    return await http.post('register', data);
};

export const createOrUpdateChat = async (data: Record<string, number | string | any>): Promise<any> => {
  return await http.post('addOrUpdateChat', data);
};

