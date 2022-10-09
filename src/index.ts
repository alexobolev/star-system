import * as Three from 'three';

class Viewport {
    camera: Three.PerspectiveCamera;
    scene: Three.Scene;
    renderer: Three.WebGLRenderer;

    fov: number = 80;

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
        // this.setupLighting();
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
        this.camera.position.y += 0.4;
        this.camera.rotation.x -= 0.4;
    }

    // setupLighting = () => {
    //     const ambient = new Three.AmbientLight(0x404040);
    //     const point = new Three.PointLight(0xff0000, 1, 100);

    //     this.scene.add(ambient);
    //     this.scene.add(point);
    // }

    setupGeometry = () => {

        // a simple cube:
        {
            const geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);
            const material = new Three.MeshNormalMaterial();
            const mesh = new Three.Mesh(geometry, material);
    
            this.scene.add(mesh);
        }
    }
}

const viewport = new Viewport();
