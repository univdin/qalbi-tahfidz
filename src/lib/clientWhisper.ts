interface WebGpuNavigator extends Navigator {
  gpu?: { requestAdapter(): Promise<unknown> };
}

export async function isWebGPUSupported(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const gpu = (navigator as WebGpuNavigator).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}

/**
 * Level 2 — transkripsi offline di browser via browser-whisper (WebGPU,
 * model whisper-base multilingual, di-cache di OPFS). Lazy import agar tidak
 * menambah bundle awal. Return null bila tidak dapat dipakai.
 */
export async function transcribeClientWhisper(
  audioBlob: Blob
): Promise<string | null> {
  try {
    const { BrowserWhisper } = await import("browser-whisper");
    const whisper = new BrowserWhisper({ model: "whisper-base", language: "ar" });
    const file = new File([audioBlob], "recording.webm", { type: audioBlob.type });
    const segments = await whisper.transcribe(file).collect();
    const text = segments.map((s) => s.text).join(" ").trim();
    return text || null;
  } catch (err) {
    console.warn("Client whisper (L2) gagal:", err);
    return null;
  }
}
