import * as THREE from "three";
import { OrbitControls } from "./jsm/controls/OrbitControls";
import { setRenderer } from "./3dElements/renderer";
import { setCamera } from "./3dElements/camera";
import { setControls } from "./3dElements/controls";
import { setLight } from "./3dElements/light";
import { setAxis } from "./3dElements/axis";
import { setSphere } from "./3dElements/imageSphere";
import { setAppTitleText } from "./3dElements/appTitleText";

class MyApp {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  // 360 sphere
  imageSphere = new THREE.Mesh();
  sphereRotationY = 0;
  sphereVelocity = 0.001;
  changeImageObjects = new Array<THREE.Object3D>();
  isChangeImageObject = false;

  constructor() {
    window.addEventListener("DOMContentLoaded", () => {
      this.onLoaded();
    });
    window.addEventListener("resize", () => {
      this.onResized();
    });
    window.addEventListener("touchstart", (event: TouchEvent) => {
      this.touchStart(event);
    });
    window.addEventListener("touchmove", (event: TouchEvent) => {
      this.touchMove(event);
    });
    window.addEventListener("touchend", (event: TouchEvent) => {
      this.touchEnd(event);
    });
  }

  onLoaded = (): void => {
    document.querySelector("#canvas")?.appendChild(this.renderer.domElement);
    this.setup();
    this.mainLoop();
  };

  mainLoop = (): void => {
    requestAnimationFrame(this.mainLoop);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  onResized = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  setup = (): void => {
    setRenderer(this.renderer);
    setCamera(this.camera);
    setLight(this.scene);
    setControls(this.controls, this.camera, this.renderer, this.update);
    setAxis(this.scene);
    setSphere(this.imageSphere, this.scene);
    setAppTitleText(this.scene, this.changeImageObjects);
    // ============debug============
    // const geometryBox = new THREE.BoxGeometry(50, 50, 50);
    // const materialBox = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // const box = new THREE.Mesh(geometryBox, materialBox);
    // this.scene.add(box);
    // ============debug============
  };

  touchStart = (event: TouchEvent): void => {
    // 平行移動させる平面の法線ベクトルをカメラの方向ベクトルに合わせる
    const plane = new THREE.Plane();
    this.camera.getWorldDirection(plane.normal);
    // 画面上で指を動かした量から、三次元空間の移動量を決定する
    const touchPoint = new THREE.Vector2();
    touchPoint.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
    touchPoint.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
    // タッチ点とカメラのレイキャストを設定
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(touchPoint, this.camera);
    // オブジェクト群から、マウスとカメラの方向ベクトルの先にあるオブジェクト(平行移動させる物体)を抽出する。
    const intersects = rayCaster.intersectObjects(this.changeImageObjects);
    // マウスとカメラの方向ベクトルの先にオブジェクトがあったとき
    if (intersects.length > 0) {
      console.log("exist object");
      this.sphereVelocity = 1;
      this.isChangeImageObject = true;
    }
    this.controls.enabled = false;
  };

  touchMove = (event: TouchEvent): void => {
    this.controls.enabled = true;
  };

  touchEnd = (event: TouchEvent): void => {
    this.sphereVelocity = 0.001;
    this.controls.enabled = true;
  };

  update = (): void => {
    // change image
    if (this.isChangeImageObject) {
      console.log("image change");
      this.scene.remove(this.imageSphere);
      setSphere(this.imageSphere, this.scene);
      this.isChangeImageObject = false; // reset flag
    }
    // rotate image sphere
    this.sphereRotationY += this.sphereVelocity;
    this.imageSphere.rotation.set(0, this.sphereRotationY, 0);
  };
}

const app = new MyApp();
