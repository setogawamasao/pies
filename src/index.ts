import * as THREE from "three";
import { BaseApp } from "./base";
import { OrbitControls } from "./jsm/controls/OrbitControls";

class MyApp extends BaseApp {
  // red bule green
  // X:赤 Y:緑 Z:青
  public axesHelper = new THREE.AxesHelper(10000);
  public controls = new OrbitControls(this.Camera, this.Renderer.domElement);
  public geometryBox = new THREE.BoxGeometry(10, 50, 50);
  public materialBox = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  public box = new THREE.Mesh(this.geometryBox, this.materialBox);
  public showImage = "R0010002.JPG";
  public geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  public texture = new THREE.TextureLoader().load(
    `./build/textures/${this.showImage}`
  );
  public material = new THREE.MeshBasicMaterial({ map: this.texture });
  public mesh = new THREE.Mesh(this.geometry, this.material);
  public speed = 0;
  public change = false;
  public touchStartPoint = new THREE.Vector2();
  public isMove = false;

  public Setup(): void {
    console.log("This is Setup.");
    this.setControls();

    this.Renderer.setSize(this.Width, this.Height);
    this.Renderer.setPixelRatio(window.devicePixelRatio);
    this.Renderer.setClearColor(0xffffff);

    this.Camera.fov = 90;
    this.Camera.aspect = this.Aspect;
    this.Camera.near = 1;
    this.Camera.far = 1100;
    this.Camera.updateProjectionMatrix();
    this.Camera.position.set(400, 0, 0);
    this.Camera.lookAt(0, 0, 0);

    this.Light.position.set(1, 1, 1);
    this.Light.color.set(0xffffff);
    this.geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    this.geometry.scale(-1, 1, 1);

    this.box.position.set(0, 0, 0);

    this.texture = new THREE.TextureLoader().load(
      `./build/textures/${this.showImage}`
    );
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.Scene.add(this.Light);
    this.Scene.add(this.box);
    this.Scene.add(this.mesh);
    this.Scene.add(this.axesHelper);
  }

  public touchStart(event: TouchEvent): void {
    this.controls.enabled = false;
  }

  public touchMove(event: TouchEvent): void {
    this.isMove = true;
    this.controls.enabled = true;
  }

  public touchEnd(event: TouchEvent): void {
    this.controls.enabled = true;
    if (!this.isMove) {
      this.change = !this.change;
    }
    this.isMove = false;
  }

  private setControls = () => {
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 600;
    this.controls.addEventListener("change", this.Update);
  };

  public Update(): void {
    //console.log(this.change);
    if (this.change) {
      this.Scene.remove(this.mesh);
      this.texture = new THREE.TextureLoader().load(
        `./build/textures/${this.showImage}`
      );
      this.material = new THREE.MeshBasicMaterial({ map: this.texture });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.Scene.add(this.mesh);
      this.change = false;
      if (this.showImage === "R0010002.JPG") {
        this.showImage = "R0010003.JPG";
      } else {
        this.showImage = "R0010002.JPG";
      }
    }

    this.speed += 0.001;
    this.mesh.rotation.set(0, this.speed, 0);
  }
}

const app = new MyApp();
