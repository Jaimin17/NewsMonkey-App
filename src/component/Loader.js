import React from "react";
import loader from "./loader.gif";

const Loader = () => {
  return (
    <div className="text-center my-3">
      <img src={loader} alt="loading Gif" />
    </div>
  );
};

export default Loader;
