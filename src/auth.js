export const getToken = () => localStorage.getItem("jwt");

export const setToken = (t) => {
  localStorage.setItem("jwt", t);
  // notify current tab
  window.dispatchEvent(new Event("auth-changed"));
};

export const clearToken = () => {
  localStorage.removeItem("jwt");
  // notify current tab
  window.dispatchEvent(new Event("auth-changed"));
};

export const isAuthed = () => !!getToken();