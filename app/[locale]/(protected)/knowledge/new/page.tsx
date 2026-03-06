import ArticleForm from "./article-form";

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">
        Submit an article
      </h1>
      <ArticleForm />
    </div>
  );
}
