"use client";

import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

const BrainWireframe: React.FC = () => {
  // Load the brain model
  const brain = useLoader(OBJLoader, "/brain.obj");

  useMemo(() => {
    brain.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // Create a wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000, // Red color for the wireframe
          wireframe: true,
          side: THREE.FrontSide, // Render only front-facing triangles
        });

        // Apply the wireframe material to the mesh
        child.material = wireframeMaterial;
      }
    });
  }, [brain]);

  return <primitive object={brain} />;
};

export default BrainWireframe;
