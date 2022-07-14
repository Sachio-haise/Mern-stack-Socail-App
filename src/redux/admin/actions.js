import axios from "axios";
import { LOGOUT } from "../auth/types";
import decode from "jwt-decode";
import CryptoJS from "crypto-js";
import { GET_USERS } from "./type";
export const getUsers = () => async (dispatch) => {
  const auth = localStorage.getItem("a%t");
  if (auth) {
    const decrypted = JSON.parse(
      CryptoJS.enc.Utf8.stringify(
        CryptoJS.AES.decrypt(auth, "secret", {
          keySize: 128 / 8,
          iv: "secret",
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        })
      )
    );

    const decodedToken = decode(decrypted.token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch({
        type: LOGOUT,
      });
      return;
    }
    const res = await axios.get(
      "https://mern-social-app-2022.herokuapp.com/admin/users",
      {
        headers: {
          Authorization: `Bearer ${decrypted.token}`,
        },
      }
    );
    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  }
};
