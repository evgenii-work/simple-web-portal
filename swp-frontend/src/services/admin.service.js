import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class AdminService {
  getUserList() {
    return axios.get(API_URL + "userlist", { headers: authHeader() });
  }

  createUser(user) {
    return axios.post(
      API_URL + "createuser",
      { ...user },
      { headers: authHeader() }
    );
  }

  updateUser(user) {
    return axios.post(
      API_URL + "updateuser",
      { ...user },
      { headers: authHeader() }
    );
  }

  deleteUser(id) {
    return axios.post(
      API_URL + "deleteuser",
      { id },
      { headers: authHeader() }
    );
  }
}
export default new AdminService();
