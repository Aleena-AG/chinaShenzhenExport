'use client';

import { useEffect, useRef, useState } from 'react';

type ModelViewer360Props = {
  url: string;
  className?: string;
};

export default function ModelViewer360({ url, className = '' }: ModelViewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !url) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let animationId: number = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let scene: import('three').Scene | null = null;
    let camera: import('three').PerspectiveCamera | null = null;
    let controls: import('three/examples/jsm/controls/OrbitControls.js').OrbitControls | null = null;
    let dracoLoader: import('three/examples/jsm/loaders/DRACOLoader.js').DRACOLoader | null = null;
    let resizeHandler: (() => void) | null = null;

    async function init() {
      try {
        const loadUrl =
          url.startsWith('http://') || url.startsWith('https://')
            ? `/api/proxy-model?url=${encodeURIComponent(url)}`
            : url;

        const fetchRes = await fetch(loadUrl);
        if (!mounted) return;
        if (!fetchRes.ok) {
          const text = await fetchRes.text();
          console.error('Model fetch failed', fetchRes.status, text.slice(0, 200));
          setError(`Could not load model (${fetchRes.status}). Try "Open in new tab".`);
          setLoading(false);
          return;
        }
        const blob = await fetchRes.blob();
        if (!mounted) return;
        if (blob.size === 0) {
          setError('Model file is empty.');
          setLoading(false);
          return;
        }
        const contentType = fetchRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await blob.text();
          const msg = (JSON.parse(json) as { error?: string })?.error || 'Server returned an error.';
          setError(msg);
          setLoading(false);
          return;
        }
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer, 0, 4);
        const isGlb = bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46;
        const isJson = bytes[0] === 0x7b;
        if (!isGlb && !isJson) {
          setError('Response is not a valid .glb file.');
          setLoading(false);
          return;
        }

        const THREE = await import('three');
        if (!mounted) return;
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
        if (!mounted || !containerRef.current) return;

        const c = containerRef.current;
        const width = c.clientWidth;
        const height = Math.min(c.clientHeight, 520);
        const aspect = width / height;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
        camera.position.set(2.2, 2.2, 2.2);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const dpr = Math.min(window.devicePixelRatio, 3);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        c.innerHTML = '';
        c.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 0.5;
        controls.maxDistance = 15;
        controls.maxPolarAngle = Math.PI;

        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.parse(
          arrayBuffer,
          '',
          (gltf) => {
            if (!mounted || !scene) return;
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            model.position.sub(center);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1.5 / maxDim;
            model.scale.multiplyScalar(scale);
            scene.add(model);
            setLoading(false);
          },
          (err) => {
            console.error('GLB parse error:', err);
            if (mounted) {
              setError('Invalid 3D model file. The link may not be a .glb model.');
              setLoading(false);
            }
          }
        );

        function animate() {
          if (!mounted) return;
          animationId = requestAnimationFrame(animate);
          controls?.update();
          if (renderer && scene && camera) renderer.render(scene, camera);
        }
        animate();

        resizeHandler = () => {
          const el = containerRef.current;
          if (!el || !camera || !renderer) return;
          const w = el.clientWidth;
          const h = Math.min(el.clientHeight, 520);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          const dpr = Math.min(window.devicePixelRatio, 3);
          renderer.setPixelRatio(dpr);
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', resizeHandler);
      } catch (e) {
        console.error('Three.js init error:', e);
        if (mounted) {
          setError('Could not load 3D viewer.');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      dracoLoader?.dispose();
      controls?.dispose();
      renderer?.dispose();
      if (renderer?.domElement?.parentNode) renderer.domElement.remove();
    };
  }, [url]);

  if (error) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-4 min-h-[280px] p-6 ${className}`}>
        <p className="text-gray-600 text-sm text-center max-w-sm">{error}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#db1f26] text-[#db1f26] hover:bg-[#db1f26] hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open 3D model in new tab
        </a>
        <p className="text-gray-400 text-xs text-center">You can view or download the model from the link above.</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200 bg-[#f5f5f5] ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5] z-10">
          <span className="text-gray-500 text-sm">Loading 3D model…</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full aspect-[4/3] min-h-[320px]"
        style={{ maxHeight: 520 }}
      />
    </div>
  );
}
