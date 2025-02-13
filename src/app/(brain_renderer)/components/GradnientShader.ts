// GradientShader.js
import * as THREE from "three";

const GradientShader = {
  uniforms: {
    tDiffuse: { value: null },
    color1: { value: new THREE.Color("#000000") }, // Start color
    color2: { value: new THREE.Color("#ffffff") }, // End color
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      vec3 gradientColor = mix(color1, color2, luminance);
      gl_FragColor = vec4(gradientColor, texel.a);
    }
  `,
};

export default GradientShader;
