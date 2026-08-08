import { redirect } from "next/navigation";
import { getSurahBySlug } from "@/lib/surahs";

export default async function BacaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) redirect("/reader");
  redirect(`/reader/${surah.number}`);
}
