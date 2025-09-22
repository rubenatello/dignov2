export default function TopBar() {
  return (
    <div className="hidden md:block bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span className="text-gray-600">Sunday, September 22, 2025</span>
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium hover:bg-blue-600">
              SUBSCRIBE
            </button>
            <button className="text-gray-700 hover:text-black font-medium">
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}