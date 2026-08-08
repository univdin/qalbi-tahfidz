"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MORAL_TAG_COLOR, MORAL_TAG_LABEL, type Story, type StoryNode } from "@/data/stories";

function parseRef(ref: string): { surah: number; ayah: number } {
  const [s, rest] = ref.split(":");
  const ayah = Number(rest.split("-")[0]);
  return { surah: Number(s), ayah };
}

interface StoryNodeData {
  node: StoryNode;
  onOpen: (ref: string) => void;
}

function StoryNodeCard({ data }: NodeProps) {
  const d = data as unknown as StoryNodeData;
  const { surah, ayah } = parseRef(d.node.ref);
  return (
    <div className="max-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
        {d.node.label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {d.node.ref}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            d.onOpen(d.node.ref);
          }}
          className="text-[11px] font-semibold text-emerald-600 hover:underline"
        >
          Buka ↗
        </button>
      </div>
      {d.node.tag && (
        <span
          className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: MORAL_TAG_COLOR[d.node.tag] }}
        >
          {MORAL_TAG_LABEL[d.node.tag]}
        </span>
      )}
      <span className="sr-only">Surah {surah}, ayat {ayah}</span>
    </div>
  );
}

interface Props {
  story: Story;
  onOpen: (ref: string) => void;
}

export function StoryGraph({ story, onOpen }: Props) {
  const nodes = useMemo(
    () =>
      story.nodes.map((n, i) => ({
        id: n.id,
        position: { x: 0, y: i * 150 },
        data: { node: n, onOpen } as StoryNodeData,
        type: "story",
      })) as unknown as Node[],
    [story, onOpen]
  );

  const edges: Edge[] = useMemo(
    () =>
      story.edges.map((e) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2 },
      })),
    [story]
  );

  const nodeTypes = useMemo(() => ({ story: StoryNodeCard }), []);

  return (
    <div className="h-[520px] w-full rounded-xl border border-slate-200 dark:border-slate-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export function useOpenReader() {
  const router = useRouter();
  return useCallback(
    (ref: string) => {
      const { surah, ayah } = parseRef(ref);
      router.push(`/reader/${surah}#ayah-${ayah}`);
    },
    [router]
  );
}
