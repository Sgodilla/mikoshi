"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import BrainScene from "./components/BrainScene";

const page = () => {
  return (
    <div className="w-full h-full p-0 top-0 left-0 absolute">
      <Canvas camera={{ position: [0, 0, 250] }}>
        <BrainScene />
      </Canvas>
    </div>
  );
};

export default page;
