import KnowledgeList from "./knowledge-list";

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">
        Knowledge Library
      </h1>
      <p className="mb-6 text-default-500">
        Peer-reviewed treasury articles from the community.
      </p>
      <KnowledgeList />
    </div>
  );
}
