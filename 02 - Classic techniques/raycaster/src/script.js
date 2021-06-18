import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

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

// Mouse event
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    // clientX divided with the size of the window gives us values between 0 and 1, 
    // but we want negative and positive numbers so the outcome is multiplied by 2 and decreased by -1.
    // Final result: Numbers between -1 to 1 
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height * 2 - 1) // Height needs to flipped so we get positive values when mouse is higher.

    // Because some browsers can execute eventListener events more than once per frame we need to add functionality in "ticks"
})

// If an object is being hovered execute what ever is inside the if-statement
window.addEventListener('click', () => {
    if(currentIntersect) {
        console.log(currentIntersect.object, 'has been clicked')

        if(currentIntersect.object === object1) {
            console.log('Which is the first object')
        }

        if(currentIntersect.object === object2) {
            console.log('Which is the second object')
        }

        if(currentIntersect.object === object3) {
            console.log('Which is the third object')
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Raycaster
const raycaster = new THREE.Raycaster()

let currentIntersect = null // so called witness variable, which is used in second method of identifying if something is being hovered

/*
const rayOrigin = new THREE.Vector3(-3, 0, 0) // Point of origin -> think of it like a barrel of a gun
const rayDirection = new THREE.Vector3(10, 0, 0) // Which direction the ray is going to
rayDirection.normalize() // Ray needs a vector3 that is normalized

raycaster.set(rayOrigin, rayDirection) // Combining the settings

// The Results
const intersect = raycaster.intersectObject(object2)
const intersects = raycaster.intersectObjects([object1, object2, object3])
console.log(intersect, intersects)
*/

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

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.6) * 1.0
    object2.position.y = Math.sin(elapsedTime * 0.7) * 1.2
    object3.position.y = Math.sin(elapsedTime * 0.8) * 1.4

    // Cast a ray
    // Mouse hover functionality (1 line)
    raycaster.setFromCamera(mouse, camera)

    // When we want to hit moving object ray needs to be cast every frame
    // Uncomment next comment section in order to release madness
    // Next line only casts a ray every frame horizontaly
    /*const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection)*/

    // Used also by mouse hover functionality
    const objectsToHit = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToHit)

    //console.log(intersects.length)

    // Visualized what is being hit by changing the color
    
    // Method 1
    // 1. When ray isn't hitting change color to purple
    // 2. Objects are forced to change color to purple everytime...
    for(const object of objectsToHit) {
        object.material.color.set('#ff00ee')
    }

    // 1. On hit turn color from purple to turquoise
    // 2. ... but some are forced to change to turquoise right after
    for(const intersect of intersects) {
        intersect.object.material.color.set('#00ffee')
    }

    // Method 2
    if(intersects.length) {
        if(currentIntersect === null) {
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    }

    else {
        if(currentIntersect === null) {
            console.log('mouse leave')
        }

        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()