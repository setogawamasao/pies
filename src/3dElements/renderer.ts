import * as THREE from "three";

export const setRenderer = (renderer: THREE.WebGLRenderer) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
};
