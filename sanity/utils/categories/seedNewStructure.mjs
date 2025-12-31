import client from "../getClient.mjs";

const rawCategories = [
  {
    title: "Headphones",
    slug: "headphones",
    url: "/products/headphones",
    icon: "headphones",
    groups: [
      {
        title: "By category",
        items: [
          { title: "Wired", slug: "wired" },
          { title: "Wireless", slug: "wireless" },
          { title: "Noise cancelling", slug: "noise-cancelling" },
          { title: "Earbuds", slug: "earbuds" },
        ],
      },
      {
        title: "By fit",
        items: [
          { title: "Over ear", slug: "over-ear" },
          { title: "In ear", slug: "in-ear" },
        ],
      },
      {
        title: "By use",
        items: [
          { title: "Studio and recording", slug: "studio-and-recording" },
          { title: "Gaming", slug: "gaming" },
          { title: "Travel", slug: "travel" },
        ],
      },
    ],
  },
  {
    title: "Speakers",
    slug: "speakers",
    url: "/products/speakers",
    icon: "speaker",
    groups: [
      {
        title: "Home theater",
        items: [
          { title: "Floor standing speakers", slug: "floor-standing-speakers" },
          { title: "Subwoofers", slug: "subwoofers" },
          { title: "Soundbars", slug: "soundbars" },
        ],
      },
      {
        title: "Home Audio",
        items: [
          { title: "Bookshelf speakers", slug: "bookshelf-speakers" },
          { title: "Powered speakers", slug: "powered-speakers" },
        ],
      },
      {
        title: "Portable & Outdoor",
        items: [
          { title: "Bluetooth speakers", slug: "bluetooth-speakers" },
          { title: "Outdoor speakers", slug: "outdoor-speakers" },
        ],
      },
    ],
  },
  {
    title: "Personal Audio",
    slug: "personal-audio",
    url: "/products/personal-audio",
    icon: "earbuds",
    groups: [
      {
        title: "Audio Players & Devices",
        items: [
          { title: "Digital Audio Players", slug: "digital-audio-players" },
          {
            title: "Bluetooth receivers and transmitters",
            slug: "bluetooth-receivers-and-transmitters",
          },
        ],
      },
      {
        title: "Amplification",
        items: [
          { title: "Portable DACs and Amps", slug: "portable-dacs-and-amps" },
          { title: "Headphone amplifiers", slug: "headphone-amplifiers" },
        ],
      },
      {
        title: "Accessories & Parts",
        items: [
          {
            title: "Phone and Tablet Accessories",
            slug: "phone-and-tablet-accessories",
          },
          {
            title: "Carrying Cases and Protection",
            slug: "carrying-cases-and-protection",
          },
          { title: "Replacement Parts", slug: "replacement-parts" },
        ],
      },
    ],
  },
  {
    title: "Home Audio",
    slug: "home-audio",
    url: "/products/home-audio",
    icon: "radio",
    groups: [
      {
        title: "Core components",
        items: [
          { title: "Amplifiers", slug: "amplifiers" },
          { title: "Receivers", slug: "receivers" },
          { title: "Preamps", slug: "preamps" },
        ],
      },
      {
        title: "Source devices",
        items: [
          { title: "Turntables", slug: "turntables" },
          { title: "CD players", slug: "cd-players" },
        ],
      },
      {
        title: "Signal processing",
        items: [
          {
            title: "DACs (Digital-to-Analog Converters)",
            slug: "dacs-digital-to-analog-converters",
          },
        ],
      },
    ],
  },
  {
    title: "Studio Equipment",
    slug: "studio-equipment",
    url: "/products/studio-equipment",
    icon: "mic2",
    groups: [
      {
        title: "Recording Essentials",
        items: [
          { title: "Microphones", slug: "microphones" },
          { title: "Studio monitors", slug: "studio-monitors" },
          { title: "Audio interfaces", slug: "audio-interfaces" },
        ],
      },
      {
        title: "Processing & Accessories",
        items: [
          { title: "Studio Processors", slug: "studio-processors" },
          { title: "Recording accessories", slug: "recording-accessories" },
        ],
      },
    ],
  },
  {
    title: "Accessories",
    slug: "accessories",
    url: "/products/accessories",
    icon: "cable",
    groups: [
      {
        title: "Cables & Wiring",
        items: [
          { title: "Audio cables", slug: "audio-cables" },
          { title: "Power cables", slug: "power-cables" },
          { title: "HDMI Cables", slug: "hdmi-cables" },
          { title: "RCA Cables", slug: "rca-cables" },
          { title: "USB Cables", slug: "usb-cables" },
          { title: "Headphone Cables", slug: "headphone-cables" },
          { title: "Ethernet Cables", slug: "ethernet-cables" },
        ],
      },
      {
        title: "Mounting & Support",
        items: [
          { title: "Wall mounts", slug: "wall-mounts" },
          { title: "Speaker stands", slug: "speaker-stands" },
        ],
      },
      {
        title: "Audio Equipment Accessories",
        items: [
          { title: "Phono Cartridges", slug: "phono-cartridges" },
          {
            title: "Speaker and Subwoofer accessories",
            slug: "speaker-and-subwoofer-accessories",
          },
          { title: "Microphone Accessories", slug: "microphone-accessories" },
        ],
      },
      {
        title: "Power Management",
        items: [{ title: "Power Management", slug: "power-management" }],
      },
    ],
  },
  {
    title: "On Sale",
    slug: "on-sale",
    url: "/products/on-sale",
    icon: null,
    groups: [],
  },
];

async function seedCategories() {
  // Use a transaction to bundle all creates
  const transaction = client.transaction();

  console.log("🚀 Initializing Category Seeding...");

  // We use a counter for top-level order to maintain the array order from JSON
  let sortOrder = 0;

  for (const parent of rawCategories) {
    const parentId = `category-${parent.slug}`;

    // 1. Create the Parent (Top-Level) Category
    // We use createOrReplace to make this idempotent (safe to run multiple times)
    transaction.createOrReplace({
      _id: parentId,
      _type: "category",
      title: parent.title,
      slug: { _type: "slug", current: parent.slug },
      icon: parent.icon,
      order: sortOrder++,
      metadata: {
        path: parent.slug, // e.g. "headphones"
        depth: 0,
      },
    });
    console.log(`+ Queueing Parent: ${parent.title}`);

    // 2. Create the Children (Sub-Categories)
    if (parent.groups && parent.groups.length > 0) {
      for (const group of parent.groups) {
        for (const item of group.items) {
          // Deterministic ID based on slug to prevent duplicates
          const childId = `category-${parent.slug}-${item.slug}`;
          const childPath = `${parent.slug}/${item.slug}`;

          transaction.createOrReplace({
            _id: childId,
            _type: "category",
            title: item.title,
            slug: { _type: "slug", current: item.slug },
            // Reference to parent
            parent: { _type: "reference", _ref: parentId },
            // Store the visual grouping here
            group: group.title,
            metadata: {
              path: childPath, // e.g. "headphones/wired"
              depth: 1,
            },
          });
          console.log(
            `  - Queueing Child: ${item.title} (Group: ${group.title})`
          );
        }
      }
    }
  }

  console.log("📦 Committing transaction to Sanity...");

  try {
    const result = await transaction.commit();
    console.log("✅ Successfully seeded categories!");
    console.log(`   Transaction ID: ${result.transactionId}`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
}

seedCategories();
