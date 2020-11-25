import * as THREE from "three";

export const setSphere = (sphere: THREE.Mesh, scene: THREE.Scene) => {
  const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);
  const texture = new THREE.TextureLoader().load(
    `./build/textures/${getRandomNumber()}.jpg`
  );
  const material = new THREE.MeshBasicMaterial({ map: texture });
  sphere.geometry = geometry;
  sphere.material = material;
  scene.add(sphere);
};

const getRandomNumber = (): string => {
  const randomNumber = Math.floor(Math.random() * 8) + 1;
  return String(randomNumber);
};
