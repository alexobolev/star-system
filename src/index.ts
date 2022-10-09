import * as Three from 'three';

const camera = new Three.PerspectiveCamera(
    80, window.innerWidth / window.innerHeight, 0.01, 10);
const scene = new Three.Scene();

const geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);
const material = new Three.MeshNormalMaterial();
const mesh = new Three.Mesh(geometry, material);

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(tick);

scene.add(mesh);
camera.position.z = 1;
document.body.appendChild(renderer.domElement);

// Main loop body.
function tick(time: number) {
    mesh.rotation.x = time / 1000;
    mesh.rotation.y = time / 1000;
    renderer.render(scene, camera);
};
