/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchUrl } from './env';
import {
  createHeaders,
  createQuery,
  fetchHandler,
  validateSuccess,
  errorHandler,
  createMultiPartFormData,
} from './http-helper';
import { type responseType, type ObjectType } from '../../shared/types';
import { ValidationMessages } from '../helper/constants';

const { CONTANT_HEADER_MISSIMG, COULD_NOT_PARSE_CONTENT_HEADER } = ValidationMessages;

export class Http {
  createOptions = (_url: string, options: ObjectType, isMultiPart = false): ObjectType => {
    options.headers = createHeaders(isMultiPart);
    return options;
  };

  async get(url: string, queryParams: object | null = null, options = {}): responseType {
    let qs;
    let newUrl;
    if (queryParams != null) {
      qs = createQuery(queryParams);
      newUrl = `${fetchUrl()}/${url}?${qs}`;
    } else {
      newUrl = `${fetchUrl()}/${url}`;
    }
    const getOptions = { method: 'GET' };
    options = { ...options, ...getOptions };
    const optionsWithHeaders = this.createOptions(url, options);
    return await fetch(newUrl, optionsWithHeaders)
      .then(fetchHandler)
      .then(validateSuccess)
      .catch(async (e) => await errorHandler(e));
  }

  async post(url: string, body: object, options: Record<string, any> = {}): responseType {
    const { isMultiPart, fileList } = options;
    const postOptions = {
      method: 'POST',
      body: isMultiPart === true ? createMultiPartFormData(body, fileList) : JSON.stringify(body),
    };
    options = { ...options, ...postOptions };
    const optionsWithHeaders = this.createOptions(url, options, isMultiPart);
    console.log(optionsWithHeaders,"op");
    
    return await fetch(`${fetchUrl()}/${url}`, optionsWithHeaders)
      .then(fetchHandler)
      .then(validateSuccess)
      .catch(async (e) => await errorHandler(e));
  }

  async put(url: string, body: object, options: Record<string, any> = {}): responseType {
    const { isMultiPart = false, fileList } = options;
    const putOptions = {
      method: 'PUT',
      body: isMultiPart === true ? createMultiPartFormData(body, fileList) : JSON.stringify(body),
    };
    options = { ...options, ...putOptions };
    const optionsWithHeaders = this.createOptions(url, options, isMultiPart);
    return await fetch(`${fetchUrl()}/${url}`, optionsWithHeaders)
      .then(fetchHandler)
      .then(validateSuccess)
      .catch(async (e) => await errorHandler(e));
  }

  async del(url: string, body: object | unknown, options = {}): responseType {
    let qs;
    let newUrl;
    if (body) {
      qs = createQuery(body);
      newUrl = `${fetchUrl()}/${url}?${qs}`;
    } else {
      newUrl = `${fetchUrl()}/${url}`;
    }
    const deleteOptions = { method: 'DELETE', body: JSON.stringify(options) };
    options = { ...options, ...deleteOptions };
    const optionsWithHeaders = this.createOptions(url, options);
    return await fetch(newUrl, optionsWithHeaders)
      .then(fetchHandler)
      .then(validateSuccess)
      .catch(async (e) => await errorHandler(e));
  }

  async download(
    method: string,
    url: string,
    body: object | null | any = null,
    options: any = {}
  ): Promise<any> {
    const { isMultiPart, fileList } = options;
    const downloadUrl = `${fetchUrl()}/${url}`;
    let baseOptions;
    switch (method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        baseOptions = {
          method,
          body: body
            ? isMultiPart === true
              ? createMultiPartFormData(body, fileList)
              : JSON.stringify(body)
            : null,
        };
        break;
      default:
        baseOptions = { method };
    }
    options = { ...options, ...baseOptions };
    let fileName: string;
    const optionsWithHeaders = this.createOptions(url, options, isMultiPart);
    const response = await fetch(downloadUrl, optionsWithHeaders);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const contentHeader = response.headers.get('content-disposition');
    if (contentHeader) {
      const match = contentHeader.match(/filename="(.+)"/);
      if (match) {
        fileName = decodeURIComponent(match[1]);
      } else {
        throw new Error(COULD_NOT_PARSE_CONTENT_HEADER);
      }
    } else if (response) {
      return await fetchHandler(response)
        .then(validateSuccess)
        .catch(async (e) => await errorHandler(e));
    } else {
      throw new Error(CONTANT_HEADER_MISSIMG);
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.href = objectUrl;
    aTag.download = fileName;
    aTag.style.display = 'none';
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
  }
}

const httpInstance = new Http();

export default httpInstance;
