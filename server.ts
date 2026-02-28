import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const db = new Database("research_group.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS research_areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_content TEXT NOT NULL,
    image_url TEXT,
    icon_name TEXT,
    icon_color TEXT,
    box_color TEXT,
    box_shape TEXT
  );
`);

// Ensure new columns exist if table was created before
const columns = ['icon_name', 'icon_color', 'box_color', 'box_shape'];
for (const col of columns) {
  try {
    db.prepare(`ALTER TABLE research_areas ADD COLUMN ${col} TEXT`).run();
  } catch (e) {}
}

db.exec(`
  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    journal TEXT NOT NULL,
    year INTEGER NOT NULL,
    link TEXT,
    journal_image_url TEXT,
    impact_factor TEXT
  );
`);

// Ensure impact_factor column exists if table was created before
try {
  db.prepare("ALTER TABLE publications ADD COLUMN impact_factor TEXT").run();
} catch (e) {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS professor (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT,
    linkedin_url TEXT,
    email TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_badge TEXT,
    hero_bg_color TEXT,
    hero_gradient_start TEXT,
    hero_gradient_end TEXT,
    secondary_bg_color TEXT,
    address TEXT,
    phone TEXT
  );
`);

// Ensure hero_badge column exists if table was created before
try {
  db.prepare("ALTER TABLE professor ADD COLUMN hero_badge TEXT").run();
} catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS specializations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cluster TEXT NOT NULL,
    label TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS academic_journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT,
    order_index INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS instruments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    specifications TEXT
  );

  CREATE TABLE IF NOT EXISTS conferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure new columns exist if table was created before
const profColumns = ['logo_url', 'hero_image_url', 'hero_title', 'hero_subtitle', 'hero_bg_color', 'hero_gradient_start', 'hero_gradient_end', 'secondary_bg_color', 'address', 'phone'];
for (const col of profColumns) {
  try {
    db.prepare(`ALTER TABLE professor ADD COLUMN ${col} TEXT`).run();
  } catch (e) {}
}

// Seed initial data if empty
const profCount = db.prepare("SELECT COUNT(*) as count FROM professor").get() as any;
if (profCount.count === 0) {
  db.prepare("INSERT INTO professor (id, name, bio, photo_url, linkedin_url, email, logo_url, hero_image_url, hero_title, hero_subtitle, hero_bg_color, hero_gradient_start, hero_gradient_end, secondary_bg_color, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    1,
    "Dr. Muhammad Saiful Islam Khan",
    "Dr. Muhammad Saiful Islam Khan is a distinguished researcher in Environmental Health and Analytical Chemistry. His work focuses on single-particle mineralogy, microplasma-induced degradation of pesticides, and advanced microbial detection techniques. With a strong background in environmental science and pollution research, he leads the E&H Research Group in developing innovative solutions for water treatment and atmospheric monitoring.",
    "https://picsum.photos/seed/prof/400/400",
    "https://linkedin.com",
    "msikhan@university.edu",
    "", // logo_url
    "https://picsum.photos/seed/hero/1920/1080", // hero_image_url
    "E&H Environmental Health Research Group", // hero_title
    "Investigating the complex interactions between environmental factors and human health to build a sustainable future.", // hero_subtitle
    "#0f172a", // hero_bg_color (slate-900)
    "#0f172a", // hero_gradient_start
    "transparent", // hero_gradient_end
    "#f8fafc", // secondary_bg_color (slate-50)
    "123 University Ave, Science Building, Room 405", // address
    "+1 (555) 000-0000" // phone
  );
}

// Seed specializations if empty
const specCount = db.prepare("SELECT COUNT(*) as count FROM specializations").get() as any;
if (specCount.count === 0) {
  const specs = [
    ['Food Systems & Safety', 'Non-thermal Plasma sterilization'],
    ['Food Systems & Safety', 'Food safety and hygiene'],
    ['Food Systems & Safety', 'Food Microbiology'],
    ['Food Systems & Safety', 'Food Chemistry'],
    ['Molecular Sciences', 'Biological chemistry'],
    ['Molecular Sciences', 'Analytical Chemistry'],
    ['Environmental Health', 'Aerosol analysis'],
    ['Environmental Health', 'Asbestos analysis (Mg-silicate minerals, cause of mesothelioma, potential health risk for developing country)']
  ];
  const stmt = db.prepare("INSERT INTO specializations (cluster, label) VALUES (?, ?)");
  specs.forEach(s => stmt.run(s[0], s[1]));
}

// Seed academic journey if empty
const journeyCount = db.prepare("SELECT COUNT(*) as count FROM academic_journey").get() as any;
if (journeyCount.count === 0) {
  const journey = [
    ['2015 - Present', 'Full Professor', 'University of Environment'],
    ['2010 - 2015', 'Associate Professor', 'Institute of Public Health'],
    ['2005 - 2010', 'Postdoctoral Fellow', 'National Research Lab']
  ];
  const stmt = db.prepare("INSERT INTO academic_journey (year, title, organization) VALUES (?, ?, ?)");
  journey.forEach(j => stmt.run(j[0], j[1], j[2]));
}

// Seed publications if empty
const pubCount = db.prepare("SELECT COUNT(*) as count FROM publications").get() as any;
if (pubCount.count === 0) {
  const publications = [
    ["Single-particle Mineralogy of Asbestos Mineral Particles by the Combined Use of Low-Z Particle EPMA and ATR-FTIR Imaging Techniques", "Muhammad Saiful Islam Khan; Hanjin Yoo; Li, Wu; Hayeong Lee; Minjeong Kim; Jonghyeon Park; Chul-Un Ro", "Asian Journal of Atmospheric Environment - Vol. 16, No. 4", 2022, null, null],
    ["Removal of different pesticides in water by microplasma: roles of individual radicles and the degradation pathways.", "Muhammad Saiful Islam Khan, and Yun-Ji Kim", "Environmental Science and Pollution Research 28 (7), 8296-8309", 2021, null, "5.8 (Elsevier)"],
    ["Identification and determination of byproducts originating from ozonation of chlorpyrifos and diazinon in water by liquid chromatography-mass spectrometry", "Yunheee Lee, Yunj-Ji Kim, Muhammad Saiful Islam Khan, Yun-Cheol Na", "Journal of Separation Science 43 (21), 4047-4057", 2020, null, "3.74 (Elsevier)"],
    ["A mechanistic and kinetic study of diazinone degradation under the influence of microplasma discharge water", "Muhammad Saiful Islam Khan, Seung Hyun Lee and Yun-Ji Kim", "Journal of Water Process Engineering, 36 (2020) 101310", 2020, null, "7.4 (Elsevier)"],
    ["Power of Scanning Electron Microscope and Energy Dispersive X-ray on Rapid Microbial Detection and Identification in Single Cell Level", "Muhammad Saiful Islam Khan, Se-Wook Oh, Yun-Ji Kim", "Scientific Reports, (2020) 10:2368", 2020, null, "4.6 (Nature)"],
    ["Dielectric barrier discharge (DBD) plasma induced flavonoid degradation kinetics and mechanism in water", "Muhammad Saiful Islam Khan, Yun-Ji Kim", "LWT - Food Science and Technology 118 (2020), 108777", 2020, null, "6.9 (Elsevier)"],
    ["Numerical and Experimental Investigation on Mixing in Multilayer Chaotic Micromixers with Crossing Structures", "Ahmed Fuwad, Shakhawat Hossain, Hyunil Ryu, Mubashshir Ahmad Ansari, Muhammad Saiful Islam Khan, Kwang-Yong Kim, Tae-Joon Jeon and Sun Min Kim", "Chemical Engineering & Technology 43 (2020), 9, 1–11", 2020, null, "3.74 (Willey)"],
    ["Roles of oxides of nitrogen on quality enhancement of soybean sprout during hydroponic production using plasma discharged water recycling technology", "Eun-Jung Lee, Muhammad Saiful Islam Khan & Yun-Ji Kim", "Scientific Reports (2018) 8:16872", 2018, null, "4.6 (Nature)"],
    ["Biofilm reduction potential of plasma discharged water against the microbes isolated from a tofu manufacturing plant", "Muhammad Saiful Islam Khan, Mi-Hyun Kim, Kwang-Won Lee, Yun-Ji Kim", "LWT - Food Science and Technology, 97 (2018) 719–724", 2018, null, "6.9 (Elsevier)"],
    ["Feed gas effect on plasma inactivation mechanism of Salmonella Typhimurium in onion and quality assessment of the treated sample", "Muhammad Saiful Islam Khan, Eun-Jung Lee, Suk-In Hong and Yun-Ji Kim", "Scientific Reports (2017) 7:17728", 2017, null, "4.6 (Nature)"],
    ["A submerged dielectric barrier discharge plasma inactivation mechanism of biofilms produced by Escherichia coli O157:H7, Cronobacter sakazakii, and Staphylococcus aureus", "Muhammad Saiful Islam Khan, Eun-Jung Lee and Yun-Ji Kim", "Scientific Reports, (2016) DOI: 10.1038/srep37072", 2016, null, "4.6 (Nature)"],
    ["Roles of individual radicals generated by a submerged dielectric barrier discharge plasma reactor during Escherichia coli O157:H7 inactivation", "M.S.I. Khan, U-J, Lee, Y-J, Kim", "AIP Advances (2015)", 2015, null, "1.6 (AIP)"],
    ["Molecular mass concentrations for a powdered SRM sample using a quantitative single particle analysis", "M.S.I. Khan, H. Hwang, H. Kim, C.-U. Ro", "Analytica Chimica Acta (2008), 619, p 16-19", 2008, null, "6.2 (Elsevier)"]
  ];

  const insertPub = db.prepare("INSERT INTO publications (title, authors, journal, year, link, impact_factor) VALUES (?, ?, ?, ?, ?, ?)");
  for (const pub of publications) {
    insertPub.run(...pub);
  }
}

const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
const researchCount = db.prepare("SELECT COUNT(*) as count FROM research_areas").get() as { count: number };

if (newsCount.count === 0) {
  db.prepare("INSERT INTO stats (label, value) VALUES (?, ?), (?, ?), (?, ?)").run(
    "Publications", "150+",
    "Impact Factor", "7.4 Max",
    "Research Projects", "20+"
  );

  db.prepare("INSERT INTO news (title, content, date, image_url) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)").run(
    "New Publication in Scientific Reports", "Our study on rapid microbial detection using SEM and EDX has been published.", "2024-02-15", "https://picsum.photos/seed/news1/800/600",
    "Grant for Asbestos Research", "We received funding to study asbestos mineral particles using ATR-FTIR imaging.", "2024-01-20", "https://picsum.photos/seed/news2/800/600",
    "Plasma Technology Breakthrough", "New findings on DBD plasma induced flavonoid degradation published in LWT.", "2023-12-05", "https://picsum.photos/seed/news3/800/600",
    "International Collaboration", "Collaborative research on chaotic micromixers published in Chemical Engineering & Technology.", "2023-11-10", "https://picsum.photos/seed/news4/800/600"
  );
}

if (researchCount.count === 0) {
  const areas = [
    [
      "Single Particle Analytical (SPA)",
      "Establishment of SPA technique using SEM/EDX and ATR-FTIR and/or in combination for rapid microbial detection and environmental aerosol analysis.",
      "Our group is pioneering the establishment of Single Particle Analytical (SPA) techniques. By combining Scanning Electron Microscopy with Energy Dispersive X-ray (SEM/EDX) and Attenuated Total Reflection Fourier-Transform Infrared (ATR-FTIR) imaging, we can identify individual microbial cells and environmental aerosol particles with unprecedented precision. This allows for rapid detection of pathogens and detailed characterization of atmospheric pollutants.",
      "https://picsum.photos/seed/spa-tech/800/600",
      "Microscope",
      "#3b82f6",
      "#ffffff",
      "rounded-xl"
    ],
    [
      "Plasma Sterilization",
      "Microbial inactivation of pathogens in both planktonic state and biofilm using atmospheric plasma.",
      "We study the efficacy of atmospheric non-thermal plasma in inactivating a wide range of foodborne pathogens. Our research delves into the inactivation mechanisms, specifically focusing on the roles of individual reactive species (radicals) generated by plasma. We evaluate these effects on both free-floating (planktonic) bacteria and complex microbial communities (biofilms) found in food processing environments.",
      "https://picsum.photos/seed/plasma-ster/800/600",
      "Zap",
      "#3b82f6",
      "#ffffff",
      "rounded-xl"
    ],
    [
      "Pesticide Decontamination",
      "Plasma decontamination of pesticides from fresh produce surfaces and studying inactivation mechanisms of individual radicals.",
      "This research focus aims to enhance food safety by using plasma-discharged water and direct plasma treatment to degrade harmful pesticides on fresh produce. We investigate the degradation pathways and ensure that the treatment maintains the nutritional and physical quality of the food, providing a chemical-free alternative to traditional washing methods.",
      "https://picsum.photos/seed/pesticide/800/600",
      "ShieldCheck",
      "#3b82f6",
      "#ffffff",
      "rounded-xl"
    ],
    [
      "Chemical & Physical Evaluation",
      "Evaluation of chemical (flavonoids, ascorbic acid extraction via HPLC and LC-MS) and physical quality of treated food samples.",
      "To ensure the safety and quality of plasma-treated foods, we perform rigorous chemical evaluations. Using High-Performance Liquid Chromatography (HPLC) and Liquid Chromatography-Mass Spectrometry (LC-MS), we analyze the stability of bioactive compounds like flavonoids and ascorbic acid. We also assess physical quality parameters to ensure that our decontamination methods are both effective and gentle.",
      "https://picsum.photos/seed/food-analysis/800/600",
      "Beaker",
      "#3b82f6",
      "#ffffff",
      "rounded-xl"
    ]
  ];

  const insertArea = db.prepare("INSERT INTO research_areas (title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  for (const area of areas) {
    insertArea.run(...area);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  app.get("/api/professor", (req, res) => {
    const data = db.prepare("SELECT * FROM professor WHERE id = 1").get();
    res.json(data);
  });

  app.post("/api/professor", (req, res) => {
    const { name, bio, photo_url, linkedin_url, email, logo_url, hero_image_url, hero_title, hero_subtitle, hero_badge, hero_bg_color, hero_gradient_start, hero_gradient_end, secondary_bg_color, address, phone } = req.body;
    console.log('Updating professor settings, logo_url:', logo_url);
    db.prepare("UPDATE professor SET name = ?, bio = ?, photo_url = ?, linkedin_url = ?, email = ?, logo_url = ?, hero_image_url = ?, hero_title = ?, hero_subtitle = ?, hero_badge = ?, hero_bg_color = ?, hero_gradient_start = ?, hero_gradient_end = ?, secondary_bg_color = ?, address = ?, phone = ? WHERE id = 1")
      .run(name, bio, photo_url, linkedin_url, email, logo_url, hero_image_url, hero_title, hero_subtitle, hero_badge, hero_bg_color, hero_gradient_start, hero_gradient_end, secondary_bg_color, address, phone);
    res.json({ success: true });
  });

  app.get("/api/specializations", (req, res) => {
    const data = db.prepare("SELECT * FROM specializations").all();
    res.json(data);
  });

  app.post("/api/specializations", (req, res) => {
    const { cluster, label } = req.body;
    db.prepare("INSERT INTO specializations (cluster, label) VALUES (?, ?)")
      .run(cluster, label);
    res.json({ success: true });
  });

  app.put("/api/specializations/:id", (req, res) => {
    const { cluster, label } = req.body;
    db.prepare("UPDATE specializations SET cluster = ?, label = ? WHERE id = ?")
      .run(cluster, label, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/specializations/:id", (req, res) => {
    db.prepare("DELETE FROM specializations WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/academic_journey", (req, res) => {
    const data = db.prepare("SELECT * FROM academic_journey").all();
    res.json(data);
  });

  app.post("/api/academic_journey", (req, res) => {
    const { year, title, organization } = req.body;
    db.prepare("INSERT INTO academic_journey (year, title, organization) VALUES (?, ?, ?)")
      .run(year, title, organization);
    res.json({ success: true });
  });

  app.put("/api/academic_journey/:id", (req, res) => {
    const { year, title, organization } = req.body;
    db.prepare("UPDATE academic_journey SET year = ?, title = ?, organization = ? WHERE id = ?")
      .run(year, title, organization, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/academic_journey/:id", (req, res) => {
    db.prepare("DELETE FROM academic_journey WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/news", (req, res) => {
    const data = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(data);
  });

  app.post("/api/news", (req, res) => {
    const { title, content, date, image_url } = req.body;
    db.prepare("INSERT INTO news (title, content, date, image_url) VALUES (?, ?, ?, ?)")
      .run(title, content, date, image_url);
    res.json({ success: true });
  });

  app.put("/api/news/:id", (req, res) => {
    const { title, date, content, image_url } = req.body;
    db.prepare("UPDATE news SET title = ?, date = ?, content = ?, image_url = ? WHERE id = ?")
      .run(title, date, content, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/news/:id", (req, res) => {
    db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/research", (req, res) => {
    const data = db.prepare("SELECT * FROM research_areas").all();
    res.json(data);
  });

  app.post("/api/research", (req, res) => {
    const { title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape } = req.body;
    db.prepare("INSERT INTO research_areas (title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape);
    res.json({ success: true });
  });

  app.put("/api/research/:id", (req, res) => {
    const { title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape } = req.body;
    db.prepare("UPDATE research_areas SET title = ?, description = ?, full_content = ?, image_url = ?, icon_name = ?, icon_color = ?, box_color = ?, box_shape = ? WHERE id = ?")
      .run(title, description, full_content, image_url, icon_name, icon_color, box_color, box_shape, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/research/:id", (req, res) => {
    db.prepare("DELETE FROM research_areas WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/publications", (req, res) => {
    const data = db.prepare("SELECT * FROM publications ORDER BY year DESC").all();
    res.json(data);
  });

  app.post("/api/publications", (req, res) => {
    const { title, authors, journal, year, link, journal_image_url, impact_factor } = req.body;
    db.prepare("INSERT INTO publications (title, authors, journal, year, link, journal_image_url, impact_factor) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(title, authors, journal, year, link, journal_image_url, impact_factor);
    res.json({ success: true });
  });

  app.put("/api/publications/:id", (req, res) => {
    const { title, authors, journal, year, impact_factor, link, journal_image_url } = req.body;
    db.prepare("UPDATE publications SET title = ?, authors = ?, journal = ?, year = ?, impact_factor = ?, link = ?, journal_image_url = ? WHERE id = ?")
      .run(title, authors, journal, year, impact_factor, link, journal_image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/publications/:id", (req, res) => {
    db.prepare("DELETE FROM publications WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Team API
  app.get("/api/team", (req, res) => {
    const data = db.prepare("SELECT * FROM team ORDER BY order_index ASC").all();
    res.json(data);
  });

  app.post("/api/team", (req, res) => {
    const { name, role, bio, photo_url, order_index } = req.body;
    db.prepare("INSERT INTO team (name, role, bio, photo_url, order_index) VALUES (?, ?, ?, ?, ?)")
      .run(name, role, bio, photo_url, order_index || 0);
    res.json({ success: true });
  });

  app.put("/api/team/:id", (req, res) => {
    const { name, role, bio, photo_url, order_index } = req.body;
    db.prepare("UPDATE team SET name = ?, role = ?, bio = ?, photo_url = ?, order_index = ? WHERE id = ?")
      .run(name, role, bio, photo_url, order_index || 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/team/:id", (req, res) => {
    db.prepare("DELETE FROM team WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Instruments API
  app.get("/api/instruments", (req, res) => {
    const data = db.prepare("SELECT * FROM instruments").all();
    res.json(data);
  });

  app.post("/api/instruments", (req, res) => {
    const { name, description, image_url, specifications } = req.body;
    db.prepare("INSERT INTO instruments (name, description, image_url, specifications) VALUES (?, ?, ?, ?)")
      .run(name, description, image_url, specifications);
    res.json({ success: true });
  });

  app.put("/api/instruments/:id", (req, res) => {
    const { name, description, image_url, specifications } = req.body;
    db.prepare("UPDATE instruments SET name = ?, description = ?, image_url = ?, specifications = ? WHERE id = ?")
      .run(name, description, image_url, specifications, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/instruments/:id", (req, res) => {
    db.prepare("DELETE FROM instruments WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Conferences API
  app.get("/api/conferences", (req, res) => {
    const data = db.prepare("SELECT * FROM conferences ORDER BY date DESC").all();
    res.json(data);
  });

  app.post("/api/conferences", (req, res) => {
    const { title, date, location, description, link, image_url } = req.body;
    db.prepare("INSERT INTO conferences (title, date, location, description, link, image_url) VALUES (?, ?, ?, ?, ?, ?)")
      .run(title, date, location, description, link, image_url);
    res.json({ success: true });
  });

  app.put("/api/conferences/:id", (req, res) => {
    const { title, date, location, description, link, image_url } = req.body;
    db.prepare("UPDATE conferences SET title = ?, date = ?, location = ?, description = ?, link = ?, image_url = ? WHERE id = ?")
      .run(title, date, location, description, link, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/conferences/:id", (req, res) => {
    db.prepare("DELETE FROM conferences WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const data = db.prepare("SELECT * FROM stats").all();
    res.json(data);
  });

  app.post("/api/stats", (req, res) => {
    const { label, value } = req.body;
    db.prepare("INSERT INTO stats (label, value) VALUES (?, ?)")
      .run(label, value);
    res.json({ success: true });
  });

  app.put("/api/stats/:id", (req, res) => {
    const { label, value } = req.body;
    db.prepare("UPDATE stats SET label = ?, value = ? WHERE id = ?")
      .run(label, value, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/stats/:id", (req, res) => {
    db.prepare("DELETE FROM stats WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/messages", (req, res) => {
    const { name, email, message } = req.body;
    db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)")
      .run(name, email, message);
    res.json({ success: true });
  });

  app.get("/api/messages", (req, res) => {
    const data = db.prepare("SELECT * FROM messages ORDER BY date DESC").all();
    res.json(data);
  });

  // Serve uploads
  app.use("/uploads", express.static(uploadsDir));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
