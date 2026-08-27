import { useState } from "react";
import { motion } from "motion/react";
import { Lock, LoaderCircle, TriangleAlert } from "lucide-react";
import { AskOneLogo } from "@/components/brand/AskOneLogo";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/state/AdminAuthContext";

export function AdminLockScreen() {
  const { unlock } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await unlock(password);
    setSubmitting(false);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-4 text-center">
      <AskOneLogo variant="icon" size="lg" className="mb-6" />
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-overlay/10 bg-overlay/[0.03] text-silver-400">
        <Lock size={18} />
      </div>
      <h1 className="font-display text-xl font-semibold text-silver-100">Admin access</h1>
      <p className="mt-1.5 text-sm text-silver-400">Enter the admin password to continue.</p>

      <form onSubmit={submit} className="mt-6 w-full">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="admin-input text-center"
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-state-danger"
          >
            <TriangleAlert size={12} /> Incorrect password.
          </motion.p>
        )}
        <Button type="submit" disabled={submitting || !password} className="mt-4 w-full">
          {submitting ? <LoaderCircle size={15} className="animate-spin" /> : "Unlock"}
        </Button>
      </form>
    </div>
  );
}
