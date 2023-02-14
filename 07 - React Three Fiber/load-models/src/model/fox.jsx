import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useControls } from 'leva'

const fox = './Fox/glTF/Fox.gltf'

const Fox = () => {
  // The easy way
  const model = useGLTF(fox)
  const animations = useAnimations(model.animations, model.scene)

  const { animation } = useControls({
    animation: { options: animations.names }
  })

  useEffect(() => {
    const action = animations.actions[animation]
    // Fade in makes the transition of animations smoother
    action
      .reset()
      .fadeIn(0.5)
      .play()
    
    // After a moment change the animation
    // window.setTimeout(() => {
    //   animations.actions.Walk.play()
    //   animations.actions.Walk.crossFadeFrom(animations.actions.Survey, 1)
    // }, 5000)

    // Clean up
    return () => {
      action.fadeOut(0.5)
    }
  }, [animation])

  return <primitive 
    object={ model.scene } 
    scale={ 0.01 } 
    position={ [-2.5, 0, 0.25] } 
    rotation-y={ 0.3 } />
}

// Not necessary. Read the documentation what preload does.
useGLTF.preload(fox)

export default Fox