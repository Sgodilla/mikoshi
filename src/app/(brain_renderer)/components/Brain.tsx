// Brain.tsx
"use client";

import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { brainMaterial } from "./BrainMaterial";

const Brain: React.FC = () => {
  // Load the brain model
  const brain = useLoader(OBJLoader, "/brain.obj");

  const solidBrain = useMemo(() => {
    const solid = brain.clone();
    solid.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = brainMaterial;
        // child.scale.set(0.9, 0.9, 0.9);
      }
    });
    return solid;
  }, [brain]);

  return <primitive object={solidBrain} />;
};

export default Brain;
