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
        // Create a custom shader material
        const material = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * vec4(vPosition, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform vec3 cameraPosition;
            void main() {
              // Calculate the dot product between the normal and the view direction
              float dotProduct = dot(vNormal, normalize(vPosition));
              // Discard fragments facing away from the camera or occluded
              if (dotProduct > 0.0) discard;
              gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color for front-facing edges
            }
          `,
          side: THREE.DoubleSide, // Ensure both sides are processed
          wireframe: true, // Enable wireframe mode
        });

        // Apply the custom material to the mesh
        child.material = material;
      }
    });
  }, [brain]);

  return <primitive object={brain} />;
};

export default BrainWireframe;
