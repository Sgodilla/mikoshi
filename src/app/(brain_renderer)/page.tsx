"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

// <Canvas>
//   <ambientLight intensity={Math.PI / 2} />
//   <spotLight
//     position={[10, 10, 10]}
//     angle={0.15}
//     penumbra={1}
//     decay={0}
//     intensity={Math.PI}
//   />
//   <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
//   <Box position={[-1.2, 0, 0]} />
//   <Box position={[1.2, 0, 0]} />
// </Canvas>
