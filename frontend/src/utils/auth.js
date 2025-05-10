export function isLoggedIn() {
  return !!localStorage.getItem('access_token');
}

export function login(token, user) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}

export function get_user() {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

export function getToken() {
  return localStorage.getItem('access_token');
}