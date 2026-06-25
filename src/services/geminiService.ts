import JSZip from "jszip";

// ─────────────────────────────────────────────────────────────────────────────
// Fallback order:
//   1. Gemini models (multiple, in order)
//   2. OpenAI  (gpt-4o  →  gpt-4o-mini)
//   3. Claude  (claude-3-5-sonnet  →  claude-3-haiku)
// HTTP status codes that trigger a fallback to the next model/provider:
//   429 quota exceeded | 404 not found | 503 service unavailable
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_STATUSES = [429, 404, 503];

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
];

const OPENAI_MODELS = ["gpt-4o", "gpt-4o-mini"];

const CLAUDE_MODELS = [
  "claude-sonnet-4-5",
  "claude-3-5-sonnet-20241022",
  "claude-3-haiku-20240307",
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":  return "application/pdf";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "png":  return "image/png";
    case "webp": return "image/webp";
    case "heic": return "image/heic";
    case "heif": return "image/heif";
    case "txt":  return "text/plain";
    case "html": return "text/html";
    case "htm":  return "text/html";
    case "csv":  return "text/csv";
    case "md":   return "text/markdown";
    case "json": return "application/json";
    default:     return "";
  }
}

function uint8ArrayToBase64(uint8: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < uint8.byteLength; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return window.btoa(binary);
}

type ProcessedFile = { name: string; mimeType: string; base64Data: string };

async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  const result: ProcessedFile[] = [];

  for (const file of files) {
    const isZip =
      file.name.endsWith(".zip") ||
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed";

    if (isZip) {
      const zip = await JSZip.loadAsync(file);
      for (const [filename, zipObject] of Object.entries(zip.files)) {
        if (zipObject.dir) continue;
        if (
          filename.startsWith(".") ||
          filename.includes("__MACOSX") ||
          filename.split("/").some((p) => p.startsWith("."))
        ) continue;

        const mimeType = getMimeType(filename);
        if (!mimeType) continue;

        const contentUint8 = await zipObject.async("uint8array");
        result.push({ name: filename, mimeType, base64Data: uint8ArrayToBase64(contentUint8) });
      }
    } else {
      const mimeType = file.type || getMimeType(file.name) || "application/pdf";
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = (e) => reject(e);
      });
      result.push({ name: file.name, mimeType, base64Data });
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider: Gemini
// ─────────────────────────────────────────────────────────────────────────────

async function tryGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  processedFiles: ProcessedFile[]
): Promise<string | null> {
  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          ...processedFiles.map((pf) => ({
            inlineData: { mimeType: pf.mimeType, data: pf.base64Data },
          })),
        ],
      },
    ],
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );

  if (FALLBACK_STATUSES.includes(res.status)) {
    const err = await res.json().catch(() => ({}));
    console.warn(`[Gemini:${model}] status ${res.status} — falling back`, err);
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini API Error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.warn(`[Gemini:${model}] unexpected response structure — falling back`);
    return null;
  }

  console.log(`[AI] ✅ Success with Gemini model: ${model}`);
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider: OpenAI
// ─────────────────────────────────────────────────────────────────────────────

async function tryOpenAI(
  model: string,
  apiKey: string,
  systemPrompt: string,
  processedFiles: ProcessedFile[]
): Promise<string | null> {
  // Build content array: text prompt + base64 images (OpenAI supports image/* and PDFs via gpt-4o)
  const userContent: any[] = [{ type: "text", text: systemPrompt }];

  for (const pf of processedFiles) {
    if (pf.mimeType.startsWith("image/")) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${pf.mimeType};base64,${pf.base64Data}` },
      });
    } else {
      // For non-image files (PDF, txt, etc.) send as text description
      userContent.push({
        type: "text",
        text: `[File: ${pf.name} (${pf.mimeType}) — base64 content follows]\n${pf.base64Data}`,
      });
    }
  }

  const body = {
    model,
    messages: [{ role: "user", content: userContent }],
    max_tokens: 4096,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (FALLBACK_STATUSES.includes(res.status)) {
    const err = await res.json().catch(() => ({}));
    console.warn(`[OpenAI:${model}] status ${res.status} — falling back`, err);
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI API Error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    console.warn(`[OpenAI:${model}] unexpected response structure — falling back`);
    return null;
  }

  console.log(`[AI] ✅ Success with OpenAI model: ${model}`);
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider: Claude (Anthropic)
// ─────────────────────────────────────────────────────────────────────────────

async function tryClaude(
  model: string,
  apiKey: string,
  systemPrompt: string,
  processedFiles: ProcessedFile[]
): Promise<string | null> {
  const userContent: any[] = [];

  for (const pf of processedFiles) {
    if (pf.mimeType.startsWith("image/")) {
      userContent.push({
        type: "image",
        source: { type: "base64", media_type: pf.mimeType, data: pf.base64Data },
      });
    } else if (pf.mimeType === "application/pdf") {
      userContent.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: pf.base64Data },
      });
    } else {
      // Send text-based files as plain text
      try {
        const decoded = atob(pf.base64Data);
        userContent.push({ type: "text", text: `[File: ${pf.name}]\n${decoded}` });
      } catch {
        userContent.push({ type: "text", text: `[File: ${pf.name} — binary content omitted]` });
      }
    }
  }

  userContent.push({ type: "text", text: systemPrompt });

  const body = {
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content: userContent }],
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-allow-browser": "true",
    },
    body: JSON.stringify(body),
  });

  if (FALLBACK_STATUSES.includes(res.status)) {
    const err = await res.json().catch(() => ({}));
    console.warn(`[Claude:${model}] status ${res.status} — falling back`, err);
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Claude API Error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) {
    console.warn(`[Claude:${model}] unexpected response structure — falling back`);
    return null;
  }

  console.log(`[AI] ✅ Success with Claude model: ${model}`);
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main service export
// ─────────────────────────────────────────────────────────────────────────────

export const geminiService = {
  async extractOpportunityDetails(files: File[], systemPrompt: string): Promise<string> {
    const geminiKey    = import.meta.env.VITE_GEMINI_API_KEY;
    const openaiKey    = import.meta.env.VITE_OPENAI_API_KEY;
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    const processedFiles = await processFiles(files);

    if (processedFiles.length === 0) {
      throw new Error("No supported files (PDF, images, or text files) found to process.");
    }

    // ── 1. Try Gemini models ──────────────────────────────────────────────────
    if (geminiKey) {
      for (const model of GEMINI_MODELS) {
        try {
          const result = await tryGemini(model, geminiKey, systemPrompt, processedFiles);
          if (result) return result;
        } catch (err: any) {
          console.error(`[Gemini:${model}] non-retryable error:`, err.message);
          throw err;
        }
      }
      console.warn("[AI] All Gemini models exhausted — trying OpenAI...");
    }

    // ── 2. Try OpenAI models ──────────────────────────────────────────────────
    if (openaiKey) {
      for (const model of OPENAI_MODELS) {
        try {
          const result = await tryOpenAI(model, openaiKey, systemPrompt, processedFiles);
          if (result) return result;
        } catch (err: any) {
          console.error(`[OpenAI:${model}] non-retryable error:`, err.message);
          throw err;
        }
      }
      console.warn("[AI] All OpenAI models exhausted — trying Claude...");
    }

    // ── 3. Try Claude models ──────────────────────────────────────────────────
    if (anthropicKey && anthropicKey !== "your-anthropic-api-key-here") {
      for (const model of CLAUDE_MODELS) {
        try {
          const result = await tryClaude(model, anthropicKey, systemPrompt, processedFiles);
          if (result) return result;
        } catch (err: any) {
          console.error(`[Claude:${model}] non-retryable error:`, err.message);
          throw err;
        }
      }
      console.warn("[AI] All Claude models exhausted.");
    }

    // ── All providers exhausted ───────────────────────────────────────────────
    throw new Error(
      "AI Extraction failed: all available models across Gemini, OpenAI, and Claude have hit their quota or are unavailable. Please check your API keys and billing plans."
    );
  },
};
