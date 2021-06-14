import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
group.position.y = 0.5
group.rotation.x = 1
group.scale.y = 0.4
scene.add(group)

const createCube = (size = {x: 1, y: 1, z: 1}, color = { color: 0x55ee03 }) => {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshBasicMaterial(color)
    )

    return cube
}

const cube01 = createCube()

group.add(cube01)

cube01.position.x = 0.4
cube01.position.y = -0.4
cube01.position.z = 1

cube01.scale.set(2, 0.4, 1)

cube01.rotation.x = Math.PI * 0.01
cube01.rotation.y = Math.PI * 0.25

const cube02 = createCube({x: 1, y: 0.25, z: 1}, { color: 0xee5503 })

group.add(cube02)

const cube03 = createCube({x: 0.5, y: 0.5, z: 0.5}, { color: 0x5503ee })

cube03.position.x = 2
cube03.position.y = -0.4
cube03.position.z = 1

group.add(cube03)

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

camera.lookAt(cube01.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)