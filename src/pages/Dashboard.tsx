import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUrl,
  deleteUrl,
  getAllUrls,
  rerunUrl,
  stopUrl,
  UrlData,
} from "../services/urlService";
import { Dialog } from "@headlessui/react";

export default function Dashboard() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    loadUrls();

    const interval = setInterval(() => {
      loadUrls();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const loadUrls = () => {
    getAllUrls()
      .then((data) => {
        setUrls(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load URLs:", err);
        setLoading(false);
      });
  };
  const filteredUrls = urls.filter(
    (url) =>
      url.title.toLowerCase().includes(search.toLowerCase()) ||
      url.url.toLowerCase().includes(search.toLowerCase())
  );
  const handleAddUrl = async () => {
    if (!newUrl) return;
    await createUrl(newUrl);
    setNewUrl("");
    setIsOpen(false);
    loadUrls();
  };
  const onSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredUrls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUrls.map((u) => u.id));
    }
  };

  const handleGroupRerun = async () => {
    await Promise.all(selectedIds.map((id) => rerunUrl(id)));
    setSelectedIds([]);
    loadUrls();
  };

  const handleGroupDelete = async () => {
    await Promise.all(selectedIds.map((id) => deleteUrl(id)));
    setSelectedIds([]);
    loadUrls();
  };
  const handleGroupStop = async () => {
  await Promise.all(selectedIds.map(id => stopUrl(id)));
  setSelectedIds([]);
  loadUrls();
};

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by title or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-sky-600 rounded w-full"
          />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add URL
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleGroupRerun}
          disabled={selectedIds.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Re-run Analysis
        </button>
        <button
          onClick={handleGroupDelete}
          disabled={selectedIds.length === 0}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Delete Selected
        </button>
        <button
          onClick={handleGroupStop}
          disabled={selectedIds.length === 0}
          className="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
        >
          Stop Selected
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredUrls.length === 0 ? (
        <p>No URLs found matching your search.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600">
            <thead className="bg-sky-800">
              <tr>
                <th className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredUrls.length}
                    onChange={selectAll}
                  />
                </th>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">HTML</th>
                <th className="px-4 py-2">H1</th>
                <th className="px-4 py-2">H2</th>
                <th className="px-4 py-2">Internal</th>
                <th className="px-4 py-2">External</th>
                <th className="px-4 py-2">Broken</th>
                <th className="px-4 py-2">Login</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((url) => (
                <tr
                  key={url.id}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/details/${url.id}`)}
                >
                  <td
                    className="px-2 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(url.id)}
                      onChange={() => onSelect(url.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{url.url}</td>
                  <td className="px-4 py-2">{url.title}</td>
                  <td className="px-4 py-2">{url.htmlVersion}</td>
                  <td className="px-4 py-2">{url.h1Count}</td>
                  <td className="px-4 py-2">{url.h2Count}</td>
                  <td className="px-4 py-2">{url.internalLinks}</td>
                  <td className="px-4 py-2">{url.externalLinks}</td>
                  <td className="px-4 py-2">{url.brokenLinks}</td>
                  <td className="px-4 py-2">
                    {url.hasLoginForm ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        url.status === "done"
                          ? "bg-green-600"
                          : url.status === "running"
                          ? "bg-yellow-600"
                          : url.status === "queued"
                          ? "bg-blue-600"
                          : "bg-red-600"
                      }`}
                    >
                      {url.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Semi-transparent backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Centered modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white">Add a new URL</h2>

            <input
              type="text"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUrl}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
