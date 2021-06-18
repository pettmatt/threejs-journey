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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// Particles
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < positions.length; i++) {
// -0.5 allows coordinates to be negative. In other words the origin point of particles will be in the center of the scene
// WHY? Because Math.random() returns value from 0 to 1
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3) // Take 3 values from positions. These values are used as coordinates (x,y,z)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3) // Take 3 values from positions. These values are used as color (r,g,b)
)

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true, // Allows particles to have perspective size (the closer the bigger they are)
    color: '#ff88cc',
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture, // By default renderer renders whole texture in material even if alphaMap turns it transparent
    //alphaTest: 0.001, // This is one way to fix the problem above
    //depthTest: false, // This may be better fix. In this method renderer doesn't care about which should be rendered first.
    // When there is other objects with the particles they will be drawn in front of an object even if they are behind it. 
    // Cool effect. Not realistic.
    depthWrite: false, // This is third method. Tells renderer to not render particles in the depth buffer.
    // Realistic method compered to depthTest method. Good solution.
    //blending: THREE.AdditiveBlending, // Fourth method. Requires more from processor, but can do something other methods cannot.
    // When there is enough particles the scene will have glowing effect which comes from adding existing color to particles that are behind.
    vertexColors: true // Telling the material to use colors
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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

    // Update particles
    // THIS IS GOING TO BE A BAD WAY OF ANIMATING POSSIBLY THOUSANDS OF PARTICLES.
    // POSSIBLE GOOD WAY WOULD BE TO CREATE YOUR OWN MATERIAL WITH A CUSTOM SHADER (self made).
    
    // You can manipulate the whole particle "body" like a "normal" object
    //particles.rotation.y = elapsedTime * 0.05

    // This is how you can manipulate individual particles creating wave animation
    for(let i = 0; i < count; i++)
    {
        let i3 = i * 3 // we need an access to individual particle

        const x = particlesGeometry.attributes.position.array[i3] // Getting the x-axis value
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true // Without this the animation wouldn't show


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()