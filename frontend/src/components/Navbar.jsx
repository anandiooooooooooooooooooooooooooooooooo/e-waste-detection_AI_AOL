export default function Navbar() {
  return (
    <nav
      className="border-b border-gray-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-80"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", height: 56 }}
    >
      <div
        className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between"
        style={{ height: 56 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wide gradient-text drop-shadow-lg">
            e-nfo
          </span>
          <span className="ml-3 text-xs font-semibold text-gray-400 italic bg-gray-800 px-2 py-1 rounded-lg shadow">
            YOLOv8 + Regression Model
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary px-3 py-0.5 text-sm rounded-md shadow-sm transition hover:bg-green-700">
            Documentation
          </button>
        </div>
      </div>
    </nav>
  );
}
