import * as THREE from "three";

export const setCamera = (camera: THREE.PerspectiveCamera) => {
  camera.fov = 45;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.near = 1;
  camera.far = 1100;
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
};
