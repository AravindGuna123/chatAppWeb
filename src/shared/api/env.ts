export function fetchUrl(): string {
  if (typeof window !== 'undefined') {
    const apiPath = '/api/users';
    const { protocol, hostname } = window.location;
    if (hostname.includes('localhost')) {
      const port = 5001;
      return `${protocol}//${hostname}:${port}${apiPath}`;
    }
    return `${protocol}//${hostname}${apiPath}`;
  }
  return '';
}
