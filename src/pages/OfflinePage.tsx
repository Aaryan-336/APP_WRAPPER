import { WifiOff } from "lucide-react";
import { OneAskLogo } from "@/components/brand/OneAskLogo";
import { Button } from "@/components/ui/button";

export function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <OneAskLogo variant="icon" size="lg" />
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-overlay/10 bg-overlay/[0.03] text-silver-400">
        <WifiOff size={22} />
      </div>
      <div>
        <h1 className="font-display text-xl font-semibold text-silver-100">You're offline</h1>
        <p className="mt-2 max-w-sm text-sm text-silver-400">
          ONE ASK couldn't reach the network. Reconnect to continue, or retry now.
        </p>
      </div>
      <Button variant="secondary" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}
