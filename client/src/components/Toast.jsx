export default function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <div className="toast-enter fixed bottom-5 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-line bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p>{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/70 hover:text-white"
          aria-label="Cerrar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
