import * as THREE from "three";

const GradientShader = {
  uniforms: {
    tDiffuse: { value: null },
    color1: { value: new THREE.Color("#8e0b51") }, // Start color
    color2: { value: new THREE.Color("#ff8c00") }, // Middle color
    color3: { value: new THREE.Color("#ffd700") }, // End color
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

    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));

      // t1 transitions smoothly from 0.0 to 1.0 as luminance goes from 0.0 to 0.5
      float t1 = smoothstep(0.0, 0.5, luminance);
      // c12 moves from color1 to color2 using t1
      vec3 c12 = mix(color1, color2, t1);

      // t2 transitions smoothly from 0.0 to 1.0 as luminance goes from 0.5 to 1.0
      float t2 = smoothstep(0.5, 1.0, luminance);
      // c23 moves from color2 to color3 using t2
      vec3 c23 = mix(color2, color3, t2);

      // Finally, blend between c12 (the lower half) and c23 (the upper half)
      vec3 gradientColor = mix(c12, c23, t2);

      gl_FragColor = vec4(gradientColor, texel.a);
    }
  `,
};

export default GradientShader;
