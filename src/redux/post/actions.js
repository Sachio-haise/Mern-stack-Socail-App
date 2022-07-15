import axios from "axios";
import { GET_POST, PENDING_POST } from "./types";

export const getPosts = () => async (dispatch) => {
  dispatch({
    type: PENDING_POST,
  });
  const res = await axios.get(
    "https://mern-social-app-2022.herokuapp.com/api/posts"
  );
  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};

export const getPostsOnly = () => async (dispatch) => {
  const res = await axios.get(
    "https://mern-social-app-2022.herokuapp.com/api/posts"
  );
  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};
