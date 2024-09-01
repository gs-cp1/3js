import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize the scene
const scene = new THREE.Scene();

// Set the background color to white
scene.background = new THREE.Color(0x525252);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); // Adjust camera height for better view of the floor

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Add a white plane as the floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = - Math.PI / 2; // Rotate the plane to be horizontal
floor.position.y = -1; // Position it under the model
scene.add(floor);

// Add a spotlight to the scene
const spotlight = new THREE.SpotLight(0xffffff, 120); // Increased intensity for better visibility
spotlight.position.set(0, 11, 0);
spotlight.angle = Math.PI / 8; // Narrower spotlight cone (30 degrees)
spotlight.penumbra = 0.2; // Sharper edges
spotlight.castShadow = true;
scene.add(spotlight);

// Add a small sphere at the spotlight’s position to represent the light source
const lightSphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
lightSphere.position.copy(spotlight.position);
scene.add(lightSphere);

// Add Spotlight Helper
const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

// Load your .glb or .gltf model
const loader = new GLTFLoader();
loader.load('/model.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.y = 1.75; // Adjust model position if needed
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
floor.receiveShadow = true;

// Render loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();

    // Update Spotlight Helper
    spotlightHelper.update();

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
