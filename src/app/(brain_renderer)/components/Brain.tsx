// Brain.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { TextureLoader } from "three";
import * as THREE from "three";
import { BrainShaderMaterial } from "./BrainShaderMaterial";
import { addBarycentrics } from "./addBarycentrics";

const Brain: React.FC = () => {
  // 1. Load your OBJ
  const brain = useLoader(OBJLoader, "/brain.obj");

  // 2. Load the ASCII atlas
  const asciiTexture = useLoader(TextureLoader, "/ascii_atlas.png");

  // 3. Configure texture and set shader uniforms
  useEffect(() => {
    // For a pixelated, sharp look:
    asciiTexture.magFilter = THREE.NearestFilter;
    asciiTexture.minFilter = THREE.NearestFilter;

    BrainShaderMaterial.uniforms.asciiTexture.value = asciiTexture;
    BrainShaderMaterial.uniforms.asciiCols.value = 16.0; // or your grid size
    BrainShaderMaterial.uniforms.asciiRows.value = 16.0;
  }, [asciiTexture]);

  // 4. Add barycentrics & apply the BrainShaderMaterial to each mesh
  useMemo(() => {
    addBarycentrics(brain);
    brain.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = BrainShaderMaterial;
      }
    });
  }, [brain]);

  return <primitive object={brain} />;
};

export default Brain;
