#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main()
{
    // Fireball
    // 1) make a sphere
    // 2) make it glow
    // 3) make it "radiate" pixels depending on if it is top half
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Colored
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.7);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    // Black and white
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
}