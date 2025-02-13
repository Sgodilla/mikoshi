import * as THREE from "three";

/**
 * Traverses the provided object and adds a "barycentric" attribute to all mesh geometries.
 * Each triangle gets barycentrics: (1,0,0), (0,1,0), (0,0,1).
 */
export function addBarycentrics(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      const count = geometry.attributes.position.count;
      const barycentrics: number[] = [];
      // Assume geometry is composed of triangles
      for (let i = 0; i < count; i += 3) {
        barycentrics.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
      }
      geometry.setAttribute(
        "barycentric",
        new THREE.BufferAttribute(new Float32Array(barycentrics), 3),
      );
    }
  });
}
