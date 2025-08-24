export const getToken = () => localStorage.getItem("jwt");
export const setToken = (t) => localStorage.setItem("jwt", t);
export const clearToken = () => localStorage.removeItem("jwt");
export const isAuthed = () => !!getToken();