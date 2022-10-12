import * as Three from 'three';
import { Planet } from '../objects/planet';

export class Viewport {
    camera: Three.PerspectiveCamera;
    scene: Three.Scene;
    renderer: Three.WebGLRenderer;

    readonly fov: number = 75;

    public constructor() {
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.01;
        const far = 10.0;

        this.camera = new Three.PerspectiveCamera(this.fov, aspect, near, far);
        this.scene = new Three.Scene();
        this.renderer = new Three.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.onTick);

        this.camera.position.z = 1;
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onResize, false);

        this.onInit();
        this.onResize();
    }

    /// Scene lifetime.
    /// ==============================

    onInit = () => {
        this.setupCamera();
        this.setupLighting();
        this.setupGeometry();
    }

    onResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    onTick = (delta: number) => {
        this.renderer.render(this.scene, this.camera);
    }

    /// Internal implementation.
    /// ==============================

    setupCamera = () => {
        this.camera.position.z += 1;
    }

    setupLighting = () => {
        const ambient = new Three.AmbientLight(0xffffff, 0.01);
        this.scene.add(ambient);

        const central = new Three.PointLight(0xffffff, 0.5, 100);
        central.position.set(0, 0, 0);
        this.scene.add(central);
    }

    setupGeometry = () => {

        // central star : body
        {
            const phongParams = {
                emissive: new Three.Color(0xffff44),
                emissiveIntensity: 1.0
            };

            const geometry = new Three.SphereGeometry(0.1, 32, 32);
            const material = new Three.MeshPhongMaterial(phongParams);
            const mesh = new Three.Mesh(geometry, material);
            this.scene.add(mesh);
        }

        // central star : light
        {
            const light = new Three.PointLight(0xffff44, 1.0, 4);
            this.scene.add(light);
        }

        const planets = [
            new Planet(0x800505, false, 0.1, 0.55, 0.0),
            new Planet(0x00027c, false, 0.075, 1.1, 0.0),
            new Planet(0x037801, true, 0.15, 2.0, 0.0)
        ];

        for (const planet of planets) {
            planet.addToViewport(this);
        }
    }
}
