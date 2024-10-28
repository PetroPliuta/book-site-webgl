import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css';
import stoneTextureImage from './textures/stone.jpg';
import roadTextureImage from './textures/road.jpg';
import grassTextureImage from './textures/grass.jpg';
import skyTextureImage from './textures/sky.jpg';

import createRoadSign from './models/RoadSign.js';

// INIT
let width = window.innerWidth, height = window.innerHeight;
// const cursor = { x: 0, y: 0 }
const scene = new THREE.Scene(3);
// scene.background = new THREE.Color(0x404035);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(skyTextureImage);
const canvas = document.querySelector(".canvas");
const clock = new THREE.Clock(false)

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    clock.start()
});

let drevnePlayed = false;
let stoneVisible = true;
let staroPlayed = false;

// HELPER / DEBUG
// const axesHelper = new THREE.AxesHelper(30);
// scene.add(axesHelper);
// console.log(scene)

// CAMERA
const camera = new THREE.PerspectiveCamera(70, width / height);
camera.position.set(-1, 2, 5);
scene.add(camera);

// STONE
// Load a stone texture
const stoneTexture = textureLoader.load(stoneTextureImage); // Replace with the path to your texture file
// Create geometry and material for the stone
const stoneGeometry = new THREE.IcosahedronGeometry(2, 10); // Gives an irregular, rock-like shape
const stoneMaterial = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 10, // ?
    metalness: 0.1, // ?
    side: THREE.DoubleSide,
    opacity: 1,
    transparent: true, // необхідно для прозорості
});
const stone = new THREE.Mesh(stoneGeometry, stoneMaterial)
scene.add(stone)

// ROAD
const roadGeometry = new THREE.PlaneGeometry(5, 100, 5, 100);
const roadTexture = textureLoader.load(roadTextureImage);
roadTexture.wrapS = THREE.RepeatWrapping
roadTexture.wrapT = THREE.RepeatWrapping
roadTexture.repeat.set(1, 20);
const roadMaterial = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: 10,
    metalness: .1,
    // color: 'gray',
    side: THREE.DoubleSide,
    // wireframe: true,
});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
roadGeometry.rotateX(Math.PI / 2);
scene.add(road);
road.position.y = 0.01

// ROAD SIGNS
const roadSigns = {
    "Налево": new THREE.Vector3(-3, 0, -5),
    "Прямо": new THREE.Vector3(0, 0, -5),
    "Направо": new THREE.Vector3(3, 0, -5),
}
for (let rs in roadSigns) {
    let roadSign = createRoadSign(textureLoader, rs);
    roadSign.position.copy(roadSigns[rs]); // розміщення на дорозі
    scene.add(roadSign);
}


// GRASS
const grassGeometry = new THREE.PlaneGeometry(100, 100);
const grassTexture = textureLoader.load(grassTextureImage);
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
grassTexture.repeat.set(20, 20)
const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    side: THREE.DoubleSide,
    color: 'gray', // make darker
});
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotateX(Math.PI / 2)
scene.add(grass)

// LIGHT
// const directionLight = new THREE.DirectionalLight(0xffffff, 8);
// directionLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0x404040, 40);
// scene.add(directionLight);
scene.add(ambientLight);


// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
})
// const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
// renderer.setAnimationLoop(animate);
renderer.render(scene, camera);
// document.body.appendChild(renderer.domElement);

// const clock = new THREE.Clock();

// window.addEventListener('mousemove', (ev) => {
//     cursor.x = -(ev.clientX / width - .5);
//     cursor.y = ev.clientY / height - .5;
// })

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true

// Створюємо AnimationMixer для анімацій
const mixer = new THREE.AnimationMixer(stone);
// Визначаємо ключові кадри для анімації зникання
const opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', [0, 1], [1, 0]);
// Визначаємо ключові кадри для зменшення scale
const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 1], [1, 1, 1, 0, 0, 0]);
// Створюємо анімаційний кліп тривалістю 1 секунда
const fadeAndScaleClip = new THREE.AnimationClip('fadeandScale', 1, [opacityKF, scaleKF]);
// Додаємо анімаційний кліп до міксера
const fadeAction = mixer.clipAction(fadeAndScaleClip);
fadeAction.setLoop(THREE.LoopOnce); // запускаємо тільки один раз
fadeAction.clampWhenFinished = true; // зупиняємо анімацію, коли вона завершується


function tick() {
    const delta = clock.getDelta()

    if (clock.getElapsedTime() > 1.5 && !drevnePlayed) {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sounds/drevne.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
        drevnePlayed = true;
    }

    if (clock.getElapsedTime() > 3 && stoneVisible) {
        fadeAction.play();
        stoneVisible = false;
        // stone.geometry.scale(0, 0, 0);
    }

    if (clock.getElapsedTime() > 4 && !staroPlayed) {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sounds/staro.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
        staroPlayed = true;
    }

    mixer.update(delta);

    controls.update(delta)
    // camera.lookAt(mesh.position);
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();

// allow resize window
window.addEventListener('resize', () => {
    // canvas.setSize()
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
})

// dblclick to fullscreen
window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    }
    else {
        // canvas.requestFullscreen()
        document.body.requestFullscreen()
    }
})