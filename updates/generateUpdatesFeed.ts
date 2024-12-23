import { Atom } from "jsr:@feed/feed";
import { dirname, join } from "jsr:@std/path";

interface Bug {
  title: string;
  link?: string;
  affected: string;
  fixed?: string;
}

interface Enhancement {
  title: string;
  link?: string;
  description?: string;
  version?: string;
}

interface UpdateData {
  [date: string]: {
    bugs?: Bug[];
    enhancements?: Enhancement[];
  };
}

const __dirname = dirname(new URL(import.meta.url).pathname);

const data: UpdateData = JSON.parse(
  await Deno.readTextFile(join(__dirname, "_index.json")),
);

const feed = new Atom({
  title: "Vanilla OS Updates",
  description: "Live feed of Vanilla OS updates and changes.",
  id: "https://info.vanillaos.org/updates-feed.xml",
  link: "https://vanillaos.org/",
  language: "en",
  updated: new Date(),
  feedLinks: {
    atom: "https://info.vanillaos.org/updates-feed.xml",
  },
  authors: [
    {
      name: "Vanilla OS Contributors",
      email: "info@vanillaos.org",
      link: "https://vanillaos.org/",
    },
  ],
  copyright: "Copyright (c) Vanilla OS Contributors",
});

Object.keys(data).forEach((date) => {
  const bugs: Bug[] = data[date].bugs || [];
  const enhancements: Enhancement[] = data[date].enhancements || [];

  bugs.forEach((bug: Bug) => {
    feed.addItem({
      title: `Bug Fix: ${bug.title}`,
      id: bug.link || "",
      link: bug.link || "",
      summary: `Affected: ${bug.affected}. Fixed in version: ${
        bug.fixed || "N/A"
      }.`,
      updated: new Date(date),
    });
  });

  enhancements.forEach((enhancement: Enhancement) => {
    feed.addItem({
      title: `Enhancement: ${enhancement.title}`,
      id: enhancement.link || "",
      link: enhancement.link || "",
      summary: `${enhancement.description || ""} Version: ${
        enhancement.version || "N/A"
      }.`,
      updated: new Date(date),
    });
  });
});

await Deno.writeTextFile(join(__dirname, "../updates-feed.xml"), feed.build());

console.log("Atom feed generated.");
