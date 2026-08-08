"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MAKHRAJ_ZONES } from "@/lib/makhraj";

const ZONE_3D: Record<string, [number, number, number]> = {
  jauf: [0, 0.2, 0],
  aqsal_halq: [-1.2, -1.2, 0],
  wasat_halq: [-0.8, -1.4, 0],
  adna_halq: [-0.4, -1.5, 0],
  aqsal_lisan: [-0.8, -0.4, 0.2],
  aqsal_lisan_kaf: [-0.5, -0.6, 0.1],
  wasat_lisan: [0, -0.7, 0],
  hafat_lisan: [0.2, -0.6, 0.5],
  adna_hafat: [0.4, -0.7, 0.3],
  taraf_lisan_nun: [0.6, -0.5, 0],
  taraf_lisan_ra: [0.7, -0.6, 0],
  taraf_lisan_ttd: [0.8, -0.2, 0],
  taraf_lisan_ssz: [0.9, -0.1, 0],
  ras_lisan: [1.0, 0.0, 0],
  batin_shafah: [1.3, -0.1, 0],
  shafatain: [1.5, 0.2, 0],
  khayshum: [0.6, 1.2, 0],
};

function Marker({ zoneId, active }: { zoneId: string; active: boolean }) {
  const zone = MAKHRAJ_ZONES.find((z) => z.id === zoneId);
  const p = ZONE_3D[zoneId] ?? [0, 0, 0];
  return (
    <mesh position={p}>
      <sphereGeometry args={[active ? 0.16 : 0.09, 20, 20]} />
      <meshStandardMaterial
        color={zone?.color ?? "#10b981"}
        emissive={active ? zone?.color ?? "#10b981" : "#000000"}
        emissiveIntensity={active ? 0.7 : 0}
      />
    </mesh>
  );
}

export function Makhraj3D({ activeZoneId }: { activeZoneId?: string }) {
  return (
    <div className="mt-3 h-72 w-full rounded-xl border border-slate-200 dark:border-slate-700">
      <Canvas camera={{ position: [2.6, 0.6, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.1} />
        {MAKHRAJ_ZONES.map((z) => (
          <Marker key={z.id} zoneId={z.id} active={z.id === activeZoneId} />
        ))}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
