import * as Three from 'three';
import { Mesh } from 'three';

class Planet {
    baseColor: Three.Color;
    hasRings: boolean;
    bodyRadius: number;
    orbitRadius: number;
    orbitOffset: number;

    public constructor(
        color: Three.Color,
        rings: boolean,
        radius: number,
        orbit: number, offset: number)
    {
        this.baseColor = color;
        this.hasRings = rings;
        this.bodyRadius = radius;
        this.orbitRadius = orbit;
        this.orbitOffset = offset;
    }

    public addToViewport = (viewport: Viewport) => {
        const pos = this.calcPositionVector();

        const body = this.makeBody();
        body.position.set(pos.x, pos.y, pos.z);
        viewport.scene.add(body);

        if (this.hasRings) {
            const rings = this.makeRings();
            rings.position.set(pos.x, pos.y, pos.z);
            viewport.scene.add(rings);
        }
    }

    private makeBody = () : Three.Mesh => {
        const geometry = new Three.SphereGeometry(this.bodyRadius, 64, 64);
        const material = new Three.MeshPhongMaterial({
            emissive: this.baseColor,
            emissiveIntensity: 0.6
        });
        const mesh = new Three.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return mesh;
    }

    private makeRings = () : Three.Mesh => {
        const innerRadius = this.bodyRadius * 1.1;
        const outerRadius = this.bodyRadius * 1.5;
        const emissiveColor = this.baseColor;

        const geometry = new Three.RingGeometry(innerRadius, outerRadius, 30, 1);
        const material = new Three.MeshPhongMaterial({
            emissive: emissiveColor,
            emissiveIntensity: 0.3
        });
        const mesh = new Three.Mesh(geometry, material);

        mesh.rotateX(1);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return mesh;
        
    }

    private calcPositionVector = () : Three.Vector3 => {
        return new Three.Vector3(this.orbitRadius, 0.0, 0.0);
    }
}

class Viewport {
    camera: Three.PerspectiveCamera;
    scene: Three.Scene;
    renderer: Three.WebGLRenderer;

    fov: number = 75;

    public constructor() {
        this.onInit = this.onInit.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onTick = this.onTick.bind(this);

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

    public onInit() {
        this.setupCamera();
        this.setupLighting();
        this.setupGeometry();
    }

    public onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public onTick(time: number) {
        this.renderer.render(this.scene, this.camera);
    }

    /// Internal implementation.
    /// ==============================

    setupCamera = () => {
        this.camera.position.z += 1;

        // this.camera.rotation.x -= 0.4;
        // this.camera.position.y += 0.4;

        // this.camera.position.x -= 0.2;
        // this.camera.rotation.y -= 0.2;
    }

    setupLighting = () => {
        const ambient = new Three.AmbientLight(0xffffff, 0.01);
        this.scene.add(ambient);

        const central = new Three.PointLight(0xffffff, 0.5, 100);
        central.position.set(0, 0, 0);
        this.scene.add(central);
    }

    setupGeometry = () => {
        const firstPlanet = new Planet(
            new Three.Color(0x800505), true, 0.1, 0.55, 0.0);
        firstPlanet.addToViewport(this);

        const secondPlanet = new Planet(
            new Three.Color(0x00027c), false, 0.075, 1.1, 0.0);
        secondPlanet.addToViewport(this);

        const thirdPlanet = new Planet(
            new Three.Color(0x037801), false, 0.15, 2.0, 0.0);
        thirdPlanet.addToViewport(this);
    }
}

const viewport = new Viewport();
