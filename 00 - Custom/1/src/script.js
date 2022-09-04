import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

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
const material = new THREE.MeshBasicMaterial({
    color: 0xFFEE66,
    wireframe: true
})

// Mesh
for (let i = 0; i < 20; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.z = i * 2
    mesh.position.z = i * -1
    mesh.scale.x = 20 - i
    mesh.scale.y = 20 - i
    scene.add(mesh)
}
// PART OF OBJECT CHANGES COLOR DEPENDING ON IF IT'S "OUTSIDE" OF ITS "BOX"
// Debug
const gui = new dat.GUI()

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
const camera = new THREE.OrthographicCamera( sizes.width / - 10, sizes.width / 10, sizes.height / 10, sizes.height / - 10, 1, 1000 )
camera.position.set(0,0, 1)
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

let items = []

for(let child of scene.children) {
    if(child.type === 'Mesh')
        items.push(child)
}

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

    for(let i = 0; i < scene.children.length; i++) {
        const distance = camera.position.distanceTo(scene.children[i].position)
        scene.children[i].rotation.z = distance * elapsedTime * 0.01 * -1
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()