import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
// import vertexShader from './shaders/fire/vertex.glsl'
// import fragmentShader from './shaders/fire/fragment.glsl'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Object
const cubeGeometry = new THREE.SphereGeometry(1, 32, 32)
const cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        stretch: { value: 1.0 },
    }
})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

// Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setClearColor( 0xeeeeee );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
 * Animate
 */
const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    cubeGeometry.computeVertexNormals()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()