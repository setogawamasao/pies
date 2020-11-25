import * as THREE from "three";
import { BaseApp } from "./base";
import { OrbitControls } from "./jsm/controls/OrbitControls";

class MyApp extends BaseApp {
  // X:赤 Y:緑 Z:青
  public axesHelper = new THREE.AxesHelper(10000);
  public controls = new OrbitControls(this.Camera, this.Renderer.domElement);
  public geometryBox = new THREE.BoxGeometry(50, 50, 50);
  public materialBox = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  public box = new THREE.Mesh(this.geometryBox, this.materialBox);
  public geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  public texture = new THREE.TextureLoader().load(`./build/textures/${4}.jpg`);
  public material = new THREE.MeshBasicMaterial({ map: this.texture });
  public mesh = new THREE.Mesh(this.geometry, this.material);
  public speed = 0;
  public change = false;
  public touchStartPoint = new THREE.Vector2();
  public isMove = false;
  public velocity = 0.001;
  //========================
  public plane = new THREE.Plane();
  public rayCaster = new THREE.Raycaster();
  public touchPoint = new THREE.Vector2();
  public touchPointRot = new THREE.Vector2();
  public offset = new THREE.Vector3();
  public intersection = new THREE.Vector3();
  // オブジェクトを格納する配列
  public objects = new Array<THREE.Object3D>();
  public isTouchedTarget = false;

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
      `./build/textures/${this.getRandomNumber()}.jpg`
    );
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    const loader1 = new THREE.FontLoader();
    loader1.load("./build/fonts/helvetiker_regular.typeface.json", (font) => {
      const matLite = new THREE.MeshBasicMaterial({
        color: 0xb7d4db,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      const message = "PIs";
      //const shapes = font.generateShapes(message, 70);
      const geometry = new THREE.TextBufferGeometry(message, {
        font: font,
        size: 70,
        height: 5,
      });
      geometry.computeBoundingBox();
      const xMid =
        -(geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2;

      geometry.translate(xMid, 0, 0);
      const text = new THREE.Mesh(geometry, matLite);
      text.rotateY(Math.PI / 2);
      this.Scene.add(text);
      this.objects.push(text);
    });

    const loader2 = new THREE.FontLoader();
    loader2.load("./build/fonts/helvetiker_regular.typeface.json", (font) => {
      const matLite = new THREE.MeshBasicMaterial({
        color: 0xf6b7b9,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      const message = "SNS that shares space";
      const shapes = font.generateShapes(message, 15);
      //const geometry = new THREE.ShapeBufferGeometry(shapes);
      const geometry = new THREE.TextBufferGeometry(message, {
        font: font,
        size: 18,
        height: 5,
      });
      geometry.computeBoundingBox();
      const xMid =
        -(geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2;
      const yTop = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

      geometry.translate(xMid, -(yTop + 5), 0);
      const text = new THREE.Mesh(geometry, matLite);
      text.rotateY(Math.PI / 2);
      this.Scene.add(text);
      this.objects.push(text);
    });

    this.Scene.add(this.Light);
    this.Scene.add(this.box);
    //this.Scene.add(this.mesh);
    //this.Scene.add(this.axesHelper);
    this.speed += 0.001;

    this.objects.push();
  }

  public touchStart(event: TouchEvent): void {
    console.log("touch start");
    // 平行移動させる平面の法線ベクトルをカメラの方向ベクトルに合わせる
    this.Camera.getWorldDirection(this.plane.normal);
    // 画面上で指を動かした量から、三次元空間の移動量を決定する
    this.touchPoint.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
    this.touchPoint.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
    // タッチ点とカメラのレイキャストを設定
    this.rayCaster.setFromCamera(this.touchPoint, this.Camera);

    // オブジェクト群から、マウスとカメラの方向ベクトルの先にあるオブジェクト(平行移動させる物体)を抽出する。
    const intersects = this.rayCaster.intersectObjects(this.objects);

    // マウスとカメラの方向ベクトルの先にオブジェクトがあったとき
    if (intersects.length > 0) {
      this.velocity = 1;
      this.isTouchedTarget = true;
      console.log("touched");
    }

    this.controls.enabled = false;
  }

  public touchMove(event: TouchEvent): void {
    console.log("move");
    this.isMove = true;
    this.controls.enabled = true;
  }

  public touchEnd(event: TouchEvent): void {
    console.log("touch end");
    this.velocity = 0.001;
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
    if (this.change && this.isTouchedTarget) {
      console.log("image change");
      this.Scene.remove(this.mesh);
      this.texture = new THREE.TextureLoader().load(
        `./build/textures/${this.getRandomNumber()}.jpg`
      );
      this.material = new THREE.MeshBasicMaterial({ map: this.texture });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.Scene.add(this.mesh);

      this.change = false;
      this.isTouchedTarget = false;
    }

    this.speed += this.velocity;

    this.mesh.rotation.set(0, this.speed, 0);
  }

  public getRandomNumber = (): string => {
    const randomNumber = Math.floor(Math.random() * 8) + 1;
    return String(randomNumber);
  };
}

const app = new MyApp();
