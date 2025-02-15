"use client";

import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Brain from "./Brain";
import { OrbitControls } from "@react-three/drei";
import BrainWireframe from "./BrainWireframe";

const BrainScene = () => {
  const { gl, scene, camera } = useThree();

  useFrame(() => {
    camera.layers.set(0);
    gl.render(scene, camera);
  }, 1);

  return (
    <>
      <directionalLight position={[-5, 5, 5]} />
      <directionalLight position={[5, 5, -5]} />
      <BrainWireframe />
      <Brain />
      <OrbitControls />
    </>
  );
};

export default BrainScene;
