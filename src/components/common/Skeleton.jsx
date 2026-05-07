export default function Skeleton() {
  return (
    <div className="animate-pulse p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-300 h-20 rounded" />
      ))}
    </div>
  );
}