import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

// When function isn't part of an object this is one way to add it in dat.gui
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 5,
            y: Math.random() * 10,
            z: (Math.random() - 0.5) * 5
        }
    )
}

debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 5,
            y: Math.random() * 10,
            z: (Math.random() - 0.5) * 5
        }
    )
}

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        // remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // remove mesh
        scene.remove(object.mesh)
    }
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// SOUNDS
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5) {
        // When sound is played multiple times it's not reseting itself. So it needs to be done manually
        hitSound.currentTime = 0
        hitSound.volume = Math.random()
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

// Physics
// World setup
const world = new CANNON.World()

// Optimizing
// Limits what objects check if they are interacting with an object. This improves performance
world.broadphase = new CANNON.SAPBroadphase(world)
// If object isn't moving -> put it to sleep
world.allowSleep = true

world.gravity.set(0, -9.82, 0)

// Materials
// In materials we can tell the library how different materials interact when they collide
// remember to add these materials to physic objects

/*const concreteMaterial = new CANNON.Material('conrete')
const plasticMaterial = new CANNON.Material('plastic')*/

// Easier way to add interaction between materials
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, // plasticMaterial,
    defaultMaterial, // concreteMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)

world.defaultContactMaterial = defaultContactMaterial // with this line we don't need to add materials to physics objects

// Sphere
/*
const sphereShape = new CANNON.Sphere(0.5) // Same radius as the sphere mesh
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    //material: defaultMaterial // material: plasticMaterial
})

sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
*/

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0, // Static object -> won't move
    shape: floorShape,
    //material: defaultMaterial // material: concreteMaterial
})

// By default plane is facing the camera so we need to rotate it so it's inline with the mesh
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)


// Adding physics objects to the physics world
//world.addBody(sphereBody)
world.addBody(floorBody)
world.addContactMaterial(defaultContactMaterial)

/**
 * Test sphere
 */
/*const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)*/

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 6, 4, 6)
scene.add(camera)

// CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// UTILS
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.6,
    roughness: 0.7,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.name = 'sphere'
    // Because geometry is created before the function we can change the radius here
    mesh.scale.set(radius, radius, radius)

    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save objects to update them later
    // Pushing mesh and body inside an object to array
    objectsToUpdate.push({
        mesh, body
    })
}

const createBox = (width, height, depth, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.name = 'box'
    mesh.scale.set(width, height, depth)

    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    // Because cannon creates shapes from the center we need to divide dimensions by 2
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)) // <-- needs to be Vec3
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh, body
    })
}

createSphere(0.5, {x: 0, y: 3 , z: 0})
createBox(0.5, 0.5, 0.5, {x: 4, y: 3 , z: 4})

/**
 * ANIMATION
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world
    //sphereBody.applyForce(new CANNON.Vec3(-0.4, 0, 0), sphereBody.position) // Apply "wind" to the sphere

    world.step(1 / 60, deltaTime, 3)

    // Applying physics to every object
    for(const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)

        if(object.mesh.name === 'box')
            object.mesh.quaternion.copy(object.body.quaternion)
    }

    //sphere.position.copy(sphereBody.position) // This is simpler way to update sphere position with physics position
    /*sphere.position.x = sphereBody.position.x
    sphere.position.y = sphereBody.position.y
    sphere.position.z = sphereBody.position.z*/

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()