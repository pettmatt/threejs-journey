import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import { Perf } from 'r3f-perf'

export default function Experience()
{
    // Debugging can be done through React browser plugin,
    // this is probably the easiest way because it doesn't 
    // require any setting up.
    // There is also other tools that are more customizable
    // that can be probably better fit for some projects.

    // Leva is one of those more customizable tools.
    // It's probably better to include settings/debugging stuff in another file.
    // Leva is really flexible and easy to use because
    // it doesn't require any extra information about what kind of input is needed.
    // General options can be tweaked through <Leva /> element. Check index file.
    const controls = useControls('Named section', {
        position: -2, // Used to change position of the cube
        list: [0, 2, 3],
        color: '#ffee22',
        choice: { options: ['a', 'b', 'c'] },
        clickable_button: button(() => {console.log('You clicked me')}),
    })

    const { performance_meters } = useControls({
        performance_meters: false
    })

    return <>

        {/* Perf can display the FPS and other details, that can be helpful to know the limits. 
        The statement is optional and only put here to display how Leva and Perf can be used together */}
        { performance_meters && <Perf position='top-left' /> }

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <mesh position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position-x={ controls.position } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}