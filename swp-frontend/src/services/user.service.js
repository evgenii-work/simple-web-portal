import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/user/";

class UserService {
  changePassword(user) {
    return axios.post(
      API_URL + "changepassword",
      { ...user },
      { headers: authHeader() }
    );
  }
  getBoard() {
    return axios.get(API_URL + "board", { headers: authHeader() });
  }
}
export default new UserService();
