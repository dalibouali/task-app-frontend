import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUrls, UrlData } from "../services/urlService";

export default function Dashboard() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllUrls()
      .then(data => {
        setUrls(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load URLs:", err);
        setLoading(false);
      });
  }, []);

  const filteredUrls = urls.filter(url =>
    url.title.toLowerCase().includes(search.toLowerCase()) ||
    url.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search by title or URL..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border border-gray-600 rounded w-full sm:w-1/3"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredUrls.length === 0 ? (
        <p>No URLs found matching your search.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600">
            <thead className="bg-gray-800">
              <tr>
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
              {filteredUrls.map(url => (
                <tr
                  key={url.id}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/details/${url.id}`)}
                >
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
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      url.status === 'done' ? 'bg-green-600' :
                      url.status === 'running' ? 'bg-yellow-600' :
                      url.status === 'queued' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {url.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
