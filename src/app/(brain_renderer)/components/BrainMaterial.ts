import * as THREE from "three";

// Create a MeshStandardMaterial as our base
export const brainMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.5,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
  side: THREE.FrontSide,
});

// Modify the material using onBeforeCompile to add our gradient effect on top
brainMaterial.onBeforeCompile = (shader) => {
  // Inject our custom uniforms into the shader's uniform list
  shader.uniforms.color1 = { value: new THREE.Color("Black") };
  shader.uniforms.color2 = { value: new THREE.Color("#c40b0b") };
  shader.uniforms.color3 = { value: new THREE.Color("Red") };
  shader.uniforms.gradientOpacity = { value: 1.0 };

  // Prepend uniform declarations to the fragment shader code
  shader.fragmentShader =
    `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform float gradientOpacity;
  ` + shader.fragmentShader;

  // Inject our gradient effect after the dithering chunk
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `
      #include <dithering_fragment>
      // Compute the luminance from the outgoing light (post lighting computation)
      float luminance = dot(outgoingLight, vec3(0.299, 0.587, 0.114));
      // Compute interpolation factors based on luminance
      float t1 = smoothstep(0.0, 0.5, luminance);
      vec3 c12 = mix(color1, color2, t1);
      float t2 = smoothstep(0.5, 1.0, luminance);
      vec3 c23 = mix(color2, color3, t2);
      // Blend the gradient based on the luminance value
      vec3 gradientColor = mix(c12, c23, t2);
      // Blend the gradient with the original outgoingLight
      outgoingLight = mix(outgoingLight, gradientColor, gradientOpacity);
      gl_FragColor = vec4(outgoingLight, diffuseColor.a);
    `,
  );
};
