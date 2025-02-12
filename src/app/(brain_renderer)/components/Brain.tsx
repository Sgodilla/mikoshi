"use client";

import React from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";

const Brain = () => {
  const brain = useLoader(OBJLoader, "/brain.obj");
  return <div>Brain</div>;
};

export default Brain;
