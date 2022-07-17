import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { server_url } from "../../config";

function Atest() {
  const [file, setFIle] = useState("");
  const [image, setImage] = useState("");
  const auth = useSelector((state) => state.auth.auth);
  const postImage = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${server_url}/api/test`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(res.data);
  };
  return (
    <div>
      <form>
        <input
          type="file"
          onChange={(e) => {
            setFIle(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
        />
      </form>
      <button onClick={() => postImage()}>Submit</button>
    </div>
  );
}

export default Atest;
