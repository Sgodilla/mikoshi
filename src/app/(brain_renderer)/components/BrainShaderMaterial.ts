import * as THREE from "three";

export const BrainShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    asciiTexture: { value: null }, // Set this to your generated or loaded texture
    asciiCols: { value: 16.0 }, // Number of columns in your ASCII atlas
    asciiRows: { value: 16.0 }, // Number of rows in your ASCII atlas
    asciiTiling: { value: 16.0 }, // How many ASCII cells to tile across the screen
    lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
    resolution: { value: new THREE.Vector2(1024, 1024) }, // default; update in your component
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
    uniform float asciiTiling;
    uniform vec3 lightDirection;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec3 vBary;
    varying vec3 vNormal;
    
    // Compute an edge factor based on barycentrics for wireframe overlay
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
      
      // Use screen-space coordinates to create the terminal-like grid.
      vec2 screenUV = gl_FragCoord.xy / resolution;
      // Tile the screen space (repeat pattern) over a fixed number of cells.
      vec2 repeatedUV = fract(screenUV * asciiTiling);
      
      // Compute a rotation angle from the normal (using x and y components).
      // This rotates the ASCII cell based on the triangle's orientation.
      float angle = atan(vNormal.y, vNormal.x);
      float cosA = cos(angle);
      float sinA = sin(angle);
      vec2 rotatedUV = vec2(
        repeatedUV.x * cosA - repeatedUV.y * sinA,
        repeatedUV.x * sinA + repeatedUV.y * cosA
      );
      
      vec2 cellSize = vec2(1.0 / asciiCols, 1.0 / asciiRows);
      // Determine the final UV into the ASCII atlas.
      vec2 asciiUV = vec2(col, row) * cellSize + rotatedUV * cellSize;
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
