import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 500})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Galaxy
const parameters = {}
parameters.type = 'spiral'
parameters.count = 10000
parameters.size = 0.01
parameters.galaxyRadius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'
parameters.removePrv = true

let geometry = null
let material = null
let points = null

let existingGalaxy = []

const generateGalaxy = () => {
    // If there is existing galaxy -> destroy it
    if(geometry && parameters.removePrv) {
        // Dispose method frees memory 
        geometry.dispose()
        material.dispose()
        // Mesh and points can't be disposed to it needs to be removed from the scene
        //scene.remove(points)
        // Because of removePrv boolean the method needs to loop through all "points" that have been added to the scene
        if(existingGalaxy.length > 0) {
            existingGalaxy.forEach((instance) => {
                instance.parent.remove(instance)
            })
            existingGalaxy = null
            existingGalaxy = []
        }
    }

    // Geometry
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; parameters.count > i; i++) {
        const i3 = i * 3

        if(parameters.type === 'normal'){
            positions[i3 + 0] = (Math.random() - 0.5) * parameters.galaxyRadius // X
            positions[i3 + 1] = (Math.random() - 0.5) * parameters.galaxyRadius // Y
            positions[i3 + 2] = (Math.random() - 0.5) * parameters.galaxyRadius // Z
        }

        else if(parameters.type === 'spiral'){
            // Position
            const radius = Math.random() * parameters.galaxyRadius
            
            const spinAngle = radius * parameters.spin
            // "%" operator restricts loop going over parameters.branches which default value is 5.
            // Because we want a value which is less than 1 we need to devide the number with the amount of branches
            // this makes the creation of a circle easier. And then finally calculating the angle in the circle.
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

            // Making spiral
            positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX // X
            positions[i3 + 1] = randomY // Y
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ // Z

            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / parameters.galaxyRadius)

            colors[i3 + 0] = mixedColor.r // R
            colors[i3 + 1] = mixedColor.g // G
            colors[i3 + 2] = mixedColor.b // B
        }
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // Points
    points = new THREE.Points(geometry, material)
    scene.add(points)

    // This is just for removing every instance of "galaxy"
    existingGalaxy.push(points)
}

generateGalaxy()

// GALAXY DEBUGGER
// NOTE: onFinishChange commits changes AFTER the mouse is released. onChange commits the changes whenever values are changed.
gui.add(parameters, 'type').name('Type of a galaxy').onFinishChange(generateGalaxy)
gui.add(parameters, 'count').min(100).max(10000).step(100).name('Particle count').onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name('Size of a particle').onFinishChange(generateGalaxy)
gui.add(parameters, 'galaxyRadius').min(5).max(100).step(1).name('Radius of the galaxy').onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).name('Branch count (spiral)').onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).name('Branch spin (spiral)').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).name('Randomness (spiral)').onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).name('Randomness power (spiral)').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').name('Inner color (spiral)').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').name('Outter color (spiral)').onFinishChange(generateGalaxy)
gui.add(parameters, 'removePrv').name('Remove previous galaxies')

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()