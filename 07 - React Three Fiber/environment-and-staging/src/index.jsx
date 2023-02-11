import './style.css'
import * as THREE from 'three'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const backgroundColor = '#ffffff'

const created = ({ gl, scene }) => {
    console.log(gl, scene)
    // scene.background = new THREE.Color(backgroundColor)
    // gl also contains the background setter function
}

root.render(
    // Shadow enables shadow casting. The object should also include data if they can cast shadows.
    <Canvas
        shadows={ false }
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ -4, 3, 6 ]
        } }
        onCreated={ created }
    >
        {/* color could also be included in Experience component */}
        <color args={ [backgroundColor] } attach='background' />
        <Experience />
    </Canvas>
)