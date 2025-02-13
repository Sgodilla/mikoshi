// Brain.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { TextureLoader } from "three";
import * as THREE from "three";
import { BrainShaderMaterial } from "./BrainShaderMaterial";
import { addBarycentrics } from "./addBarycentrics";

const Brain: React.FC = () => {
  // Load your brain model.
  const brain = useLoader(OBJLoader, "/brain.obj");
  // Load your ASCII texture.
  const asciiTexture = useLoader(TextureLoader, "/ascii_atlas.png");

  // Set texture filters for a crisp terminal effect.
  useEffect(() => {
    asciiTexture.magFilter = THREE.NearestFilter;
    asciiTexture.minFilter = THREE.NearestFilter;
    BrainShaderMaterial.uniforms.asciiTexture.value = asciiTexture;
    BrainShaderMaterial.uniforms.asciiCols.value = 16.0;
    BrainShaderMaterial.uniforms.asciiRows.value = 16.0;
    BrainShaderMaterial.uniforms.asciiTiling.value = 32.0; // Adjust for desired cell size.
  }, [asciiTexture]);

  // Update resolution uniform from the canvas size.
  const { size } = useThree();
  useEffect(() => {
    BrainShaderMaterial.uniforms.resolution.value.set(size.width, size.height);
  }, [size]);

  // Add barycentrics and assign the shader material.
  useMemo(() => {
    addBarycentrics(brain);
    brain.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        (child as THREE.Mesh).material = BrainShaderMaterial;
      }
    });
  }, [brain]);

  return <primitive object={brain} />;
};

export default Brain;
