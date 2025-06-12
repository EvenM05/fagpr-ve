export const saveToStorage = (key: string, value: string) => {
  localStorage.removeItem(key);
  localStorage.setItem(key, value);
};

export const retrieveFromStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const saveToCookie = (
  key: string,
  value: string,
  expireSecond: number,
) => {
  const d = new Date();
  d.setTime(d.getTime() + expireSecond * 1000);
  return (document.cookie = `${key}=${value}; expires=${d.toUTCString()}; path=/;`);
};

export const removeFromCookie = (key: string) => {
  return (document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
};

export const retrieveFromCookie = (key: string) => {
  const allCookies = document.cookie;
  return allCookies
    .split("; ")
    .find((row) => row.startsWith(`${key}=`))
    ?.split("=")[1];
};
