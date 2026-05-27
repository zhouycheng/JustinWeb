import { readSiteContentBundle } from "@shared/content/read-content";
import { AdminWorkspace } from "@admin/components/admin-workspace";

export default async function AdminPage() {
  const initialData = readSiteContentBundle();

  return <AdminWorkspace initialData={initialData} />;
}
