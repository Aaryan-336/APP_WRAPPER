import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderButtonsProps {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

export function OrderButtons({ onUp, onDown, disableUp, disableDown }: OrderButtonsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-overlay/10">
      <button
        type="button"
        onClick={onUp}
        disabled={disableUp}
        aria-label="Move up"
        className="flex h-5 w-6 items-center justify-center text-silver-500 transition-colors duration-150 hover:bg-overlay/8 hover:text-silver-200 active:bg-overlay/12 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronUp size={12} />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        aria-label="Move down"
        className="flex h-5 w-6 items-center justify-center border-t border-overlay/10 text-silver-500 transition-colors duration-150 hover:bg-overlay/8 hover:text-silver-200 active:bg-overlay/12 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronDown size={12} />
      </button>
    </div>
  );
}
