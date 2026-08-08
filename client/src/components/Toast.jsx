export default function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <div className="toast-enter fixed bottom-5 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-xl border border-saffron/40 bg-ink px-5 py-3.5 text-sm font-semibold text-porcelain shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display tracking-wide">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-porcelain/60 hover:text-porcelain"
          aria-label="Cerrar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
