import { isEmpty } from 'lodash';
import { type responseType, type ObjectType } from '../../shared/types';

const createHeaders = (isMultiPart: boolean = false): Headers => {
  const token = window.localStorage.getItem('token');
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Pragma', 'no-cache');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Accept', 'application/json');

  if (!isMultiPart) {
    headers.set('Content-Type', 'application/json');
  }
  return new Headers(headers);
};

const createQuery = (obj: ObjectType): string => {
  if (!obj) {
    return '';
  }
  const encodeUri = encodeURIComponent;
  return Object.keys(obj)
    .map((key) => `${encodeUri(key)}=${encodeUri(obj[key])}`)
    .join('&');
};

const fetchHandler = async (result: Response): responseType => {
  if (result.ok) {
    return await result.json();
  }
  return await Promise.reject(result);
};

const validateSuccess = async (result: Response): responseType => {
  const abc = result as { success: boolean } & Response;
  const content = result.headers?.get('content-disposition');
  if (content != null) {
    return result;
  }
  if (abc.success) {
    return result;
  }
  return await Promise.reject(result);
};

const errorHandler = async (res: Response): responseType => await Promise.reject(await res.json());

export { createHeaders, createQuery, fetchHandler, validateSuccess, errorHandler };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMultiPartFormData = (obj: Record<string, any>, fileList: string[]): FormData => {
  const fileSet = new Set(fileList);
  const formData = new FormData();
  for (const key in obj) {
    const isObject = typeof obj[key] === 'object';
    const isFile = fileSet.has(key);
    if (isObject && !isFile) {
      if (Array.isArray(obj[key])) {
        for (const val of obj[key]) {
          formData.append(`${key}[]`, val);
        }
      } else {
        formData.append(key, JSON.stringify(obj[key]));
      }
    } else if (!isEmpty(obj[key]) && isFile && Object.keys(obj[key]).length > 0) {
      console.log(obj[key])
      for (const file of obj[key]) {
        formData.append(key, file.originFileObj, file.name);
      }
    } else {
      formData.set(key, obj[key] ?? '');
    }
  }
  return formData;
};
