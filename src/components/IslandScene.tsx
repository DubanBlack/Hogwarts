import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface IslandSceneProps {
  scrollProgress: number;
  onIslandClick?: (index: number) => void;
  overlayOpen?: boolean;
}

interface IslandData {
  position: THREE.Vector3;
  color: number;
  accentColor: number;
  image: string;
}

const ISLANDS: IslandData[] = [
  { position: new THREE.Vector3(0.5,  0.2, 0), color: 0x2a3a5a, accentColor: 0x4ECDC4, image: '/images/lore-island.jpg' },
  { position: new THREE.Vector3( 3.0, -0.8, -8), color: 0x3a2a5a, accentColor: 0x7B68EE, image: '/images/creatures-island.jpg' },
  { position: new THREE.Vector3( -2.0,  0.0, -16), color: 0x2a4a4a, accentColor: 0xD4AF37, image: '/images/gameplay-island.jpg' },
  { position: new THREE.Vector3( 2.5, -0.7, -24), color: 0x3a3a5a, accentColor: 0x4ECDC4, image: '/images/gallery-1.jpg' },
  { position: new THREE.Vector3(-2.2,  0.3, -32), color: 0x4a3a2a, accentColor: 0xD4AF37, image: '/images/roadmap-bg.jpg' },
];

const CAM_DISTANCE = 6;
const ISLAND_COLORS = ['#4ECDC4', '#7B68EE', '#D4AF37', '#4ECDC4', '#D4AF37'];
const ISLAND_NAMES = ['Clases', 'Personal', 'Jefes de casa', 'Premios anuales', 'Roadmap'];

export default function IslandScene({ scrollProgress, onIslandClick, overlayOpen }: IslandSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const islandGroupsRef = useRef<THREE.Group[]>([]);
  const frameRef = useRef(0);
  // scrollProgress viene ya calculado correctamente desde App (continuo 0..1)
  const scrollRef = useRef(scrollProgress);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hoveredIslandRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const islandMeshesRef = useRef<Map<THREE.Object3D, number>>(new Map());
  const onIslandClickRef = useRef(onIslandClick);

  useEffect(() => { onIslandClickRef.current = onIslandClick; }, [onIslandClick]);

  // Cuando se abre el overlay, limpiar hover ring y tooltip inmediatamente
  useEffect(() => {
    if (!overlayOpen) return;
    hoveredIslandRef.current = null;
    if (rendererRef.current) rendererRef.current.domElement.style.cursor = 'default';
    islandGroupsRef.current.forEach((group) => {
      const ring = group.userData.hoverRing as THREE.Mesh | undefined;
      if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
        ring.material.opacity = 0;
      }
    });
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
  }, [overlayOpen]);

  // Actualizar scrollRef inmediatamente cuando cambia el prop
  // Esto permite que al presionar un botón, la cámara responda de inmediato
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.012);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(ISLANDS[0].position.x * 0.4, ISLANDS[0].position.y + 1.5, ISLANDS[0].position.z + CAM_DISTANCE);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050508, 1);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;cursor:default;';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0x404080, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    const ptLight = new THREE.PointLight(0x4ECDC4, 1, 20);
    ptLight.position.set(0, 5, 0);
    scene.add(ptLight);

    const textureLoader = new THREE.TextureLoader();
    const islandGroups: THREE.Group[] = [];
    const meshToIslandMap = new Map<THREE.Object3D, number>();

    ISLANDS.forEach((island, index) => {
      const group = new THREE.Group();
      group.position.copy(island.position);

      textureLoader.load(island.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5, 1.2, 0.4, 32),
          new THREE.MeshStandardMaterial({ color: island.color, roughness: 0.8, metalness: 0.2 })
        );
        base.position.y = -0.2;
        base.userData.islandIndex = index;
        meshToIslandMap.set(base, index);
        group.add(base);

        const planeH = 2.5;
        const imagePlane = new THREE.Mesh(
          new THREE.PlaneGeometry(planeH * (16 / 9), planeH),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
        );
        imagePlane.position.y = 1.5;
        imagePlane.rotation.x = -0.1;
        imagePlane.userData.islandIndex = index;
        meshToIslandMap.set(imagePlane, index);
        group.add(imagePlane);

        const hitMesh = new THREE.Mesh(
          new THREE.SphereGeometry(2.2, 8, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        hitMesh.position.y = 0.8;
        hitMesh.userData.islandIndex = index;
        meshToIslandMap.set(hitMesh, index);
        group.add(hitMesh);

        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
          const radius = 1.8 + Math.random() * 1.5;
          const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.05 + Math.random() * 0.15, 0),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(island.color).multiplyScalar(0.7 + Math.random() * 0.3),
              roughness: 0.9,
            })
          );
          rock.position.set(Math.cos(angle) * radius, Math.random() * 2 - 0.5, Math.sin(angle) * radius);
          rock.userData = { orbitAngle: angle, orbitRadius: radius, orbitSpeed: 0.2 + Math.random() * 0.5, bobPhase: Math.random() * Math.PI * 2, bobSpeed: 0.5 + Math.random() };
          group.add(rock);
        }

        const glowLight = new THREE.PointLight(island.accentColor, 0.5, 5);
        glowLight.position.y = 1;
        group.add(glowLight);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.6, 1.78, 64),
          new THREE.MeshBasicMaterial({ color: island.accentColor, transparent: true, opacity: 0, side: THREE.DoubleSide })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.38;
        group.userData.hoverRing = ring;
        group.add(ring);

        group.scale.set(0, 0, 0);
        const delay = index * 0.3;
        let t = 0;
        const animIn = () => {
          t += 0.016;
          if (t > delay) {
            const s = 1 - Math.pow(1 - Math.min(1, (t - delay) / 1.5), 3);
            group.scale.set(s, s, s);
          }
          if (group.scale.x < 1) requestAnimationFrame(animIn);
        };
        animIn();
      });

      scene.add(group);
      islandGroups.push(group);
    });

    islandGroupsRef.current = islandGroups;
    islandMeshesRef.current = meshToIslandMap;

    const starsPos = new Float32Array(80000 * 3);
    for (let i = 0; i < starsPos.length; i++) starsPos[i] = (Math.random() - 0.5) * 200;
    const starsGeom = new THREE.BufferGeometry();
    starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const stars = new THREE.Points(
      starsGeom,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 })
    );
    scene.add(stars);

    const clock = new THREE.Clock();

    // smoothScroll es el valor suavizado internamente por el loop de animación.
    // scrollRef.current es la fuente de verdad (actualizada inmediatamente por App).
    let smoothScroll = scrollRef.current;

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
	  const time = elapsed * 0.5;
	  stars.material.opacity = 0.5 + Math.sin(time) * 0.1;  // Parpadeo suave
	  stars.rotation.y += 0.0002;
	  stars.rotation.x += 0.0001;
      const total = ISLANDS.length;

      const target = scrollRef.current;

      // Suavizado simple y uniforme: lerp constante.
      // No necesitamos lógica adaptativa porque App ya pasa el valor correcto
      // inmediatamente al presionar un botón O al hacer scroll continuo.
      const LERP = 0.07;
      smoothScroll += (target - smoothScroll) * LERP;

      // Si estamos muy cerca del destino, snap para evitar drift infinito
      if (Math.abs(target - smoothScroll) < 0.0001) {
        smoothScroll = target;
      }

      const clampedScroll = Math.max(0, Math.min(1, smoothScroll));

      // rawIdx es la posición continua entre islas (ej: 1.6 = 60% entre isla 1 y 2).
      // NO aplicamos easing aquí: el suavizado ya lo hace smoothScroll + CAM_LERP.
      // Aplicar easeInOutQuart sobre frac causaba aceleraciones bruscas laterales
      // porque la curva tiene pendiente máxima justo en el centro de la transición.
      const rawIdx = clampedScroll * (total - 1);
      const idx = Math.min(total - 2, Math.floor(rawIdx));
      const frac = rawIdx - idx;

      // Interpolación lineal directa entre islas — la suavidad viene del lerp de cámara
      let targetX: number, targetY: number, targetZ: number;
      let targetLookX: number, targetLookY: number, targetLookZ: number;

      if (idx < total - 1) {
        const curr = ISLANDS[idx].position;
        const next = ISLANDS[Math.min(total - 1, idx + 1)].position;
        targetX = curr.x + (next.x - curr.x) * frac;
        targetY = curr.y + (next.y - curr.y) * frac + 1.2;
        targetZ = curr.z + (next.z - curr.z) * frac + CAM_DISTANCE;
        // LookAt usa exactamente el mismo punto interpolado → cámara y mirada coherentes
        targetLookX = (curr.x + (next.x - curr.x) * frac) * 0.4;
        targetLookY = curr.y + (next.y - curr.y) * frac + 0.8;
        targetLookZ = curr.z + (next.z - curr.z) * frac;
      } else {
        const last = ISLANDS[total - 1].position;
        targetX = last.x;
        targetY = last.y + 1.2;
        targetZ = last.z + CAM_DISTANCE;
        targetLookX = last.x * 0.4;
        targetLookY = last.y + 0.8;
        targetLookZ = last.z;
      }

      // Lerp de posición de cámara
      const CAM_LERP = 0.055;
      camera.position.x += (targetX - camera.position.x) * CAM_LERP;
      camera.position.y += (targetY + Math.sin(elapsed * 0.3) * 0.2 - camera.position.y) * CAM_LERP;
      camera.position.z += (targetZ - camera.position.z) * CAM_LERP;

      // LookAt suavizado con su propio lerp para evitar giros bruscos de cámara
      // (si usamos camera.lookAt directo sin lerp, la rotación salta cada frame)
      const LOOK_LERP = 0.06;
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const worldPos = camera.position.clone().add(currentLookAt);
      const smoothLookX = worldPos.x + (targetLookX - worldPos.x) * LOOK_LERP;
      const smoothLookY = worldPos.y + (targetLookY - worldPos.y) * LOOK_LERP;
      const smoothLookZ = worldPos.z + (targetLookZ - worldPos.z) * LOOK_LERP;
      camera.lookAt(smoothLookX, smoothLookY, smoothLookZ);

      // Hover effect
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const allMeshes: THREE.Object3D[] = [];
      islandMeshesRef.current.forEach((_, mesh) => allMeshes.push(mesh));
      const hits = raycasterRef.current.intersectObjects(allMeshes, false);

      let newHovered: number | null = null;
      if (hits.length > 0) {
        const idx2 = islandMeshesRef.current.get(hits[0].object);
        if (idx2 !== undefined) newHovered = idx2;
      }

      if (newHovered !== hoveredIslandRef.current) {
        hoveredIslandRef.current = newHovered;
        renderer.domElement.style.cursor = newHovered !== null ? 'pointer' : 'default';

        islandGroups.forEach((group, i) => {
          const ring = group.userData.hoverRing as THREE.Mesh | undefined;
          if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
            ring.material.opacity = i === newHovered ? 0.8 : 0;
          }
        });

        if (tooltipRef.current) {
          if (newHovered !== null) {
            tooltipRef.current.style.opacity = '1';
            tooltipRef.current.textContent = `✦ ${ISLAND_NAMES[newHovered]}`;
            tooltipRef.current.style.color = ISLAND_COLORS[newHovered];
            tooltipRef.current.style.borderColor = ISLAND_COLORS[newHovered] + '50';
          } else {
            tooltipRef.current.style.opacity = '0';
          }
        }
      }

      islandGroups.forEach((group, i) => {
        group.position.y = ISLANDS[i].position.y + Math.sin(elapsed * 0.8 + i * 1.5) * 0.1;
        group.rotation.y = Math.sin(elapsed * 0.15 + i) * 0.05;
        group.children.forEach((child) => {
          if (child.userData.orbitAngle !== undefined) {
            child.userData.orbitAngle += child.userData.orbitSpeed * 0.005;
            child.position.x = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
            child.position.z = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
            child.position.y += Math.sin(elapsed * child.userData.bobSpeed + child.userData.bobPhase) * 0.002;
            child.rotation.x += 0.005;
            child.rotation.y += 0.003;
          }
        });
      });

      stars.rotation.y += 0.0002;
      renderer.render(scene, camera);
    }

    animate();

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    function onClick() {
      if (hoveredIslandRef.current !== null && onIslandClickRef.current) {
        onIslandClickRef.current(hoveredIslandRef.current);
      }
    }
    function onResize() {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      if (rendererRef.current) rendererRef.current.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0" style={{ zIndex: 1 }}>
      <div
        ref={tooltipRef}
        className="fixed bottom-1/3 left-1/2 -translate-x-1/2 pointer-events-none font-mono text-xs tracking-[0.15em] uppercase px-5 py-2 rounded-full border backdrop-blur-sm"
        style={{
          opacity: 0,
          transition: 'opacity 0.2s ease',
          background: 'rgba(5,5,8,0.85)',
          borderColor: 'rgba(78,205,196,0.4)',
          color: '#4ECDC4',
          zIndex: 20,
          whiteSpace: 'nowrap',
        }}
      />
    </div>
  );
}
