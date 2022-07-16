import axios from "axios";
import { server_url } from "../../config";
import { GET_POST, PENDING_POST } from "./types";

export const getPosts = () => async (dispatch) => {
  dispatch({
    type: PENDING_POST,
  });
  const res = await axios.get(`/api/posts`);
  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};

export const getPostsOnly = () => async (dispatch) => {
  const res = await axios.get(`/api/posts`);

  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};
