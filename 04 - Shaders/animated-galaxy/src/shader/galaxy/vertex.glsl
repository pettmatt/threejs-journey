uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.1; // Need 1.0 / distance in order to increase the spin speed of pixels closer to the middle.
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // Randomness
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Size
  gl_PointSize = uSize * aScale;
  // Taken from threejs points.glsl.js file in node_modules
  gl_PointSize *= (1.0 / - viewPosition.z ); // Makes sure particles don't resize themselves whenever the camera is closer to pixel.

  // Color
  vColor = color;
}