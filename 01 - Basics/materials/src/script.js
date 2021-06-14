import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const doorAplhaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// Debugger
const gui = new dat.GUI()


// Objects
/*const material = new THREE.MeshBasicMaterial({
    map: doorColorTexture
})*/

// other ways to change properties
// material.map = doorColorTexture
// "material.color = 'yellow'" won't work because the value is an object which holds rbg values
// console.log(material.color)
// So changing values can also be done with these methods
//material.color.set('yellow')
// Or with
//material.color = new THREE.Color('pink')

// When texture is assigned to an object the color can also change the color of the texture
// This next color is a lot better to show the combination
//material.color = new THREE.Color(0x00ff00)

// This is a thing too
//material.wireframe = true

// Next one is the "spooky" combination
/*material.transparent = true
material.opacity = 0.6*/

// Alpha map requires transparency
/*material.transparent = true
material.alphaMap = doorAplhaTexture*/

// This is useful if you want to have both sides of a plane visible at the same time,
// but it also requires more processing power. Not recommended to use in complicated shapes.
//material.side = THREE.DoubleSide

// Want to know attributes of geometry? CONSOLE LOG or THREE.JS DOCUMENTATION are useful!!!
// console.log(sphere.geometry.attributes)

// Create for cheking if an object has anomalies
/*const material = new THREE.MeshNormalMaterial()
material.side = THREE.DoubleSide
material.flatShading = true*/

// Matcap material picks colors from an image and displays them on an object
// One way to use this is to simulate light through texture
// NOTE: Matcaps are pretty awesome if used correctly (can even simulate cartoonish look)
// Matcaps can be created with 3D softwares by rendering sphere object with wanted texture.
// The rendered picture can be used just like below.
/*const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture*/

// This one is also pretty nice and effective if you want to simulate light behavior in dark places.
//const material = new THREE.MeshDepthMaterial()

// Reacts well with light and doesn't eat that much power from processor. Is not perfect!
//const material = new THREE.MeshLambertMaterial()

// Reacts better with light, but eats more processing power than "mesh laber material"
/*const material = new THREE.MeshPhongMaterial()
material.shininess = 100
material.specular = new THREE.Color(0xfffff)*/ // Pretty nice effect. Changes the reflected color.

// Cartoonish effect (No shit?! It has it in its name...)
// The values can be manipulated with gradient, but this can blur the colors between the gradient
// which can be fixed with gradient.minFilter and magFilter
//gradientTexture.minFilter = THREE.NearestFilter
//gradientTexture.magFilter = THREE.NearestFilter

// NearestFilter is used so automaticly generated mipmaps are not necessary
//gradientTexture.generateMipmaps = false

//const material = new THREE.MeshToonMaterial()
//material.gradientMap = gradientTexture

// Pretty often used. Provides probably the most realistic results.
const material = new THREE.MeshStandardMaterial()
//material.metalness = 0.45
//material.roughness = 0.65
material.map = doorColorTexture
// Ao-maps add more to "depth" to the texture by adding darker lines to it
// This requires more lines than this
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1.5
// Adds depth to object with height texture
// Shapes don't have enough edges/triangles so this part isn't one liner
// someGeometry(0.5, XX, XX) <-- make XX parameter values larger
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
// Let's add some shininess. 
// Don't combine with material.metalness and material.roughness values (comment them out)
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorMetalnessTexture
// Add details with normal map. Recommended if possible!
material.normalMap = doorNormalTexture
material.normalScale.set(0.2, 0.2)
// Adding alpha map (which excludes parts of an object)
// transparency must be true which is used to hide specific parts
material.transparent = true
material.alphaMap = doorAplhaTexture

// gui add -> wants to know which thing it's effecting -> and what property
gui.add(material, 'metalness').min(0).max(1)
gui.add(material, 'roughness').min(0).max(1)
gui.add(material, 'aoMapIntensity').min(0).max(10)
gui.add(material, 'displacementScale').min(0).max(1)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
const pointLight = new THREE.PointLight(0xffffff, 0.4)

pointLight.position.x = 10
pointLight.position.y = 7
pointLight.position.z = 4

scene.add(ambientLight, pointLight)

gui.add(ambientLight.position, 'x').min(-200).max(200).name('Ambient light X')
gui.add(ambientLight.position, 'y').min(-200).max(200).name('Ambient light Y')
gui.add(ambientLight.position, 'z').min(-200).max(200).name('Ambient light Z')

gui.add(pointLight.position, 'x').min(-100).max(100).name('Point light X')
gui.add(pointLight.position, 'y').min(-100).max(100).name('Point light Y')
gui.add(pointLight.position, 'z').min(-100).max(100).name('Point light Z')

// Meshes
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)

// PART of ao-map setup
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

plane.position.x -= 1.2;
torus.position.x += 1.2;

scene.add(sphere, plane, torus)

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
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = elapsedTime * 0.3
    plane.rotation.y = elapsedTime * 0.3
    torus.rotation.y = elapsedTime * 0.3

    sphere.rotation.x = elapsedTime * 0.2
    plane.rotation.x = elapsedTime * 0.2
    torus.rotation.x = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()