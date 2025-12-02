"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  GalleryHorizontalEnd,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

type StylePreset = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  gradient: string;
};

type AspectOption = {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
};

type GeneratedImage = {
  id: number;
  url: string;
  prompt: string;
  style: StylePreset;
  ratio: AspectOption;
};

const stylePresets: StylePreset[] = [
  {
    id: "dreamwave",
    name: "Dreamwave",
    description: "Ethereal neon gradients with cinematic glow.",
    prompt:
      "dreamy synthwave illustration, volumetric lighting, trending on artstation, ultra detailed, neon gradients, hyperreal lighting",
    gradient: "from-purple-500/80 via-fuchsia-500/70 to-sky-500/60",
  },
  {
    id: "aether",
    name: "Aether Sketch",
    description: "Hand-drawn lines with watercolor washes.",
    prompt:
      "elegant watercolor illustration, soft ink line art, studio ghibli palette, whimsical atmosphere, intricate details",
    gradient: "from-indigo-400/80 via-sky-400/70 to-emerald-400/60",
  },
  {
    id: "noir",
    name: "Noir Render",
    description: "Moody cinematic frames with high contrast lighting.",
    prompt:
      "cinematic concept art, dramatic chiaroscuro lighting, detailed textures, 35mm photography aesthetic, film grain, ultra realistic",
    gradient: "from-slate-400/80 via-gray-400/70 to-amber-400/60",
  },
];

const aspectOptions: AspectOption[] = [
  {
    id: "square",
    label: "Square 1:1",
    description: "Perfect for feeds and cover art.",
    width: 768,
    height: 768,
  },
  {
    id: "portrait",
    label: "Portrait 3:4",
    description: "Ideal for posters and vertical screens.",
    width: 768,
    height: 1024,
  },
  {
    id: "landscape",
    label: "Landscape 16:9",
    description: "Cinematic scenes and hero visuals.",
    width: 1024,
    height: 576,
  },
];

const quickPrompts = [
  "Futuristic rainforest city carved into ancient cliffs",
  "Astronaut discovering bioluminescent corals on Europa",
  "Portrait of a cybernetic queen with crystalline crown",
  "Floating library of books orbiting a glowing planet",
  "Minimalist product shot of a smart speaker in soft daylight",
];

const buildImageUrl = (
  prompt: string,
  style: StylePreset,
  ratio: AspectOption,
): string => {
  const seed = Math.floor(Math.random() * 1_000_000);
  const encoded = encodeURIComponent(`${prompt}, ${style.prompt}`);
  const params = new URLSearchParams({
    width: String(ratio.width),
    height: String(ratio.height),
    nologo: "true",
    enhance: "true",
    seed: String(seed),
    t: String(Date.now()),
  });

  return `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`;
};

const shimmerPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyMxMTIzMTYnLz48L3N2Zz4=";

export default function Home() {
  const [prompt, setPrompt] = useState(quickPrompts[0]);
  const [styleId, setStyleId] = useState(stylePresets[0].id);
  const [ratioId, setRatioId] = useState(aspectOptions[0].id);
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStyle = useMemo(
    () => stylePresets.find((preset) => preset.id === styleId) ?? stylePresets[0],
    [styleId],
  );

  const selectedRatio = useMemo(
    () => aspectOptions.find((option) => option.id === ratioId) ?? aspectOptions[0],
    [ratioId],
  );

  const handleGenerate = () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Add a creative prompt to begin.");
      return;
    }
    setError(null);
    setIsLoading(true);
    const url = buildImageUrl(trimmed, selectedStyle, selectedRatio);
    const newImage: GeneratedImage = {
      id: Date.now(),
      url,
      prompt: trimmed,
      style: selectedStyle,
      ratio: selectedRatio,
    };
    setActiveImage(newImage);
    setHistory((prev) =>
      [newImage, ...prev.filter((item) => item.id !== newImage.id)].slice(0, 8),
    );
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-14 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
      <div className="absolute inset-x-0 top-12 -z-10 flex justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-br from-fuchsia-500/40 to-sky-500/40 blur-3xl" />
      </div>

      <header className="relative rounded-3xl backdrop-glass p-[1px]">
        <div className="backdrop-glass relative rounded-3xl px-8 py-10 sm:px-12">
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 uppercase tracking-[0.2em] text-xs text-slate-200">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Instant AI Studio
            </span>
            <span className="hidden h-px flex-1 bg-white/10 sm:block" />
            <span className="rounded-full border border-white/10 px-4 py-2">
              Render-ready in seconds
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
                Paint ideas to life with <span className="text-sky-300">DreamCanvas AI</span>.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                Mix curated styles, cinematic ratios, and smart prompt templates to craft publication-ready images in one click.
                No tokens to juggle—just vivid concepts rendered on demand.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-400/10 px-4 py-2">
                  <Wand2 className="h-4 w-4 text-sky-300" />
                  Style-aware suggestions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-400/10 px-4 py-2">
                  <GalleryHorizontalEnd className="h-4 w-4 text-purple-300" />
                  Visual history trail
                </span>
              </div>
            </div>
            <div className="hidden h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-2xl shadow-sky-500/10 lg:flex lg:flex-col lg:gap-4">
              <h2 className="text-base font-medium text-slate-100">
                How it works
              </h2>
              <ol className="space-y-3 text-sm text-slate-300">
                <li>
                  ① Drop in a vision or tap a curated starter prompt built from creative briefs.
                </li>
                <li>
                  ② Pick a mood-driven style and best-fit aspect ratio tailored for your use case.
                </li>
                <li>
                  ③ Render instantly. Keep a gallery of the best takes and iterate without losing context.
                </li>
              </ol>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Powered by Pollinations AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-sky-500/10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">
                  Prompt Canvas
                </h2>
                <p className="text-sm text-slate-400">
                  Craft your narrative, then weaves in stylistic cues automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    quickPrompts[Math.floor(Math.random() * quickPrompts.length)],
                  )
                }
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-200 hover:border-sky-400/60 hover:bg-sky-400/10 transition"
              >
                Shuffle prompt
              </button>
            </div>
            <div className="space-y-5">
              <label htmlFor="prompt" className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Describe your scene
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Tell DreamCanvas what to illustrate…"
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/40"
              />

              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Quick inspiration
                </p>
                <div className="flex flex-wrap gap-3">
                  {quickPrompts.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setPrompt(sample)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        prompt === sample
                          ? "border-sky-400 bg-sky-400/15 text-sky-200"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/60 hover:bg-sky-400/10"
                      }`}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0px_20px_45px_-25px_rgba(56,189,248,0.3)]">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                Styles
              </p>
              <div className="space-y-4">
                {stylePresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setStyleId(preset.id)}
                    className={`group w-full rounded-2xl border bg-gradient-to-br px-5 py-4 text-left transition ${
                      preset.id === styleId
                        ? `${preset.gradient} border-sky-400/70 text-white shadow-lg shadow-sky-500/40`
                        : "border-white/10 from-slate-900/70 via-slate-900/60 to-slate-900/60 text-slate-200 hover:border-sky-400/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold">
                        {preset.name}
                      </span>
                      <span
                        className={`text-xs uppercase tracking-[0.3em] ${
                          preset.id === styleId ? "text-white/80" : "text-slate-400"
                        }`}
                      >
                        AI tuned
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        preset.id === styleId ? "text-slate-100/90" : "text-slate-300/90"
                      }`}
                    >
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0px_20px_45px_-25px_rgba(124,58,237,0.35)]">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                Aspect ratio
              </p>
              <div className="space-y-4">
                {aspectOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setRatioId(option.id)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                      option.id === ratioId
                        ? "border-purple-400 bg-purple-400/15 text-slate-100 shadow-lg shadow-purple-500/25"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-purple-400/60 hover:bg-purple-400/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">{option.label}</span>
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {option.width}×{option.height}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              {error ? <span className="text-rose-300">{error}</span> : "Powered by Pollinations AI • Unlimited renders"}
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rendering
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate artwork
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 shadow-2xl shadow-purple-500/20">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/40">
              <div className="absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-slate-950/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <div className="relative">
                <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
                  Live render
                </div>
                {activeImage ? (
                  <Image
                    key={activeImage.id}
                    src={activeImage.url}
                    alt={activeImage.prompt}
                    width={activeImage.ratio.width}
                    height={activeImage.ratio.height}
                    className={`h-full w-full object-cover transition duration-700 ${
                      isLoading ? "opacity-60" : "opacity-100"
                    }`}
                    onLoadingComplete={() => setIsLoading(false)}
                    placeholder="blur"
                    blurDataURL={shimmerPlaceholder}
                    sizes="(min-width: 1024px) 480px, 100vw"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-500">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-600" />
                      <p className="text-sm uppercase tracking-[0.2em]">
                        Your gallery starts here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {activeImage && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {activeImage.style.name}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {activeImage.ratio.label}
                  </span>
                </div>
                <p className="mt-4 text-base text-slate-200">
                  {activeImage.prompt}
                </p>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-100">
                  Session history
                </h3>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {history.length} capture{history.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-sky-400/60 hover:bg-sky-400/10"
                  >
                    <Image
                      src={item.url}
                      alt={item.prompt}
                      width={item.ratio.width}
                      height={item.ratio.height}
                      className="h-40 w-full rounded-xl object-cover"
                      sizes="(min-width: 640px) 280px, 100vw"
                      placeholder="blur"
                      blurDataURL={shimmerPlaceholder}
                    />
                    <div className="mt-3 space-y-2 text-xs text-slate-300">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.3em]">
                          {item.style.name}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.3em]">
                          {item.ratio.label}
                        </span>
                      </div>
                      <p className="text-slate-200">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
