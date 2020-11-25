import * as THREE from "three";

export const setAxis = (scene: THREE.Scene) => {
  const axes = new THREE.AxesHelper(1000); // X:赤 Y:緑 Z:青
  scene.add(axes);
};
