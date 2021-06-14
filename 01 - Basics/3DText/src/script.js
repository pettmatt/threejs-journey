import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// This is one way of importing fonts
//import typefaceFont from 'three/examples/fonts/helvetiker_bold.typeface.json'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
//const axesHelper = new THREE.AxesHelper()
//scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/5.png')
const matcapDonutTexture = textureLoader.load('textures/matcaps/1.png')

// Other way is to load fonts from static folder
// Fonts
const fontLoader = new THREE.FontLoader()
// Data is received from fontLoader as a callback NOT as a return
// So "const font = fontloader.load()" isn't possible
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextBufferGeometry(
            'Glory to mankind',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // THIS IS HARD WAY OF CENTERING A TEXT
        // Compute bounding box creates bounding box for an object 
        //textGeometry.computeBoundingBox()
        // cosole.log() just shows that it's generated
        // because it's just coordinates instead of physical object
        //console.log(textGeometry.boundingBox)

        // With these coordinates we can center the text by moving it half of its length to the left.
        // Only the mesh is being moved (so center point remines in the center of the scene).
        /*textGeometry.translate(
            - textGeometry.boundingBox.max.x / 2,
            - textGeometry.boundingBox.max.y / 2,
            - textGeometry.boundingBox.max.z / 2
        )*/

        // It looks to be on the center? Mathematicly it's not.
        // Because of the bevels the text is larger than it seems. This can be seen in the boundingBox by
        // not having perfect 0 value in the left side of the object which should be in the 
        // center of the scene when it's console.loged.

        //textGeometry.computeBoundingBox()

        // This can be fixed by reducing the bevel size from boundingbox.max
        /*textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) / 2,
            - (textGeometry.boundingBox.max.y - 0.02) / 2,
            - (textGeometry.boundingBox.max.z - 0.03) / 2   // Z-axis is reduced with bevel's thickness
        )*/

        // And now X-axis max and min values from console log should have the same value,
        // but for some reason Z-axis is the one that has the same values in my example...
        //textGeometry.computeBoundingBox()
        //console.log(textGeometry.boundingBox)

        // THIS IS THE EASIER WAY
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        // Checking how long it takes to create these objects
        // console.time('donuts')
        // How long did it take?
        // Answer too long. Fix remove things that are repeated for no reason.
        // Donut geometry and material should be outside of the loop.
        // With these changes the loop is well optimized

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonutTexture })

        for(let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            scene.add(donut)

            donut.position.x = (Math.random() - 0.5) * 15
            donut.position.y = (Math.random() - 0.5) * 15
            donut.position.z = (Math.random() - 0.5) * 15

            // Donuts don't need to be rotated by 360 because of they seem the same on the other side
            // so let's decrease the possible rotation values
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random() * 1.5
            donut.scale.set(scale, scale, scale)
        }

        //console.timeEnd('donuts')
    }
)

/**
 * Object
 */


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
camera.position.z = 5
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