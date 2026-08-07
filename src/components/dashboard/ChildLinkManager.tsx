"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/core/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LinkedChild {
  id: string;
  fullName: string;
  relationship: "parent" | "teacher";
}

interface ChildLinkManagerProps {
  onChanged?: () => void;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function ChildLinkManager({ onChanged }: ChildLinkManagerProps) {
  const [myId, setMyId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<string>("student");
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [childCode, setChildCode] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchState = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const { data: links } = await supabase
      .from("parent_child_links")
      .select("child_id, relationship_type")
      .eq("parent_id", user.id);
    const ids = (links ?? []).map((l) => l.child_id as string);

    let childrenRows: LinkedChild[] = [];
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      childrenRows = (links ?? []).map((l) => {
        const p = (profiles ?? []).find((x) => x.id === l.child_id);
        return {
          id: l.child_id as string,
          fullName: (p?.full_name as string) ?? "Anak",
          relationship: (l.relationship_type as "parent" | "teacher") ?? "parent",
        };
      });
    }

    return {
      myId: user.id,
      myRole: (profile?.role as string) ?? "student",
      children: childrenRows,
    };
  }, []);

  useEffect(() => {
    fetchState().then((state) => {
      if (!state) return;
      setMyId(state.myId);
      setMyRole(state.myRole);
      setChildren(state.children);
    });
  }, [fetchState]);

  const isGuardian = myRole === "parent" || myRole === "teacher";

  const handleAdd = async () => {
    setStatus(null);
    const code = childCode.trim();
    if (!isUuid(code)) {
      setStatus({
        type: "error",
        message: "Kode link tidak valid. Minta anak salin kode dari halaman ini.",
      });
      return;
    }
    if (code === myId) {
      setStatus({ type: "error", message: "Kode milik Anda sendiri." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("parent_child_links").insert({
      parent_id: myId!,
      child_id: code,
      relationship_type: myRole === "teacher" ? "teacher" : "parent",
    });
    setBusy(false);
    if (error) {
      setStatus({
        type: "error",
        message: error.message.includes("duplicate")
          ? "Anak sudah tertaut."
          : error.message.includes("foreign key")
            ? "Kode tidak terdaftar sebagai pengguna."
            : "Gagal menautkan anak.",
      });
      return;
    }
    setChildCode("");
    setStatus({ type: "success", message: "Anak berhasil ditautkan." });
    const state = await fetchState();
    if (state) {
      setMyId(state.myId);
      setMyRole(state.myRole);
      setChildren(state.children);
    }
    onChanged?.();
  };

  const handleRemove = async (childId: string) => {
    setStatus(null);
    const { error } = await supabase
      .from("parent_child_links")
      .delete()
      .eq("parent_id", myId!)
      .eq("child_id", childId);
    if (error) {
      setStatus({ type: "error", message: "Gagal menghapus tautan." });
      return;
    }
    const state = await fetchState();
    if (state) {
      setMyId(state.myId);
      setMyRole(state.myRole);
      setChildren(state.children);
    }
    onChanged?.();
  };

  const handleCopy = async () => {
    if (!myId) return;
    try {
      await navigator.clipboard.writeText(myId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setStatus({ type: "error", message: "Gagal menyalin kode." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kode Link Keluarga</CardTitle>
        <CardDescription>
          Bagikan kode ini agar orang tua / guru dapat memantau hafalan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs break-all text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {myId ?? "Memuat kode..."}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!myId}
          >
            {copied ? "Tersalin" : "Salin"}
          </Button>
        </div>

        {isGuardian && (
          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <Label htmlFor="childCode">Tautkan Anak / Siswa</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="childCode"
                  placeholder="Tempel kode link anak di sini"
                  value={childCode}
                  onChange={(e) => setChildCode(e.target.value)}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={busy || !childCode.trim()}
                  className="sm:w-auto"
                >
                  {busy ? "Menautkan..." : "Tautkan"}
                </Button>
              </div>
            </div>

            {children.length > 0 && (
              <ul className="flex flex-col gap-2">
                {children.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {c.fullName}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {c.relationship === "teacher" ? "Siswa" : "Anak"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(c.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {status && (
          <p
            className={
              status.type === "error"
                ? "text-sm text-red-600 dark:text-red-400"
                : "text-sm text-emerald-600 dark:text-emerald-400"
            }
            role="alert"
          >
            {status.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
