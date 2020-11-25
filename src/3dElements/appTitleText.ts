import * as THREE from "three";

export const setAppTitleText = (
  scene: THREE.Scene,
  objects: Array<THREE.Object3D>
) => {
  const loader = new THREE.FontLoader();
  loader.load("./build/fonts/helvetiker_regular.typeface.json", (font) => {
    // upper message1
    const message1 = "PIs";
    const geometry1 = new THREE.TextBufferGeometry(message1, {
      font: font,
      size: 70,
      height: 5,
    });
    geometry1.computeBoundingBox();
    const xMid1 =
      -(geometry1.boundingBox.max.x - geometry1.boundingBox.min.x) / 2;

    geometry1.translate(xMid1, 0, 0);
    const matLite1 = new THREE.MeshBasicMaterial({
      color: 0xb7d4db,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const text1 = new THREE.Mesh(geometry1, matLite1);
    text1.rotateY(Math.PI / 2);
    scene.add(text1);
    objects.push(text1);

    // lower message1
    const message2 = "SNS that shares space";
    const shapes2 = font.generateShapes(message2, 15);
    const geometry2 = new THREE.TextBufferGeometry(message2, {
      font: font,
      size: 18,
      height: 5,
    });
    geometry2.computeBoundingBox();
    const xMid2 =
      -(geometry2.boundingBox.max.x - geometry2.boundingBox.min.x) / 2;
    const yTop = geometry2.boundingBox.max.y - geometry2.boundingBox.min.y;

    geometry2.translate(xMid2, -(yTop + 5), 0);
    const matLite2 = new THREE.MeshBasicMaterial({
      color: 0xf6b7b9,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const text2 = new THREE.Mesh(geometry2, matLite2);
    text2.rotateY(Math.PI / 2);
    scene.add(text2);
    objects.push(text2);
  });
};
