import { SrsDeck } from "@/components/deck/SrsDeck";

export const metadata = {
  title: "SRS Deck — QalbiTahfidz",
};

export default function DeckPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-8">
      <SrsDeck />
    </div>
  );
}
