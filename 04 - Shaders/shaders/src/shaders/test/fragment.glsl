//precision mediump float;
// Updating color which is fetched from JS
uniform vec3 uColor;
// Texture from JS
uniform sampler2D uTexture;

//varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main(){
  //gl_FragColor = vec4(uColor, 1.0); // Normal color
  //gl_FragColor = vec4(1.0, vRandom, 0.3, 1.0); // Cool spiky Terrain
  // Flag
  vec4 textureColor = texture2D(uTexture, vUv);
  // Simulating shadows
  // if part of the flag is closer to camera -> make it brighter,
  // and if it's further away make is darker.
  textureColor.rgb *= vElevation * 2.0 + 0.6;
  gl_FragColor = textureColor;
}