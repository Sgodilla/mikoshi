// AsciiPostProcessShader.ts
import * as THREE from "three";

export const AsciiPostProcessShader = {
  uniforms: {
    tDiffuse: { value: null }, // Render target texture from pass one.
    resolution: {
      value: new THREE.Vector2(
        globalThis?.window?.innerWidth,
        globalThis?.window?.innerHeight,
      ),
    },
    asciiTiling: { value: 32.0 }, // Adjust cell density.
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float asciiTiling;
    varying vec2 vUv;

    // Map brightness to one of five quantized levels.
    float quantize(float brightness) {
      return floor(brightness * 5.0) / 5.0;
    }

    // Create a simple procedural pattern based on cell UV and quantized brightness.
    float asciiPattern(vec2 cellUV, float brightness) {
      float pattern = 0.0;
      if(brightness < 0.2){
        float d = distance(cellUV, vec2(0.5));
        pattern = smoothstep(0.3, 0.25, d);
      } else if(brightness < 0.4){
        pattern = smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
      } else if(brightness < 0.6){
        pattern = smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
      } else if(brightness < 0.8){
        float v = smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
        float h = smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
        pattern = max(v, h);
      } else {
        float v = smoothstep(0.45, 0.4, abs(cellUV.x - 0.5));
        float h = smoothstep(0.45, 0.4, abs(cellUV.y - 0.5));
        pattern = max(v, h);
      }
      return pattern;
    }
    
    void main(){
      // Sample the offscreen rendered scene.
      vec4 sceneColor = texture2D(tDiffuse, vUv);
      // Convert to grayscale brightness.
      float brightness = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));
      float quantized = quantize(brightness);

      // Determine the cell UV based on asciiTiling.
      vec2 screenUV = gl_FragCoord.xy / resolution;
      vec2 cellUV = fract(screenUV * asciiTiling);

      // Apply the procedural ASCII pattern.
      float pattern = asciiPattern(cellUV, quantized);
      
      // Mix between background (white) and ink (black) based on the pattern.
      vec3 finalColor = mix(vec3(1.0), vec3(0.0), pattern);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
