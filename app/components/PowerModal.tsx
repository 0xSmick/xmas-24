interface PowerModalProps {
  title: string
  action: string
  onClose: () => void
}

export function PowerModal({ title, action, onClose }: PowerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{action}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          onClick={onClose}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

