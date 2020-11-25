import * as THREE from "three";

export const setLight = (scene: THREE.Scene) => {
  const light = new THREE.DirectionalLight();
  light.position.set(1, 1, 1);
  light.color.set(0xffffff);
  scene.add(light);
};
