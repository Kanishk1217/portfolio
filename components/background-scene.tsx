"use client"
import { useEffect, useRef } from "react"

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`

// Stripe-style domain-warped noise shader
// Colors: black → dark crimson → deep red → orange-red
const FRAG = `precision mediump float;
uniform float t;
uniform vec2 res;

vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289v4(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289v4(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(0.16666667,0.33333333);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.14285714;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec2 uv=gl_FragCoord.xy/res;
  float s=t*0.14;

  // Domain warping — two layers of warp give the Stripe "living mesh" look
  vec2 q=vec2(
    snoise(vec3(uv*1.6,          s*0.60)),
    snoise(vec3(uv*1.6+vec2(5.2,1.3), s*0.50))
  );
  vec2 r=vec2(
    snoise(vec3(uv*1.6+4.0*q+vec2(1.7,9.2), s*0.70)),
    snoise(vec3(uv*1.6+4.0*q+vec2(8.3,2.8), s*0.40))
  );
  float f=snoise(vec3(uv*1.6+4.0*r, s))*0.5+0.5;

  // Palette: pure black → dark crimson → deep red → vivid red → orange-red
  vec3 c0=vec3(0.00,0.00,0.00);
  vec3 c1=vec3(0.16,0.01,0.01);
  vec3 c2=vec3(0.52,0.05,0.03);
  vec3 c3=vec3(0.80,0.10,0.05);
  vec3 c4=vec3(0.97,0.35,0.07);

  vec3 col=c0;
  col=mix(col,c1,smoothstep(0.18,0.38,f));
  col=mix(col,c2,smoothstep(0.35,0.56,f));
  col=mix(col,c3,smoothstep(0.53,0.72,f));
  col=mix(col,c4,smoothstep(0.70,0.88,f));

  gl_FragColor=vec4(col,1.0);
}`

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
    if (!gl) return

    const c = canvas
    function resize() {
      c.width = window.innerWidth
      c.height = window.innerHeight
      gl!.viewport(0, 0, c.width, c.height)
    }

    function shader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uT   = gl.getUniformLocation(prog, "t")
    const uRes = gl.getUniformLocation(prog, "res")

    resize()
    window.addEventListener("resize", resize)

    let raf: number
    const start = performance.now()

    function draw() {
      gl!.uniform1f(uT, (performance.now() - start) / 1000)
      gl!.uniform2f(uRes, c.width, c.height)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}
