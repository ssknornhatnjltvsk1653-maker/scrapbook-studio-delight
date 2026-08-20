import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Book from "@/components/Book";
import BackgroundFX from "@/components/BackgroundFX";
import KittyScreen from "@/components/KittyScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Scrapbook For My Hello Kitty Twinny 🍓" },
      {
        name: "description",
        content:
          "A cute handmade digital scrapbook full of silly memories and thank yous for my bestest twinny.",
      },
      { property: "og:title", content: "A Scrapbook For My Hello Kitty Twinny 🍓" },
      {
        property: "og:description",
        content:
          "A cute handmade digital scrapbook full of silly memories and thank yous for my bestest twinny.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [phase, setPhase] = useState<"opening" | "book" | "ending">("opening");

  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(() => setPhase("book"), 2600);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "ending") {
    return (
      <main className="scrap-stage flex min-h-screen flex-col items-center justify-center overflow-x-hidden p-3">
        <BackgroundFX />
        <KittyScreen
          mode="ending"
          title="the end 🤍"
          sub="ilysm my hello kitty twinny"
        />
      </main>
    );
  }

  return (
    <main className="scrap-stage flex min-h-screen flex-col items-center justify-center overflow-x-hidden p-3 sm:p-4">
      <BackgroundFX />
      {phase === "opening" && (
        <KittyScreen
          mode="opening"
          onSkip={() => setPhase("book")}
          title="opening your scrapbook"
          sub="one sec twinny…"
        />
      )}
      <h1 className="sr-only">A digital scrapbook for my bestest twinny</h1>
      <div className="scrap-book-shell">
        <Book onFinish={() => setPhase("ending")} />
      </div>
      <p className="scrap-hint mt-5 text-center">
        drag the page corner to flip 🎀
        <br />
        <span className="scrap-hint-small">
          keep flipping → sticker room → puzzle → mystery box ⭐
        </span>
      </p>
    </main>
  );
}
