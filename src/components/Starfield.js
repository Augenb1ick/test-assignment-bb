import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BUFFER_A_FRAG } from '../utills/Nebula-shaders';
import { BUFFER_B_FRAG } from '../utills/Nebula-shaders';
import { BUFFER_FINAL_FRAG } from '../utills/Nebula-shaders';
import { VERTEX_SHADER } from '../utills/Nebula-shaders';

const startTime = +new Date();

class StarfieldPallete {
  constructor(container, params) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.setParams(params);

    this.renderer = new THREE.WebGLRenderer();
    this.loader = new THREE.TextureLoader();
    this.mousePosition = new THREE.Vector4();
    this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.counter = 0;

    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';

    this.renderer.domElement.addEventListener('mousedown', () => {
      this.mousePosition.setZ(1);
      this.counter = 0;
    });

    this.renderer.domElement.addEventListener('mouseup', () => {
      this.mousePosition.setZ(0);
    });

    this.renderer.domElement.addEventListener('mousemove', (event) => {
      this.mousePosition.setX(event.clientX);
      this.mousePosition.setY(this.height - event.clientY);
    });

    this.targetA = new BufferManager(this.renderer, {
      width: this.width,
      height: this.height,
    });
    this.targetB = new BufferManager(this.renderer, {
      width: this.width,
      height: this.height,
    });
    this.targetC = new BufferManager(this.renderer, {
      width: this.width,
      height: this.height,
    });
    this.scrollTop = 0;
  }

  setParams(params) {
    this.params = params;
  }

  start() {
    const resolution = new THREE.Vector3(
      this.width,
      this.height,
      window.devicePixelRatio
    );

    this.loader.setCrossOrigin('');

    this.bufferA = new BufferShader(BUFFER_A_FRAG, {
      iFrame: {
        value: 0,
      },
      iResolution: {
        value: resolution,
      },
      iMouse: {
        value: this.mousePosition,
      },
      iChannel0: {
        value: null,
      },
      iChannel1: {
        value: null,
      },
    });

    this.bufferB = new BufferShader(BUFFER_B_FRAG, {
      iFrame: {
        value: 0,
      },
      iResolution: {
        value: resolution,
      },
      iMouse: {
        value: this.mousePosition,
      },
      iChannel0: {
        value: null,
      },
    });

    this.bufferImage = new BufferShader(BUFFER_FINAL_FRAG, {
      iResolution: {
        value: resolution,
      },
      iMouse: {
        value: this.mousePosition,
      },
      iChannel0: {
        value: null,
      },
      iChannel1: {
        value: null,
      },
      iTime: {
        value: 0.0,
      },
      starSize: {
        value: this.params.starSize,
      },
      numStars: {
        value: this.params.starSize,
      },
      bgLightness: {
        value: this.params.bgLightness,
      },
    });

    this.animate();
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== this.width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
    }
  }

  animate() {
    requestAnimationFrame(() => {
      this.resizeCanvasToDisplaySize();

      this.bufferA.uniforms['iFrame'].value = this.counter++;
      this.bufferA.uniforms['iChannel0'].value =
        this.targetA.readBuffer.texture;
      this.bufferA.uniforms['iChannel1'].value =
        this.targetB.readBuffer.texture;
      this.targetA.render(this.bufferA.scene, this.orthoCamera);
      this.bufferB.uniforms['iChannel0'].value =
        this.targetB.readBuffer.texture;
      this.targetB.render(this.bufferB.scene, this.orthoCamera);
      this.bufferImage.uniforms['iChannel0'].value =
        this.targetA.readBuffer.texture;
      this.bufferImage.uniforms['iTime'].value =
        (+new Date() - startTime) / this.params.animationSpeed;

      this.bufferImage.uniforms['numStars'].value = this.params.numStars;
      this.bufferImage.uniforms['starSize'].value = this.params.starSize;
      this.bufferImage.uniforms['bgLightness'].value = this.params.bgLightness;

      this.targetC.render(this.bufferImage.scene, this.orthoCamera, true);

      this.animate();
    });
  }
}

class BufferShader {
  constructor(fragmentShader, uniforms = {}) {
    this.uniforms = uniforms;
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: VERTEX_SHADER,
      uniforms: uniforms,
    });

    this.scene = new THREE.Scene();
    this.scene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material)
    );
  }
}

class BufferManager {
  constructor(renderer, size) {
    this.renderer = renderer;

    this.readBuffer = new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
    });

    this.writeBuffer = this.readBuffer.clone();
  }

  swap() {
    const temp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = temp;
  }

  render(scene, camera, toScreen = false) {
    if (toScreen) {
      this.renderer.render(scene, camera);
    } else {
      this.renderer.setRenderTarget(this.writeBuffer);
      this.renderer.clear();
      this.renderer.render(scene, camera);
      this.renderer.setRenderTarget(null);
    }
    this.swap();
  }
}

function Starfield({ numStars, starSize, bgLightness, animationSpeed }) {
  const ref = useRef(null);

  const appRef = useRef(null);
  useEffect(() => {
    let app = appRef.current;
    if (!app) {
      app = new StarfieldPallete(ref.current, {
        numStars,
        starSize,
        bgLightness,
        animationSpeed,
      });
      app.start();
      appRef.current = app;
    } else {
      app.setParams({
        numStars,
        starSize,
        bgLightness,
        animationSpeed,
      });
    }
  }, [numStars, starSize, bgLightness, animationSpeed]);

  return <div className='starfield' ref={ref}></div>;
}

export default React.memo(Starfield);
