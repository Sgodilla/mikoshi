"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { addBarycentrics } from "./addBarycentrics";
import { useLoader } from "@react-three/fiber";

const BrainModel: React.FC<{ wireframe?: boolean }> = ({
  wireframe = false,
}) => {
  const brainRef = useRef<THREE.Object3D | null>(null);

  // Load the brain model
  const brain = useLoader(OBJLoader, "/brain.obj");

  // Process the brain model
  useMemo(() => {
    addBarycentrics(brain);
    brain.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (wireframe) {
          // Create only wireframe geometry
          const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
          const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
          });
          child.geometry = wireframeGeometry;
          child.material = wireframeMaterial;
        } else {
          // Assign a standard material for the shaded part
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.5,
          });
        }
      }
    });
    brainRef.current = brain;
  }, [brain, wireframe]);

  return <primitive object={brain} />;
};

export default BrainModel;
