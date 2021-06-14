import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Debugger setup
const gui = new dat.GUI({width: 300})
gui.hide() // Hotkey to hide or show is the "h" key

const parameters = {
    color: 0xff0044,
    spin: () => gsap.to(cubeMesh.rotation, {duration: 2, y: cubeMesh.rotation.y + Math.PI * 2})
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Resize canvas
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera aspect
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)

    // With these changes during window resizing the canvas
    // should react accordingly as well as the content.

    // Why is this here?
    // People can have multiple monitors on desktop with different pixel ratios
    // so it would be nice to change screens on the fly and have better experience
    // just with moving and resizing the window.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Full screen by double clicking
// Doesn't work with Safari
window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement)
        canvas.requestFullscreen()
    else
        document.exitFullscreen()
})

// Scene
const scene = new THREE.Scene()

// Object
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: parameters.color
})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.5, 500)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// Debugger (dat.GUI)
gui.add(cubeMesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(cubeMesh, 'visible')
gui.add(cubeMesh.material, 'wireframe')
gui.addColor(parameters, 'color').onChange(() => cubeMesh.material.color.set(parameters.color))
gui.add(parameters, 'spin')

// Animation
const animationLoop = () => {
    // Update controls
    controls.update()

    // Renderer
    renderer.render(scene, camera)

    window.requestAnimationFrame(animationLoop)
}

animationLoop()

// Devices have different pixel ratios and usually 2 is enough to hide "stairs"
// on the edges of an object so it's overkill to allow higher than pixel ratio of 2.
// (And devices that usually have more than 2 are smart phones so this is also optimizing for smart devices)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)