"use client";

// AsciiEffect.tsx
import React, { useMemo, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AsciiPostProcessShader } from "./AsciiPostProcessShader";

const AsciiEffect: React.FC<{ renderTarget: THREE.WebGLRenderTarget }> = ({
  renderTarget,
}) => {
  const { gl, size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Create an orthographic camera and a scene for the postprocessing quad.
  const orthoCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );
  const postScene = useMemo(() => new THREE.Scene(), []);

  useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AsciiPostProcessShader.uniforms),
      vertexShader: AsciiPostProcessShader.vertexShader,
      fragmentShader: AsciiPostProcessShader.fragmentShader,
    });
    material.uniforms.tDiffuse.value = renderTarget.texture;
    material.uniforms.resolution.value.set(size.width, size.height);
    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    postScene.add(mesh);
    return mesh;
  }, [postScene, renderTarget.texture, size]);

  useEffect(() => {
    // Update resolution on resize.
    materialRef.current!.uniforms.resolution.value.set(size.width, size.height);
  }, [size]);

  useFrame(() => {
    gl.setRenderTarget(null); // Render to screen.
    gl.render(postScene, orthoCamera);
  });

  return null;
};

export default AsciiEffect;
