import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { Plane } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.x = 0.1 * 0.05
mesh.scale.y = 0.1 * 0.3
scene.add(mesh)

// Debug
const gui = new dat.GUI()
gui.add(mesh.scale, 'y', 0, Math.PI * 2)
gui.add(mesh.scale, 'x', 0, Math.PI * 2)

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
camera.position.set(0.25, - 0.25, 1)
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

// Timer from when the page was refreshed
let time = Date.now()
const clock = new THREE.Clock()

/**
 * Animate
 */
const tick = () =>
{
    // Time
    // const currentTime = Date.now() // Time from when the tick occured.
    // const deltaTime = currentTime - time // Removes bug (tick is executed more often than planned) when user has better GPU
    // time = currentTime

    // Clock
    const elapsedTime = clock.getElapsedTime()

    if(mesh.scale.y < 1.0) {
        mesh.scale.y = elapsedTime
        mesh.translate.y = elapsedTime
    }

    else if(mesh.scale.y > 1.0 && mesh.scale.x < 1.0)
        mesh.scale.x += 0.05

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()