/**
 * Local order draft store — persists wizard/form progress to localStorage.
 * Allows users to switch between wizard and detailed form without losing data.
 */
import { useEffect, useState, useCallback } from "react";
import type { OrderPayload } from "@/types/storyloom";

const STORAGE_KEY = "storyloom:order-draft:v1";

export const emptyDraft: OrderPayload = {
  recipient: { firstName: "" },
  preferences: { genres: [], tones: [] },
  characters: {},
  setting: {},
  plot: { themes: [] },
  boundaries: { scaryLevel: "mild", violenceLevel: "cartoon", romance: "none", language: "clean" },
  design: {},
  package: { packageId: "story-bundle", formats: ["ebook"], isSeries: false, quantity: 1 },
};

export function loadDraft(): OrderPayload {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft;
    return { ...emptyDraft, ...JSON.parse(raw) };
  } catch {
    return emptyDraft;
  }
}

export function saveDraft(d: OrderPayload) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

export function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function useOrderDraft() {
  const [draft, setDraft] = useState<OrderPayload>(() => loadDraft());

  useEffect(() => { saveDraft(draft); }, [draft]);

  const update = useCallback((partial: Partial<OrderPayload>) => {
    setDraft((d) => ({ ...d, ...partial }));
  }, []);

  const updateSection = useCallback(
    <K extends keyof OrderPayload>(key: K, value: Partial<OrderPayload[K]>) => {
      setDraft((d) => ({ ...d, [key]: { ...(d[key] as object), ...(value as object) } } as OrderPayload));
    },
    [],
  );

  const reset = useCallback(() => {
    clearDraft();
    setDraft(emptyDraft);
  }, []);

  return { draft, setDraft, update, updateSection, reset };
}
