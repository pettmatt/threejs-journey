varying vec2 vUv;
precision heightPosition float;

attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float stretch;

void main() {
  vec3 transformed = position.xyz;

  // Here we scale X and Z of the geometry by some modifier
  transformed.xz *= sin(position.y + stretch);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}