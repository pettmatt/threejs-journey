import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/test/vertex.glsl'
import fragmentShader from './shaders/test/fragment.glsl'

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
const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.x = 1 / 2
mesh.scale.y = 1 / 2
scene.add(mesh)

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
const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.01, 500 )
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

const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } )

const box_geo = new THREE.BoxGeometry( 0.5, 0.1, 0.1 );
const box_mat = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
const cube = new THREE.Mesh( box_geo, box_mat );
scene.add( cube );


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

    if(cube.position.y < 0.5)
        cube.position.y += 0.001
    else cube.position.y = -0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()