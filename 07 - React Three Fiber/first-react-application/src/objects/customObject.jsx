import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'

const CustomObject = () => {
  const geometry = useRef()

  const verticesCount = 10 * 3

  const positions = useMemo(() => {
    // If the value is going to be static, it's better to useMemo,
    // which means the value isn't going to change on re-render and
    // React isn't using resources to do the calculation again
    const positions = new Float32Array(verticesCount * 3)

    for(let i = 0; i < verticesCount * 3; i++)
      positions[i] = (Math.random() - 0.5) * 3
    
    return positions
  }, [])

  useEffect(() => {
    // Processed only once on first render
    geometry.current.computeVertexNormals()
  }, [])

  return <mesh>
    <bufferGeometry ref={ geometry }>
      <bufferAttribute 
        attach='attributes-position'
        count={ verticesCount }
        itemSize={ 3 }
        array={ positions } />
    </bufferGeometry>
    <meshBasicMaterial color='red' side={ THREE.DoubleSide } />
  </mesh>
}

export default CustomObject