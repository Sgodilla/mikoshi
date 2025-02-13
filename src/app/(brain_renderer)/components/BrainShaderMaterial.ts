// BrainShaderMaterial.ts
import * as THREE from "three";

export const BrainShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    // asciiTiling now defines how many ASCII “cells” span the screen.
    asciiTiling: { value: 32.0 },
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
      // Transform the normal to view space
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec2 resolution;
    uniform float asciiTiling;
    uniform vec3 lightDirection;
    
    varying vec2 vUv;
    varying vec3 vBary;
    varying vec3 vNormal;
    
    // Returns an edge factor for wireframe overlay using the barycentrics.
    float edgeFactor() {
      vec3 d = fwidth(vBary);
      vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vBary);
      return min(min(a3.x, a3.y), a3.z);
    }
    
    // Procedural ASCII pattern function.
    // Depending on the quantized brightness (0.0–1.0) we choose a different pattern.
    // Each cell (in screen space) will output a simple “character” shape.
    float asciiPattern(vec2 cellUV, float brightness) {
      if (brightness < 0.2) {
        // Very low brightness: a small dot in the center.
        float d = distance(cellUV, vec2(0.5));
        return smoothstep(0.3, 0.25, d);
      } else if (brightness < 0.4) {
        // Slightly brighter: a vertical line.
        return smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
      } else if (brightness < 0.6) {
        // Mid brightness: a horizontal line.
        return smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
      } else if (brightness < 0.8) {
        // Brighter: a cross pattern.
        float v = smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
        float h = smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
        return max(v, h);
      } else {
        // Highest brightness: a dense grid.
        float v = smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
        float h = smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
        return max(v, h);
      }
    }
    
    void main() {
      // Compute per-fragment diffuse lighting.
      float diffuse = max(dot(vNormal, normalize(lightDirection)), 0.0);
      
      // Use screen-space coordinates (gl_FragCoord) to determine our ASCII cell.
      vec2 screenUV = gl_FragCoord.xy / resolution;
      vec2 cellUV = fract(screenUV * asciiTiling);
      
      // Quantize the diffuse light into five levels.
      float quantized = floor(diffuse * 5.0) / 5.0;
      // Generate an ASCII-like pattern for this cell based on the quantized brightness.
      float pattern = asciiPattern(cellUV, quantized);
      
      // Create the ASCII color: here we mix between white (background) and black (ink)
      // based on the pattern.
      vec3 charColor = mix(vec3(1.0), vec3(0.0), pattern);
      
      // --- Wireframe Overlay ---
      float edge = 1.0 - edgeFactor();
      float wire = smoothstep(0.0, 0.02, edge);
      vec3 wireColor = vec3(1.0);
      
      // Combine the ASCII effect with the wireframe overlay.
      vec3 finalColor = mix(charColor, wireColor, wire);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  transparent: true,
});
