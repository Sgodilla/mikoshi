"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Brain from "./components/Brain";
import { OrbitControls } from "@react-three/drei";

export function page() {
  return (
    <div className="w-full h-full p-0 top-0 left-0 absolute">
      <Canvas camera={{ position: [0, 0, 250] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-5, 5, 5]} />
        <Suspense fallback={null}>
          <Brain />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default page;
