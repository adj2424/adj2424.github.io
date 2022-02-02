import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


/**
 * Set up
 */
const windowSize = {
	width: window.innerWidth,
	height: window.innerHeight
};
const scene = new THREE.Scene();

//camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg')!,
	antialias: true
});

//all child objects where it will be animated through tick method
let updatables: any[] = [];

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(windowSize.width, windowSize.height);
camera.position.setZ(5);
renderer.render(scene, camera);

/**
 * Background
 */
//const background = new THREE.TextureLoader().load('/background.jpg');
//scene.background = background;
scene.background = new THREE.Color(0xEFE2BA);

//add background stars
function genStars(num: number) {
	for (let i = 0; i < num; i++) {
		const startGeometry = new THREE.TorusKnotGeometry(1, .1, 30, 10);
		const starMaterial = new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x0000ff
		});
		const star = new THREE.Mesh(startGeometry, starMaterial);
		const x = (Math.random() * (100 + 100)) - 100;
		const y = -(Math.random() * (100 + 100));
		const z = (-Math.random() * 100) + 5;
		star.position.set(x, y, z);
		updatables.push(star);
		(star as any).tick = (delta: number) => {
			star.rotation.x += 1 * delta;
		};
		scene.add(star);
	}
}
///genStars(100);

//add particles
function genParticles(num: number) {
	for (let i = 0; i < num; i++) {
		const particleGeometry = new THREE.SphereBufferGeometry(.1, 8, 8);
		const particleMaterial = new THREE.MeshBasicMaterial({
			color: 0x000000,
			wireframe: true
		});
		const particle = new THREE.Mesh(particleGeometry, particleMaterial);
		const x = (Math.random() * (120)) - 60;
		const y = -(Math.random() * 100) + 20;
		const z = (-Math.random() * 10) - 30;
		particle.position.set(x, y, z);
		scene.add(particle);
	}
}
genParticles(20);

/**
 * Light Source
 */
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/**
 * Torus
 */
const torusGeometry = new THREE.TorusBufferGeometry(1, .5, 16, 100);
const torusMaterial = new THREE.MeshToonMaterial({
	color: 0xff0000,
	wireframe: true
});
const torus0 = new THREE.Mesh(torusGeometry, torusMaterial);
torus0.position.set(3, 1, 0);
updatables.push(torus0);
scene.add(torus0);
(torus0 as any).tick = (delta: number) => {
	torus0.rotation.x += 1 * delta;
	torus0.rotation.y += 0.4 * delta;
	torus0.rotation.z += 2 * delta;
};


/**
 * TorusKnot
 */
const torusKnotGeometry = new THREE.TorusKnotBufferGeometry(.4, .05, 100, 20);
const torusKnotMesh = new THREE.MeshToonMaterial({
	color: 0x00000FF,
	wireframe: true
});
const torusKnot0 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot1 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot2 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot3 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
const torusKnot4 = new THREE.Mesh(torusKnotGeometry, torusKnotMesh);
torusKnot0.position.set(6, -2, 0);
torusKnot1.position.set(8, -2, 0);
torusKnot2.position.set(10, -2, 0);
torusKnot3.position.set(12, -2, 0);
torusKnot4.position.set(14, -2, 0);
const torusKnotGroup = new THREE.Group();
torusKnotGroup.position.x = 0;
torusKnotGroup.add(torusKnot0, torusKnot1, torusKnot2, torusKnot3, torusKnot4);
scene.add(torusKnotGroup);
updatables.push(torusKnotGroup);
(torusKnotGroup as any).tick = (delta: number) => {
	if (torusKnotGroup.position.x < -22) {
		torusKnotGroup.position.x = 4;
	}
	torusKnotGroup.position.x -= 2 * delta;
}
/**
 * Dark background plane
 */
 const planeGeometry = new THREE.PlaneBufferGeometry(25, 40);
 const planeMaterial = new THREE.MeshBasicMaterial({
	 color: 0x4056A1
 });
 const plane = new THREE.Mesh(planeGeometry, planeMaterial);
 plane.position.set(0, -28, -3);
 scene.add(plane);
/**
 * Light background plane
 */
const blankPlane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(24, 25),
	new THREE.MeshBasicMaterial({
		color: 0xC5CBE3
	})
);
blankPlane.position.set(2, -23, -4);
scene.add(blankPlane);

/**
 * Cone
 */
const coneGeometry = new THREE.ConeBufferGeometry(1, 3, 15);
const coneMaterial = new THREE.MeshBasicMaterial({
	color: 0xFFFF33,
	wireframe: true
});
const cone  = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(5, -15, -2);
(cone as any).tick = (delta: number) => {
	cone.rotation.y += delta * 1;
}
updatables.push(cone);
scene.add(cone);

/**
 * helpers
 */
const gridHelper = new THREE.GridHelper(500);
//const controls = new OrbitControls(camera, renderer.domElement);
scene.add(gridHelper);

/**
 * resize window
 */
window.addEventListener('resize', () => {
	windowSize.width = window.innerWidth;
	windowSize.height = window.innerHeight;

	camera.aspect = windowSize.width / windowSize.height;
	camera.updateProjectionMatrix();

	renderer.setSize(windowSize.width, windowSize.height);
	renderer.setPixelRatio(window.devicePixelRatio);
	//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * cursor parallax
 */
const cursor = {
	x: 0,
	y: 0
};
window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / window.innerWidth - 0.5; //range of -.5, 5
	cursor.y = event.clientY / window.innerHeight - 0.5; //range of -.5, 5
});

/**
 * scroll animation
 */
let currScrollY = window.scrollY;
let maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
let scrollPercent = 0.0;
window.addEventListener('scroll', () => {
	currScrollY = window.scrollY;
	scrollPercent = currScrollY / maxY;
});

/**
 * scroll animation timeline
 */
// linear interpolation function
function lerp(min: number, max: number, ratio: number): number {
	return (1 - ratio) * min + ratio * max;
}
// fit lerp to start and end at scroll percentages
function scalePercent(start: number, end: number): number {
	return (scrollPercent - start) / (end - start);
}

const timeLineScripts: {
	start: number;
	end: number;
	animationFun: () => void;
}[] = [];

const torusScript = {
	start: 0.00,
	end: 0.1,
	animationFun: () => {
		torus0.position.x = lerp(3, -10, scalePercent(torusScript.start, torusScript.end));
		torus0.position.y = lerp(1, -5, scalePercent(torusScript.start, torusScript.end));
	}
};
timeLineScripts.push(torusScript);

const moveCameraScript = {
	start: 0.25,
	end: 0.35,
	animationFun:() => {
		plane.position.x = lerp(0, -19, scalePercent(moveCameraScript.start, moveCameraScript.end));
	}
}
timeLineScripts.push(moveCameraScript);

const movePlaneCameraScript = {
	start: 0.45,
	end: 0.6,
	animationFun:() => {
		blankPlane.position.x = lerp(2, 40, scalePercent(movePlaneCameraScript.start, movePlaneCameraScript.end));
		blankPlane.position.y = lerp(-23, -10, scalePercent(movePlaneCameraScript.start, movePlaneCameraScript.end));
		//camera.position.x = lerp(18, 0, scalePercent(movePlaneCameraScript.start, movePlaneCameraScript.end, scrollPercent));
		plane.position.x = lerp(-19, -30, scalePercent(movePlaneCameraScript.start, movePlaneCameraScript.end));
	}
}
timeLineScripts.push(movePlaneCameraScript);


function playTimeLineAnimations() {
	for (const script of timeLineScripts) {
		if (scrollPercent >= script.start && scrollPercent < script.end) {
			script.animationFun();
		}
	}
}

/**
 * animation
 */
const clock = new THREE.Clock;
function tick(delta: number) {
	for (const obj of updatables) {
		//calls child tick method
		(obj as any).tick(delta);
	}
}
const SCROLL_SENS = 8;
renderer.setAnimationLoop(() => {
	//delta for consistency
	const delta = clock.getDelta();
	tick(delta);
	//animate camera scroll
	camera.position.y = -currScrollY / windowSize.height * SCROLL_SENS;
	//scroll based animation timeline
	playTimeLineAnimations();
	console.log(camera.position.x)

	//animate cursor parallax
	const parallaxX = -cursor.x;
	const parallaxY = cursor.y;
	//cameraGroup.position.x += (parallaxX - cameraGroup.position.x * delta * 30); //created camera group to get parallax and scroll working
	//cameraGroup.position.y += (parallaxY - cameraGroup.position.y * delta * 30); //idk y it works xd
	renderer.render(scene, camera);
});