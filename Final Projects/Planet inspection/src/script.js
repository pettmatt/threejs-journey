import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('/textures/planets/earth_daymap.jpg')
const earthTextureNight = textureLoader.load('/textures/planets/earth_nightmap.jpg')
const earthCloudTexture = textureLoader.load('/textures/planets/earth_clouds.jpg')
const jupiterTexture = textureLoader.load('/textures/planets/jupiter.jpg')
const marsTexture = textureLoader.load('/textures/planets/mars.jpg')
const mercuryTexture = textureLoader.load('/textures/planets/mercury.jpg')
const neptuneTexture = textureLoader.load('/textures/planets/neptune.jpg')
const saturnTexture = textureLoader.load('/textures/planets/saturn.jpg')
const sunTexture = textureLoader.load('/textures/planets/sun.jpg')
const uranusTexture = textureLoader.load('/textures/planets/uranus.jpg')
const venusTexture = textureLoader.load('/textures/planets/venus_surface.jpg')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test sphere
 */
const orbitalBody = new THREE.Group()

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
        map: earthTexture
    })
)

const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 32, 32),
    new THREE.MeshStandardMaterial({
        map: earthCloudTexture,
        transparent: true,
        alphaMap: earthCloudTexture
    })
)

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 32, 32),
    new THREE.MeshStandardMaterial({
        opacity: 0.2,
        transparent: true,
        emissive: new THREE.Color(0x050621)
    })
)

orbitalBody.add(planet, sky, atmosphere)


//orbitalBody.rotation.x = 4.8
scene.add(orbitalBody)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // One way of updating environment maps
            //child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(20).step(0.001).onChange(updateAllMaterials())

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.03
scene.add(directionalLight)

directionalLight.shadow.mapSize.set(1024, 1024)

//const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('lightZ')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsetTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Rotate planet
    planet.rotation.y = elapsetTime * 0.18
    sky.rotation.y = elapsetTime * 0.16

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()