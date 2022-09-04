// Depending on which shader is used some variables are created by default
/*uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;*/
uniform vec2 uFrequency;
uniform float uTime; // Updating shader

//attribute float aRandom;
//varying float vRandom;

//attribute vec3 position;
//attribute vec2 uv; 

varying vec2 vUv; // sending attribute to the fragment
varying float vElevation;

void main() {
  // One way
  //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // Other way
  // Here we have more control over variables compered to example before.
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Seperating elevation in order to send in to the fragment
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;

  //modelPosition.z += aRandom * 0.1; // For nice spiky terrain
  //modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1; // For flag
  //modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1; // For flag

  // Updating happens above this line. Because Tic is changing the value every second in 
  // JS we can just use that value to increase our modelPosition values.
  // (Icreasing makes the animation to go from top to bottom. And decreasing makes it go left to right.)

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  //vRandom = aRandom; // For nice spiky terrain

  // Declaring values to attributes that fragment has access to.
  vUv = uv;
  vElevation = elevation;
}