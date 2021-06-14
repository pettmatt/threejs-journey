import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI() // Remember dat.gui requires this line!!!
gui.width = 400

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // low cost
const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.3) // medium cost
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff) // low cost
const pointLight = new THREE.PointLight(0x00ff00, 0.3, 5) // medium cost
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1) // high cost // works only with MeshStandardMaterial and MeshPhysicalMaterial
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1) // high cost

scene.add(ambientLight) // Hmm... it's an ambient light... what else can I say?
scene.add(directionalLight) // Like a sun. Light that has a source.
scene.add(hemisphereLight) // Light which casts two colors from different positions.
scene.add(pointLight) // This light is more familiar to a light of a lamp.
scene.add(rectAreaLight) // Similiar to studio "highlight" lights that photographers use.
scene.add(spotLight) // Spotlight
scene.add(spotLight.target) // What's this? This is spotlight's target what it's going to point at. By default it's not added to the scene.

directionalLight
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3()) // Look at center (if you still don't remember this [Note for self])
spotLight.position.set(0, 2, 5)
spotLight.target.position.x -= 1.5 // ... and by changing spotlight's target position the spotlight will follow it

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('Ambient light intensity')
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('Directional light intensity')
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01).name('Hemisphere light intensity')
gui.add(pointLight, 'intensity').min(0).max(3).step(0.01).name('Point light intensity')
gui.add(rectAreaLight, 'intensity').min(0).max(5).step(0.01).name('Rect area light intensity')
gui.add(spotLight, 'intensity').min(0).max(2).step(0.01).name('Spotlight intensity')

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(hemisphereLightHelper)
scene.add(directionalLightHelper)
scene.add(pointLightHelper)
scene.add(spotLightHelper)
scene.add(rectAreaLightHelper)

// For some reason spotlight doesn't update the helper correctly so it needs to be manualy in the next frame
window.requestAnimationFrame(() => spotLightHelper.update())

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()