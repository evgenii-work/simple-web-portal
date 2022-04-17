const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export default function authVerify() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const decodedJwt = parseJwt(user.accessToken);
      if (decodedJwt.exp * 1000 < Date.now()) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}
