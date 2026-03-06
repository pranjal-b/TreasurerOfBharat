import { Link } from "@/components/navigation";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-default-800">Admin</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/users" className="text-primary-500 hover:underline">
            Manage users
          </Link>
        </li>
        <li>
          <Link href="/admin/articles" className="text-primary-500 hover:underline">
            Manage articles
          </Link>
        </li>
        <li>
          <Link href="/admin/events" className="text-primary-500 hover:underline">
            Manage events
          </Link>
        </li>
        <li>
          <Link href="/admin/linkedin" className="text-primary-500 hover:underline">
            LinkedIn drafts
          </Link>
        </li>
      </ul>
    </div>
  );
}
