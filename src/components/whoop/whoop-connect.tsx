"use client";

import { useState } from "react";
import { useWhoopSync } from "@/hooks/use-whoop-data";

interface WhoopConnectProps {
  isConnected: boolean;
}

export function WhoopConnect({ isConnected }: WhoopConnectProps) {
  const { sync, syncing, error } = useWhoopSync();
  const [disconnecting, setDisconnecting] = useState(false);

  async function handleDisconnect() {
    setDisconnecting(true);
    await fetch("/api/whoop/disconnect", { method: "POST" });
    window.location.reload();
  }

  if (!isConnected) {
    return (
      <a
        href="/api/whoop/auth"
        className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">&#x231A;</span>
          <div>
            <p className="font-medium">Whoop</p>
            <p className="text-xs text-muted-foreground">Connect to sync recovery & strain</p>
          </div>
        </div>
        <span className="text-xs font-medium text-primary">Connect</span>
      </a>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">&#x231A;</span>
          <div>
            <p className="text-sm font-medium">Whoop</p>
            <p className="text-xs text-emerald-500">Connected</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={sync}
          disabled={syncing}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
