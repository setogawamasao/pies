import * as THREE from "three";
import { OrbitControls } from "../jsm/controls/OrbitControls";

export const setControls = (
  controls: OrbitControls,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  update: () => void
) => {
  controls.maxPolarAngle = Math.PI;
  controls.minDistance = 0.1;
  controls.maxDistance = 600;
  controls.addEventListener("change", update);
};
