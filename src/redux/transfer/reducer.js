import { REMOVE_DATA, TRANS_DELETE_ID, TRANS_POST_ID } from "./types";

const initialState = {
  post_id: "",
  delete_id: "",
};

export const transferData = (state = initialState, action) => {
  switch (action.type) {
    case TRANS_POST_ID:
      return {
        post_id: action.payload,
        delete_id: "",
      };
    case TRANS_DELETE_ID:
      return {
        delete_id: action.payload,
        post_id: "",
      };
    case REMOVE_DATA:
      return {
        post_id: "",
        delete_id: "",
      };
    default:
      return state;
  }
};
