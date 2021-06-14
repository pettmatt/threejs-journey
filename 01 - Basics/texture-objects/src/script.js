import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Textures
// METHOD 1
//const image = new Image() // create image object
//const texture = new THREE.Texture(image) // creating THREE.js texture from img

// METHOD 2 (Easier than method 1. Only 2 lines)
// Loading manager isn't necessary, but it can be useful
const loadingManager = new THREE.LoadingManager()

// Examples of what can be done with loading manager
// Loading manager is activated when something is being loaded like texture images
loadingManager.onStart = () => {
    console.log('Message on start')
}

loadingManager.onProgress = () => {
    console.log('Message on progress')
}

loadingManager.onLoad = () => {
    console.log('Message when image is loaded')
}

loadingManager.onError = (err) => {
    console.log('Message if error happens. Error:', err)
}

const textureLoader = new THREE.TextureLoader(loadingManager) // textureLoader can be used for multiple textures
const colorTexture = textureLoader.load('/textures/door/color.jpg')
//const colorTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcculsionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


// Load the image and alert when it's loaded
// THIS IS PART OF METHOD 1
/*image.onload = () => {
    texture.needsUpdate = true // tells the texture that it needs to be updated
}*/

// Change the image path
// By default Threejs searches "static" folder for images (or static files)
// THIS IS PART OF METHOD 1
//image.src = '/textures/door/color.jpg'

// Transforming texture
// One way of manipulating a texture is to change its Vector2 values of how it's repeated on a surface
// which can be edited through repeat (which gives us access to texture's vector2)
//colorTexture.repeat.x = 2
//colorTexture.repeat.y = 5

// Without the next step the texture stays incomplete if the purpose is 
// to repeat the altered version of the texture throughout the surface.
//colorTexture.wrapS = THREE.RepeatWrapping
//colorTexture.wrapT = THREE.RepeatWrapping
// Now the texture should be repeating 5 times in y axis and twice in x axis

// Textures have other attributes that can be altered as easily
//colorTexture.offset.x = 0.5
// changing rotation by calculating the correct degree (8th of a whole circle's rotation which would be 360)
//colorTexture.rotation = Math.PI * 0.25
// changing the center point so rotating the texture wouldn't rotate from bottom left corner but from the center
//colorTexture.center.x = 0.5
//colorTexture.center.y = 0.5

// Filttering and Mip mapping
// Filters can alter how sharp and clear a texture is.
//colorTexture.generateMipmaps = false // when nearestFilter is used in minFilter GeneratedMipmaps become almost useless
//colorTexture.minFilter = THREE.NearestFilter
//colorTexture.magFilter = THREE.NearestFilter // Makes smaller texture clearer (for example I'm testing this with 8x8 image)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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