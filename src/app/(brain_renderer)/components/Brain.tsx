"use client";

import React, { useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

const Brain: React.FC = () => {
  const brainRef = useRef<THREE.Object3D | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);

  // Load the brain model.
  const brain = useLoader(OBJLoader, "/brain.obj");

  useMemo(() => {
    brain.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        // Assign a standard material for the shaded part
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5,
        });

        // Create a wireframe geometry
        const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
        // Create a wireframe material
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: "Black",
          linewidth: 2,
        });
        // Create the wireframe mesh
        const wireframe = new THREE.LineSegments(
          wireframeGeometry,
          wireframeMaterial,
        );
        wireframeRef.current = wireframe;
      }
    });
    brainRef.current = brain;
  }, [brain]);

  return (
    <>
      <primitive object={brain} />
      {wireframeRef.current && <primitive object={wireframeRef.current} />}
    </>
  );
};

export default Brain;
