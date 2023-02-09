import './style.css'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './scenes/Experience'

const root = createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        // Clamping the pixel ratio can increase the fps. Here minimum is 1 and max is 2
        dpr={ [1, 2] }
        camera={{
            fov: 50,
            // zoom: 100,
            near: 0.1,
            far: 200,
            position: [ 3, 2, 6 ]
        }}
    >
        {/* <mesh>
            <torusKnotGeometry />
            <meshNormalMaterial />
        </mesh> */}
        <Experience />
    </Canvas>
)