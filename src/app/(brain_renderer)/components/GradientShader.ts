import * as THREE from "three";

const GradientShader = {
  uniforms: {
    tDiffuse: { value: null },
    color1: { value: new THREE.Color("#8e0b51") }, // Start color
    color2: { value: new THREE.Color("#ff8c00") }, // Second color
    color3: { value: new THREE.Color("#ffd700") }, // Third color
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
    uniform vec3 color3;
    uniform vec3 color4;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      vec3 gradientColor;
      if (luminance < 0.5) {
        gradientColor = mix(color1, color2, luminance / 0.5);
      } else {
        gradientColor = mix(color2, color3, (luminance - 0.5) / 0.5);
      }
      gl_FragColor = vec4(gradientColor, texel.a);
    }
  `,
};

export default GradientShader;
