const AUTH_STORAGE_KEYS = [
  "access_token",
  "refresh_token",
  "username",
  "userName",
  "email",
];

export function hasAuthTokens() {
  return Boolean(
    localStorage.getItem("access_token") &&
      localStorage.getItem("refresh_token"),
  );
}

export function clearAuth() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}
