import { useParams } from "react-router-dom";

export default function Details() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Details for URL with ID: {id}</h1>
      <p>This is where we'll display details of a specific link.</p>
    </div>
  );
}
