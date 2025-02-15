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
        // Assign the brain mesh to layer 0
        child.layers.set(0);
        // Assign a standard material for the shaded part
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5,
          depthTest: true,
          depthWrite: true,
          side: THREE.FrontSide,
        });

        // Create a wireframe geometry
        const thresholdAngle = 20 * (Math.PI / 180);
        const wireframeGeometry = new THREE.EdgesGeometry(
          child.geometry,
          thresholdAngle,
        );
        // Create a wireframe material
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: "Red",
          linewidth: 1,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -10,
          polygonOffsetUnits: 1,
        });
        // Create the wireframe mesh
        const wireframe = new THREE.LineSegments(
          wireframeGeometry,
          wireframeMaterial,
        );
        wireframe.layers.set(1);
        wireframeRef.current = wireframe;
      }
    });
    brainRef.current = brain;
  }, [brain]);

  return (
    <>
      {/* brainRef.current && <primitive object={brainRef.current} /> */}
      {wireframeRef.current && <primitive object={wireframeRef.current} />}
    </>
  );
};

export default Brain;
