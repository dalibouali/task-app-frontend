import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/axios";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { UrlData , BrokenLink } from "../services/urlService";

export default function Details() {
  const { id } = useParams();
  const [url, setUrl] = useState<UrlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);

 useEffect(() => {
  api.get(`/urls/${id}`)
    .then(res => {
      setUrl(res.data);
      setBrokenLinks(res.data.brokenLinksList.map((b: any) => ({
        id: b.ID,
        url: b.URL,
        statusCode: b.StatusCode,
        urlId: b.UrlID
      })));
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load URL details:", err);
      setLoading(false);
    });
}, [id]);
  if (loading) return <p>Loading...</p>;
  if (!url) return <p>No data found for this URL.</p>;

  // prepare data for donut chart
  const chartData = [
    { name: "Internal", value: url.internalLinks },
    { name: "External", value: url.externalLinks }
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-400 underline">&larr; Back to dashboard</Link>

      <h1 className="text-3xl font-bold my-4">{url.title}</h1>
      <p className="mb-4"><strong>URL:</strong> {url.url}</p>

      <div className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>

      <div className="mt-6">
  <h2 className="text-xl font-semibold mb-2">Broken Links</h2>
  <p>Count: {url.brokenLinksCount}</p>
  <ul className="mt-2 space-y-1">
    {brokenLinks.map((link) => (
      <li key={link.id}>
        <span className="text-red-500">{link.url}</span>
        <span className="ml-2 text-gray-500">(Status: {link.statusCode})</span>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
}
