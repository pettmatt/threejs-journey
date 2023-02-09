#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

//  Classic Perlin 2D Noise 
//  by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    // Comment others patterns if you want to view one (last one overwrites)
    // gl_FragColor = vec4(vUv, 1.0, 1.0); // Pattern 1
    // gl_FragColor = vec4(0.5, vUv, 1.0); // Pattern 2

    // Pattern 3 (Gradient in X)
    // float strength = vUv.x;
    
    // Pattern 4 (Gradient in Y)
    //float strength = vUv.y;

    // Pattern 5 (Gradient in -Y)
    // float strength = 1.0 - vUv.y; // - vUv.y WON'T work

    // Pattern 6 (Strong gradient)
    //float strength = vUv.y * 10.0;

    // Pattern 7 (Multiple gradients)
    //float strength = mod(vUv.y * 10.0, 1.0); // Resets value when limit is reached which is 1.0.

    // Pattern 8 (Multiple strong gradients)
    //float strength = mod(vUv.y * 10.0, 1.0);

    // One way of checking conditions is if-statement but not recommended
    /*if(strength < 0.5)
        strength = 0.0;
    else
        strength = 1.0;
    */

    // Better way "The step"
    //strength = step(0.5, strength);

    // Pattern 9
    //float strength = mod(vUv.y * 10.0, 1.0);
    //strength = step(0.7, strength);

    // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.7, strength);

    // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 12 (see only the parts the lines cross)
    // float strength = step(0.9, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.9, mod(vUv.y * 10.0, 1.0));

    // Pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.9, mod(vUv.y * 10.0, 1.0));

    // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // Pattern 15 (own)
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 5.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 5.0, 1.0));

    // float strength = barX + barY;

    // Pattern 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // Pattern 16
    //float strength = abs(vUv.x - 0.5); // returns only positive values

    // Pattern 17 (own)
    // float strength = abs(vUv.x - 0.5) + abs(vUv.y - 0.5);

    // Pattern 18
    //float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 19
    //float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 20
    //float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Pattern 21
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // Pattern 22 (old-school gradient)
    //float strength = floor(vUv.x * 10.0) / 10.0;

    // Pattern 22
    //float strength = (floor(vUv.x * 10.0) / 10.0) * (floor(vUv.y * 10.0) / 10.0);

    // Pattern 23 ("random" pattern)
    //float strength = random(vUv);

    // Pattern 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );

    // float strength = random(gridUv);

    // Pattern 25
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor((vUv.y + vUv.x * 0.8) * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // Pattern 26
    // float strength = length(vUv);

    // Pattern 27
    // float strength = length(vUv - 0.5); // Way 1: Offset the pattern
    // float strength = distance(vUv, vec2(0.5, 1.0)); // Way 2: Depending on the distance of 2 points (more control (x, y))

    // Pattern 28
    // Starts from white and depending on how far the pattern goes, the darker it becomes.
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // Pattern 29
    // Point light effect
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // Pattern 30
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // Pattern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // Pattern 32
    // rotate 1/4 of a PI, vec2(center point in which rotation happens)
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // Pattern 33
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // Pattern 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // Pattern 35
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 36 (Potential to play around with)
    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 37 (Potential to play around with)
    // vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // Pattern 38 (Profile pic)
    // vec2 wavedUv = vec2(
    //     // vUv.x + sin(vUv.y * 1500.0) * 0.1,
    //     vUv.x + sin(vUv.y * 1000.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // Pattern 39 (Potential to play around with)
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.27));

    // Pattern 40
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // Pattern 41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // Pattern 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = angle;

    // Pattern 43
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // angle *= 25.0;
    // angle = mod(angle, 1.0); // Repeat pattern
    // float strength = angle;

    // Pattern 44
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 50.0);

    // Pattern 45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // Pattern 46
    // float strength = cnoise(vUv * 25.0);

    // Pattern 47
    // float strength = step(0.0, cnoise(vUv * 25.0));

    // Pattern 48
    // float strength = 1.0 - abs(cnoise(vUv * 3.5));

    // Pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 15.0);

    // Pattern 50
    // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    // Clamping strength (so it cannot go over specific value)
    strength = clamp(strength, 0.0, 1.0);

    // Colored
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.7);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    // Black and white
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
}