import axios from "axios";
import { server_url } from "../../config";
import { GET_POST, PENDING_POST } from "./types";

export const getPosts = () => async (dispatch) => {
  dispatch({
    type: PENDING_POST,
  });

  const res = await fetch(`${server_url}/api/posts`, {
    method: "GET",

    mode: "no-cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};

export const getPostsOnly = () => async (dispatch) => {
  const res = await axios.get(`${server_url}/api/posts`);

  dispatch({
    type: GET_POST,
    payload: res.data.data,
  });
};
