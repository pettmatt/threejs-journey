import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// Cursor
// Adding manipulation through mouse movement
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    // Get mouse position
    // By dividing the cursor position by the size of the canvas we get values from 0 to 1 instead of pixels.
    // Why is this important? By doing this the application is responsive to the screen it's displayed on,
    // which means that the application works with smaller AND larger screens.
    // If we wanted the values to go to the negatives we would just add -0.5 to the calculation.
    // Result: Max values x0.5 y0.5 Min values x-0.5 y-0.5
    cursor.x = event.clientX / sizes.width - 0.5
    // Because Y values go from top 0 to bottom 1 we need to make Y value into a negative one
    // so the controls wouldn't be inverted.
    cursor.y = -(event.clientY / sizes.height - 0.5) // Without "()" the calculation would be off BUT it would work anyways.
    //console.log('X:', cursor.x, 'Y:', cursor.y)
})

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
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 100)
/*const camera = new THREE.OrthographicCamera(
    -2 * aspectRatio, 2 * aspectRatio, 2, -2, 0.1, 100
)*/
camera.position.z = 3
scene.add(camera)

// Controls
// If build in controls do everything you need USE THOSE. It's not a shame.
// Otherwise you would need to do everything again by yourself OR 
// change the controls class in a way that you get every feature you need.
const controls = new OrbitControls(camera, canvas)
// If I wanted to add a target to controls I would do it as follows...
//controls.target.y = 2
// controls require updating after changing a value in them...
//controls.update()
// Because I want the camera to be focused on the center I will just comment these out.

controls.enableDamping = true // This enables the controls to add slight smoothing aka demping.
// Updating happens in the animation loop.

//camera.lookAt(cube01.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// Time
let time = Date.now()

// Clock
const clock = new THREE.Clock()

// Badly written... I know
// GSAP is animation library which comes with useful properties like animation duration, delay amount and what should change.
// Here we want to change cube's position which lasts for 1 second, has a delay of 1 second and moves for 2 units to the right.
// The library doesn't need setuping before use (like time and clock examples) it has build in intependent methods and values.
// Putting this bit inside of the animationLoop() -method has a weird effect to the library. It messes up the "ticks" of the library.
gsap.to(cube01.position, {duration: 1, delay: 1, x: 2})
gsap.to(cube01.position, {duration: 1, delay: 3, x: 0})

// Animations
const animationLoop = () => {
    // Clock
    // Clock has getDelta() method which isn't reliable which is why it's not recommended
    const elapsedTime = clock.getElapsedTime()

    // Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    //console.log(deltaTime) // The smaller the number -> the better the processor

    // Just like Game Engines, browsers are also able to figure out
    // how good processor a computer has by calculating the difference between execution of 
    // a function and the time the function is working its "magic".

    // The output is called "deltaTime" which can be used to calculate the amount an object should move
    // which in an animation can be seen as a speed which the object is moving.

    // TL;DR: Delta time makes sure animations are moving in correct speed no matter how bad or good the computer is.
    cube02.rotation.x -= 0.001 * deltaTime
    cube02.rotation.z += 0.0001 * deltaTime

    // Clock and elapsed time are methods to get the same result as with time, 
    // but they are better optimised and faster to implement.

    // Google "sin()" or "cos()" if you don't remember what those do. Here it's used to get "hovering" effect.
    // This can be done with couple of if statements but this is a lot easier.

    // NOTE: Notice that this method DOES NOT require "+=/-=" operators 
    // because the value (elapsedTime) is always updated version of previous one.
    cube03.position.z = Math.sin(elapsedTime * 0.6)
    cube03.position.y = Math.cos(elapsedTime * 0.4)

    // Just messing with the camera
    //camera.lookAt(cube03.position)

    // Continueing the manipulation through mouse movement. This time moving the camera based on input
    //camera.position.x = cursor.x * 3
    //camera.position.z = cursor.y * 3
    // Now if I wanted to have 360 view of the center I would need to translate the mouse movement.
    // By combining sin() and cos() in different axes I can calculate circular path around the center which
    // the camera would follow based on where the mouse is. PI * 2 just makes sure it's exactly 360 rotation.
    //camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    //camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    //camera.position.y = cursor.y * 6 // Y-axis is easy to add but there is noticable straight line the camera follows
    // This method works but it's not necessary to invent the wheel again, but it's good to know how things work.
    // In controls section I have added build in THREE controls.
    // Let's make this better and make the camera look at the center of the scene
    camera.lookAt(new THREE.Vector3()) // Vector3 will have default values (0, 0, 0) which is the center

    // Update controls
    // Because I want a smooth movement the update need to happen inside the animation loop (which is called every frame)
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(animationLoop)
}

animationLoop()

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)