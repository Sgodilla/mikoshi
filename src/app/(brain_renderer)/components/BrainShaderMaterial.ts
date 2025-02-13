// BrainShaderMaterial.ts
import * as THREE from "three";

export const BrainShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    asciiTexture: { value: null },
    asciiCols: { value: 16.0 },
    asciiRows: { value: 16.0 },
    lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
  },
  vertexShader: `
    attribute vec3 barycentric;
    varying vec2 vUv;
    varying vec3 vBary;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vBary = barycentric;
      // Transform the normal to view space for lighting
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D asciiTexture;
    uniform float asciiCols;
    uniform float asciiRows;
    uniform vec3 lightDirection;
    varying vec2 vUv;
    varying vec3 vBary;
    varying vec3 vNormal;
    
    // Compute an edge factor based on barycentrics
    float edgeFactor() {
      vec3 d = fwidth(vBary);
      vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vBary);
      return min(min(a3.x, a3.y), a3.z);
    }
    
    void main() {
      // --- ASCII Shading ---
      float diffuse = max(dot(vNormal, normalize(lightDirection)), 0.0);
      float numChars = asciiCols * asciiRows;
      float index = floor(diffuse * (numChars - 1.0));
      float col = mod(index, asciiCols);
      float row = floor(index / asciiCols);
      vec2 cellSize = vec2(1.0 / asciiCols, 1.0 / asciiRows);
      vec2 asciiUV = vec2(col, row) * cellSize + vUv * cellSize;
      vec4 asciiColor = texture2D(asciiTexture, asciiUV);
      
      // --- Wireframe Overlay ---
      float edge = 1.0 - edgeFactor();
      float wire = smoothstep(0.0, 0.02, edge);
      vec4 wireColor = vec4(1.0);
      
      // --- Combine ---
      gl_FragColor = mix(asciiColor, wireColor, wire);
    }
  `,
  transparent: true,
});
