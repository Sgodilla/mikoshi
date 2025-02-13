// Brain.tsx
"use client";

import React, { useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { addBarycentrics } from "./addBarycentrics";

const Brain: React.FC = () => {
  const brainRef = useRef<THREE.Object3D | null>(null);

  // Load the brain model.
  const brain = useLoader(OBJLoader, "/brain.obj");

  // Add barycentrics and assign a basic material for the first pass.
  useMemo(() => {
    addBarycentrics(brain);
    brain.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // Create a wireframe geometry
        const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
        // Create a wireframe material
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x000000, // Set the wireframe color
          linewidth: 1,
        });
        // Create the wireframe mesh
        const wireframe = new THREE.LineSegments(
          wireframeGeometry,
          wireframeMaterial,
        );
        // Add the wireframe as a child of the original mesh
        child.add(wireframe);

        // Assign a standard material for the shaded part
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5,
        });
      }
    });
    brainRef.current = brain;
  }, [brain]);

  return <primitive object={brain} />;
};

export default Brain;
