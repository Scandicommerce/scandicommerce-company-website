"use client";

import React, { useState } from "react";
import { Button, Card, Spinner, Stack, Text } from "@sanity/ui";

type Props = {
  id: string;
  itemId: string;
  paneKey: string;
  options?: Record<string, unknown>;
};

function getApiBase(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function CalendlySetup(props: Props) {
  const [syncLoading, setSyncLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSync = async () => {
    setMessage(null);
    setSyncLoading(true);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/calendly/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const created = data.created ?? 0;
        const skipped = data.skipped ?? 0;
        setMessage({
          type: "ok",
          text: data.message || `Sync done. Created: ${created}, Skipped: ${skipped}. Open Bookings to see them.`,
        });
      } else {
        setMessage({ type: "err", text: data.error || data.detail || `Request failed: ${res.status}` });
      }
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <Card padding={4} tone="transparent">
      <Stack space={4}>
        <Text size={1} weight="semibold">
          Calendly → Sanity sync
        </Text>
        <Text size={1} muted>
          Import existing Calendly meetings into Sanity. Click below to sync; then open Bookings to see the list.
        </Text>
        <Button
          text="Sync existing meetings"
          tone="primary"
          disabled={syncLoading}
          onClick={handleSync}
          icon={syncLoading ? () => <Spinner /> : undefined}
        />
        {message && (
          <Card padding={3} tone={message.type === "err" ? "critical" : "positive"} radius={2}>
            <Text size={1}>{message.text}</Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
