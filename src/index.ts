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
        this.camera.rotation.x -= 0.4;
        this.camera.position.y += 0.4;

        this.camera.position.x -= 0.4;
        this.camera.rotation.y -= 0.4;
    }

    setupLighting = () => {
        const ambient = new Three.AmbientLight(0x0000FF, 0.05);
        this.scene.add(ambient);

        const left = new Three.PointLight(0x0000ff, 0.9, 10);
        left.position.set(-0.25, -0.25, 0.25);
        this.scene.add(left);
        
        const right = new Three.PointLight(0xff0000, 0.8, 10);
        right.position.set(0.25, 0.25, 0.25);
        this.scene.add(right);
        
        const front = new Three.PointLight(0xffffff, 0.1, 10);
        front.position.set(0.25, -0.25, 1.0);
        this.scene.add(front);
    }

    setupGeometry = () => {

        // a central sphere:
        {
            const geometry = new Three.SphereGeometry(0.1, 128, 128);
            const material = new Three.MeshPhongMaterial({});
            const mesh = new Three.Mesh(geometry, material);

            mesh.position.set(0.0, 0.0, 0.3);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
        }

        // a simple cube:
        {
            const geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);
            const material = new Three.MeshPhongMaterial({});
            const mesh = new Three.Mesh(geometry, material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
    
            this.scene.add(mesh);
        }
    }
}

const viewport = new Viewport();
