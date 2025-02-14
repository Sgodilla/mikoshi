"use client";

import React, { useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Brain from "./Brain";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/Addons.js";
import GradientShader from "./GradientShader";

const BrainScene = () => {
  const { gl, scene, camera, size } = useThree();

  // Create the effect composer
  const composer = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    const composer = new EffectComposer(gl, renderTarget);
    composer.addPass(new RenderPass(scene, camera));

    // Add the gradient shader pass
    const gradientPass = new ShaderPass(GradientShader);
    gradientPass.uniforms.color1.value = new THREE.Color("Black"); // Start color
    gradientPass.uniforms.color2.value = new THREE.Color("Blue"); // Second color
    gradientPass.uniforms.color3.value = new THREE.Color("Red"); // End color
    composer.addPass(gradientPass);

    return composer;
  }, [gl, scene, camera, size]);

  useFrame(() => {
    composer.render();
  }, 1);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, 5]} />
      <directionalLight position={[5, 5, -5]} />
      <Brain />
      <OrbitControls />
    </>
  );
};

export default BrainScene;
