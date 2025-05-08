// Helpers
export const save = (key: string, value: any[]) =>
    localStorage.setItem(key, JSON.stringify(value));
  
export const load = <T = any>(key: string): T[] =>
    JSON.parse(localStorage.getItem(key) || '[]');
  
export const clear = (key: string) =>
    localStorage.removeItem(key);