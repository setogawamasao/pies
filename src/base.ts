import * as THREE from "three";
import { Scene } from "three";

export class BaseApp {
  //Utils
  public get Width(): number {
    return window.innerWidth;
  }
  public get Height(): number {
    return window.innerHeight;
  }
  public get Aspect(): number {
    return this.Width / this.Height;
  }

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private light: THREE.DirectionalLight;

  public get Renderer(): THREE.WebGLRenderer {
    return this.renderer;
  }
  public get Scene(): THREE.Scene {
    return this.scene;
  }
  public get Camera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public get Light(): THREE.DirectionalLight {
    return this.light;
  }

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.camera = new THREE.PerspectiveCamera();
    this.light = new THREE.DirectionalLight();
    this.scene = new THREE.Scene();

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

  private onLoaded(): void {
    this.renderer.domElement.setAttribute("id", "threejs_canvas");
    document.body.appendChild(this.renderer.domElement);

    const mainLoop = (): void => {
      requestAnimationFrame(mainLoop);
      this.Update();
      this.renderer.render(this.scene, this.camera);
    };

    this.Setup();
    mainLoop();
  }

  private onResized(): void {
    this.renderer.setSize(this.Width, this.Height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.aspect = this.Width / this.Height;
    this.camera.updateProjectionMatrix();
  }

  public Setup(): void {}

  public Update(): void {}

  public touchStart(event: TouchEvent): void {}
  public touchMove(event: TouchEvent): void {}
  public touchEnd(event: TouchEvent): void {}
}
