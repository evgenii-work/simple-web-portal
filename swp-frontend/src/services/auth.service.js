import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login = (username, password) => {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  };

  logout = () => {
    localStorage.removeItem("user");
  };

  register = (username, password) => {
    return axios.post(API_URL + "signup", {
      username,
      password,
    });
  };

  getCurrentUser = () => {
    let user = localStorage.getItem("user");
    if (user === null) {
      return null;
    }
    return JSON.parse(localStorage.getItem("user"));
  };

  silentLogin = () => {
    let user = this.getCurrentUser();
    if (user === null) {
      return null;
    }
    return axios
      .post(API_URL + "refreshtoken", {
        refreshToken: user.refreshToken,
      })
      .then((response) => {
        let newUser = null;
        if (response.data.accessToken) {
          newUser = { ...user, accessToken: response.data.accessToken };
          localStorage.setItem("user", JSON.stringify(newUser));
        }
        return newUser;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };
}

export default new AuthService();
