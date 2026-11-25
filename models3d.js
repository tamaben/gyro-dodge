// ============================================================================
// GYRO DODGE 3D — Realistic PBR Models, Procedural Textures & Environments
// ============================================================================
(() => {
  const CRAFT_CATALOG = [
    {
      id: "falcon",
      code: "VX-01",
      name: "FALCON",
      jpName: "ファルコン迎撃機",
      enName: "VX-01 Falcon",
      role: "超音速デルタ翼ジェット",
      enRole: "Supersonic Delta Interceptor",
      speedStat: 92,
      agilityStat: 86,
      armorStat: 80
    },
    {
      id: "valkyrie",
      code: "GX-07",
      name: "VALKYRIE",
      jpName: "ヴァルキリー試験機",
      enName: "GX-07 Valkyrie",
      role: "前進翼ジャイロ・ジンバル機",
      enRole: "Forward-Swept Gyro Fighter",
      speedStat: 86,
      agilityStat: 98,
      armorStat: 76
    },
    {
      id: "specter",
      code: "RX-12",
      name: "SPECTER",
      jpName: "スペクター重装機",
      enName: "RX-12 Specter",
      role: "双胴ステルス制空戦闘機",
      enRole: "Twin-Boom Stealth Striker",
      speedStat: 96,
      agilityStat: 82,
      armorStat: 94
    }
  ];

  const LIVERY_CATALOG = [
    { id: "titanium", name: "チタニウム・シルバー", enName: "Titanium Silver", primary: 0xe2e8f0, secondary: 0x334155, accent: 0x0ea5e9, burner: 0x38bdf8 },
    { id: "navy",     name: "ミッドナイト・ネイビー", enName: "Midnight Navy",   primary: 0x1e3a5f, secondary: 0x0f172a, accent: 0xf59e0b, burner: 0x38bdf8 },
    { id: "crimson",  name: "クリムゾン・エース",     enName: "Crimson Ace",     primary: 0xb91c1c, secondary: 0x1e293b, accent: 0xfbbf24, burner: 0xfb923c },
    { id: "desert",   name: "デザート・サンド",       enName: "Desert Sand",     primary: 0xd6bfa2, secondary: 0x44403c, accent: 0xea580c, burner: 0x60a5fa },
    { id: "emerald",  name: "エメラルド・スコードロン", enName: "Emerald Squadron", primary: 0x0f766e, secondary: 0x0f172a, accent: 0x34d399, burner: 0x2dd4bf }
  ];

  const CHAPTERS = [
    {
      chapter: 1, biome: "CANYON", stars: 1, hazardDensity: 0.88,
      name: "サンセット・キャニオン", enName: "Sunset Canyon",
      tag: "八角格納回廊", enTag: "Octagon Hangar", shape: "OCTAGON",
      desc: "夕焼けの赤土大渓谷｜岩塊・レーザーバー", enDesc: "Red-rock canyon at dusk | Boulders & gate bars",
      obsPool: ["BOULDER", "BARRIER", "MINE", "MONOLITH"],
      directPool: ["BOULDER", "MINE"],
      obsPrimaryHex: 0x7c2d12, obsGlowHex: 0xf97316,
      weatherHex: 0xfdba74, weatherVelY: -0.4, weatherSize: 0.2,
      skyTop: 0x172554, skyHorizon: 0xf97316, sunColor: 0xfde68a, sunPos: [0.35, 0.22, -1.0],
      fogHex: 0xd97746, waterHex: 0x1e3a5f, cliffHex: 0x9a3412, capHex: 0xd97706,
      corridorBg: 0x1a1412, floorHex: 0x292220, ribHex: 0x57534e, railHex: 0xf97316, lightHex: 0xfdba74, speedMult: 0.92
    },
    {
      chapter: 2, biome: "FJORD", stars: 1, hazardDensity: 0.92,
      name: "エメラルド・フィヨルド", enName: "Emerald Fjord",
      tag: "六角バイオドーム", enTag: "Hex Bio-Dome", shape: "HEXAGON",
      desc: "針葉樹林と氷河湾｜哨戒ドローン・岩柱", enDesc: "Nordic pine fjord | Patrol drones & sea stacks",
      obsPool: ["BOULDER", "DRONE", "MONOLITH", "MINE"],
      directPool: ["DRONE", "BOULDER"],
      obsPrimaryHex: 0x1e3a5f, obsGlowHex: 0x10b981,
      weatherHex: 0xd1fae5, weatherVelY: -0.6, weatherSize: 0.2,
      skyTop: 0x0c4a6e, skyHorizon: 0xbae6fd, sunColor: 0xffffff, sunPos: [-0.3, 0.48, -1.0],
      fogHex: 0x93c5fd, waterHex: 0x0369a1, cliffHex: 0x475569, capHex: 0x15803d,
      corridorBg: 0x0f1f1c, floorHex: 0x1a2e29, ribHex: 0x334155, railHex: 0x10b981, lightHex: 0x6ee7b7, speedMult: 0.95
    },
    {
      chapter: 3, biome: "SAKURA", stars: 2, hazardDensity: 0.97,
      name: "サクラ・シュライン", enName: "Sakura Shrine",
      tag: "千本鳥居回廊", enTag: "Torii Colonnade", shape: "TORII",
      desc: "水上の朱塗り鳥居と桜吹雪｜崩落鳥居・隔壁", enDesc: "Floating shrine & cherry blossoms | Torii beams",
      obsPool: ["TORII_GATE", "SHUTTER", "RING_TRAP", "MINE"],
      directPool: ["TORII_GATE", "SHUTTER"],
      obsPrimaryHex: 0xb91c1c, obsGlowHex: 0xf43f5e,
      weatherHex: 0xfbcfe8, weatherVelY: -2.4, weatherSize: 0.34,
      skyTop: 0x1e293b, skyHorizon: 0xfda4af, sunColor: 0xfff1f2, sunPos: [0.0, 0.28, -1.0],
      fogHex: 0xe2a8b4, waterHex: 0x1e3a5f, cliffHex: 0x57534e, capHex: 0xf472b6,
      corridorBg: 0x1c1217, floorHex: 0x2b2126, ribHex: 0xdc2626, railHex: 0xef4444, lightHex: 0xfecdd3, speedMult: 0.99
    },
    {
      chapter: 4, biome: "DESERT", stars: 2, hazardDensity: 1.02,
      name: "ゴールデン・デューン", enName: "Golden Dunes",
      tag: "ピラミッド石室", enTag: "Pyramid Vault", shape: "TRIANGLE",
      desc: "大砂丘と古代ピラミッド群｜砂岩オベリスク", enDesc: "Sand sea & giant pyramids | Sandstone obelisks",
      obsPool: ["SAND_PILLAR", "BOULDER", "BARRIER", "SHUTTER"],
      directPool: ["SAND_PILLAR", "BOULDER"],
      obsPrimaryHex: 0xa16207, obsGlowHex: 0xf59e0b,
      weatherHex: 0xfde047, weatherVelY: 0.5, weatherSize: 0.24,
      skyTop: 0x1e3a8a, skyHorizon: 0xfde047, sunColor: 0xfef9c3, sunPos: [0.42, 0.36, -1.0],
      fogHex: 0xd97706, waterHex: 0xd97706, cliffHex: 0xb45309, capHex: 0xfbbf24,
      corridorBg: 0x211b0d, floorHex: 0x362c16, ribHex: 0x854d0e, railHex: 0xf59e0b, lightHex: 0xfef08a, speedMult: 1.02
    },
    {
      chapter: 5, biome: "GLACIER", stars: 3, hazardDensity: 1.06,
      name: "クリスタル・グレイシャー", enName: "Crystal Glacier",
      tag: "氷晶クレバス", enTag: "Ice Crevasse", shape: "DIAMOND",
      desc: "極寒の氷山海と吹雪｜巨大氷柱・氷結晶", enDesc: "Arctic icebergs & snowfall | Jagged ice spires",
      obsPool: ["ICE_SPIRE", "CRYSTAL_CLUSTER", "SHUTTER", "RING_TRAP"],
      directPool: ["ICE_SPIRE", "CRYSTAL_CLUSTER"],
      obsPrimaryHex: 0x0284c7, obsGlowHex: 0x38bdf8,
      weatherHex: 0xffffff, weatherVelY: -3.2, weatherSize: 0.32,
      skyTop: 0x082f49, skyHorizon: 0xe0f2fe, sunColor: 0xffffff, sunPos: [-0.25, 0.4, -1.0],
      fogHex: 0xbae6fd, waterHex: 0x075985, cliffHex: 0x7dd3fc, capHex: 0xf8fafc,
      corridorBg: 0x081e2e, floorHex: 0x0f2d44, ribHex: 0x38bdf8, railHex: 0x0ea5e9, lightHex: 0xe0f2fe, speedMult: 1.05
    },
    {
      chapter: 6, biome: "SKY_ISLAND", stars: 3, hazardDensity: 1.10,
      name: "アルパイン・クラウドシー", enName: "Alpine Cloud Sea",
      tag: "成層圏リング", enTag: "Stratosphere Ring", shape: "CIRCLE",
      desc: "雲海に浮かぶ浮遊島と風車｜巨大回転ローター", enDesc: "Floating sky islands & wind turbines | Giant rotors",
      obsPool: ["CROSS_BLADE", "DRONE", "BARRIER", "RING_TRAP"],
      directPool: ["DRONE", "MINE"],
      obsPrimaryHex: 0x334155, obsGlowHex: 0x0ea5e9,
      weatherHex: 0xf8fafc, weatherVelY: 0.0, weatherSize: 0.26,
      skyTop: 0x0369a1, skyHorizon: 0xf0f9ff, sunColor: 0xfffbeb, sunPos: [0.15, 0.55, -1.0],
      fogHex: 0xe2e8f0, waterHex: 0xe2e8f0, cliffHex: 0x475569, capHex: 0x22c55e,
      corridorBg: 0x0f172a, floorHex: 0x1e293b, ribHex: 0x94a3b8, railHex: 0xf59e0b, lightHex: 0xbae6fd, speedMult: 1.08
    },
    {
      chapter: 7, biome: "RUINS", stars: 3, hazardDensity: 1.13,
      name: "エンシェント・モノリス", enName: "Ancient Monolith",
      tag: "古代列柱神殿", enTag: "Stone Temple", shape: "SQUARE",
      desc: "水没した古代巨石神殿｜石柱・可動石扉", enDesc: "Sunken megalith temple | Stone pillars & gates",
      obsPool: ["SAND_PILLAR", "MONOLITH", "SHUTTER", "BOULDER", "RING_TRAP"],
      directPool: ["SAND_PILLAR", "SHUTTER"],
      obsPrimaryHex: 0x57534e, obsGlowHex: 0xd97706,
      weatherHex: 0xfde68a, weatherVelY: 0.9, weatherSize: 0.24,
      skyTop: 0x1c1917, skyHorizon: 0xd6d3d1, sunColor: 0xfef3c7, sunPos: [-0.35, 0.25, -1.0],
      fogHex: 0xa8a29e, waterHex: 0x1e293b, cliffHex: 0x57534e, capHex: 0x78716c,
      corridorBg: 0x171412, floorHex: 0x292524, ribHex: 0x78716c, railHex: 0xd97706, lightHex: 0xfde68a, speedMult: 1.11
    },
    {
      chapter: 8, biome: "ABYSS", stars: 4, hazardDensity: 1.17,
      name: "アビス・ハイドロチューブ", enName: "Abyss Hydro-Tube",
      tag: "海底タービン管", enTag: "Subsea Turbine", shape: "TURBINE",
      desc: "深海海溝と発光ソナー｜深海魚雷ポッド・機雷", enDesc: "Deep-sea trench & sonar towers | Hydro torpedoes",
      obsPool: ["DEPTH_TORPEDO", "RING_TRAP", "CROSS_BLADE", "MINE", "SHUTTER"],
      directPool: ["DEPTH_TORPEDO", "MINE"],
      obsPrimaryHex: 0x0f766e, obsGlowHex: 0x2dd4bf,
      weatherHex: 0x99f6e4, weatherVelY: 2.8, weatherSize: 0.28,
      skyTop: 0x042f2e, skyHorizon: 0x115e59, sunColor: 0x99f6e4, sunPos: [0.0, 0.62, -1.0],
      fogHex: 0x0f766e, waterHex: 0x042f2e, cliffHex: 0x134e4a, capHex: 0x2dd4bf,
      corridorBg: 0x041f24, floorHex: 0x08333a, ribHex: 0x0e7490, railHex: 0x14b8a6, lightHex: 0x5eead4, speedMult: 1.14
    },
    {
      chapter: 9, biome: "FORGE", stars: 4, hazardDensity: 1.20,
      name: "クロックワーク・フォージ", enName: "Clockwork Forge",
      tag: "巨大歯車機関", enTag: "Giant Gearworks", shape: "GEAR",
      desc: "蒸気溶鉱炉と巨大機械工場｜回転大歯車・隔壁", enDesc: "Foundry furnaces & smokestacks | Spinning cogwheels",
      obsPool: ["STEAM_GEAR", "CROSS_BLADE", "SHUTTER", "BARRIER", "MONOLITH"],
      directPool: ["STEAM_GEAR", "SHUTTER"],
      obsPrimaryHex: 0x78350f, obsGlowHex: 0xf59e0b,
      weatherHex: 0xfb923c, weatherVelY: 2.5, weatherSize: 0.28,
      skyTop: 0x271709, skyHorizon: 0xd97706, sunColor: 0xfef3c7, sunPos: [0.28, 0.3, -1.0],
      fogHex: 0x92400e, waterHex: 0x291508, cliffHex: 0x451a03, capHex: 0xb45309,
      corridorBg: 0x1a120b, floorHex: 0x291d12, ribHex: 0xb45309, railHex: 0xf59e0b, lightHex: 0xfde68a, speedMult: 1.17
    },
    {
      chapter: 10, biome: "METROPOLIS", stars: 4, hazardDensity: 1.23,
      name: "ナイト・メトロポリス", enName: "Night Metropolis",
      tag: "湾岸ハイウェイ", enTag: "Bay Expressway", shape: "SQUARE",
      desc: "超高層ビル群の夜景湾岸｜高速ドローン・鉄骨塔", enDesc: "Illuminated high-rise bay | Interceptor drones & towers",
      obsPool: ["MONOLITH", "DRONE", "BARRIER", "SHUTTER", "RING_TRAP"],
      directPool: ["DRONE", "SHUTTER"],
      obsPrimaryHex: 0x0f172a, obsGlowHex: 0x38bdf8,
      weatherHex: 0x38bdf8, weatherVelY: -0.5, weatherSize: 0.22,
      skyTop: 0x020617, skyHorizon: 0x0f172a, sunColor: 0x38bdf8, sunPos: [-0.2, 0.18, -1.0],
      fogHex: 0x0f172a, waterHex: 0x020617, cliffHex: 0x0f172a, capHex: 0x38bdf8, isNight: true,
      corridorBg: 0x030712, floorHex: 0x0f172a, ribHex: 0x1e293b, railHex: 0x06b6d4, lightHex: 0x38bdf8, speedMult: 1.20
    },
    {
      chapter: 11, biome: "VOLCANO", stars: 5, hazardDensity: 1.27,
      name: "カルデラ・ボルケーノ", enName: "Caldera Volcano",
      tag: "地熱溶岩シャフト", enTag: "Magma Shaft", shape: "HEXAGON",
      desc: "煮え立つ溶岩海と火口群｜灼熱マグマ塊・結晶棘", enDesc: "Molten lava sea & craters | Magma meteors & spikes",
      obsPool: ["MAGMA_METEOR", "CRYSTAL_CLUSTER", "CROSS_BLADE", "BARRIER", "RING_TRAP"],
      directPool: ["MAGMA_METEOR", "CRYSTAL_CLUSTER"],
      obsPrimaryHex: 0x450a0a, obsGlowHex: 0xff4500,
      weatherHex: 0xf97316, weatherVelY: 3.8, weatherSize: 0.34,
      skyTop: 0x180808, skyHorizon: 0xdc2626, sunColor: 0xfca5a5, sunPos: [0.1, 0.16, -1.0],
      fogHex: 0x7f1d1d, waterHex: 0xdc2626, cliffHex: 0x1c1917, capHex: 0xea580c, isNight: true,
      corridorBg: 0x170909, floorHex: 0x261010, ribHex: 0x44403c, railHex: 0xef4444, lightHex: 0xf97316, speedMult: 1.24
    },
    {
      chapter: 12, biome: "SPACE", stars: 5, hazardDensity: 1.32,
      name: "オービタル・スターゲート", enName: "Orbital Stargate",
      tag: "軌道エレベーター", enTag: "Orbital Ring", shape: "VOID",
      desc: "衛星軌道と宇宙ステーション群｜隕石・全種複合トラップ", enDesc: "Deep-space orbital stations | Asteroids & omni-hazards",
      obsPool: ["MAGMA_METEOR", "STEAM_GEAR", "CROSS_BLADE", "DRONE", "RING_TRAP", "BARRIER", "ICE_SPIRE"],
      directPool: ["MAGMA_METEOR", "DRONE", "DEPTH_TORPEDO"],
      obsPrimaryHex: 0x1e293b, obsGlowHex: 0xa855f7,
      weatherHex: 0xe0f2fe, weatherVelY: 0.0, weatherSize: 0.26,
      skyTop: 0x01040d, skyHorizon: 0x0c1e3d, sunColor: 0xe0f2fe, sunPos: [0.4, 0.35, -1.0],
      fogHex: 0x071126, waterHex: 0x020617, cliffHex: 0x1e293b, capHex: 0x38bdf8, isNight: true,
      corridorBg: 0x020510, floorHex: 0x0b1326, ribHex: 0x334155, railHex: 0x38bdf8, lightHex: 0xfbbf24, speedMult: 1.28
    }
  ];

  // Shared Procedural Textures Cache
  const texCache = {};

  function getPanelTextures() {
    if (texCache.panel) return texCache.panel;
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#d8dee9";
    ctx.fillRect(0, 0, 256, 256);

    // Subtle brushed metal streaks
    for (let i = 0; i < 650; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 6, 28);
    }

    // Aerospace panel seams
    ctx.strokeStyle = "rgba(40, 52, 70, 0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 240, 116);
    ctx.strokeRect(8, 132, 116, 116);
    ctx.strokeRect(132, 132, 116, 116);
    ctx.beginPath();
    ctx.moveTo(64, 8); ctx.lineTo(64, 124);
    ctx.moveTo(192, 8); ctx.lineTo(192, 124);
    ctx.stroke();

    // Rivets along seams
    ctx.fillStyle = "rgba(30, 41, 59, 0.55)";
    for (let x = 18; x <= 238; x += 22) {
      ctx.fillRect(x, 12, 2, 2);
      ctx.fillRect(x, 118, 2, 2);
      ctx.fillRect(x, 136, 2, 2);
      ctx.fillRect(x, 242, 2, 2);
    }

    const map = new THREE.CanvasTexture(c);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 2);
    texCache.panel = { map, bump: map };
    return texCache.panel;
  }

  function getCarbonTexture() {
    if (texCache.carbon) return texCache.carbon;
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#1e2530";
    ctx.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 8) {
      for (let x = 0; x < 64; x += 8) {
        ctx.fillStyle = ((x + y) / 8) % 2 === 0 ? "#2d3748" : "#131922";
        ctx.fillRect(x, y, 7, 3);
        ctx.fillRect(x + 3, y + 4, 4, 3);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    texCache.carbon = tex;
    return tex;
  }

  function getHazardTexture() {
    if (texCache.hazard) return texCache.hazard;
    const c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#eab308";
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#18181b";
    for (let i = -128; i < 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 16, 0);
      ctx.lineTo(i - 48, 128);
      ctx.lineTo(i - 64, 128);
      ctx.closePath();
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    texCache.hazard = tex;
    return tex;
  }

  function getRockBumpTexture() {
    if (texCache.rock) return texCache.rock;
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);

    // Strata bands & craggy noise
    for (let y = 0; y < 256; y += 6) {
      const v = 100 + Math.floor(Math.sin(y * 0.14) * 35 + Math.random() * 30);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, 256, 6);
    }
    for (let i = 0; i < 900; i++) {
      const r = 2 + Math.random() * 14;
      const g = Math.random() > 0.5 ? 210 : 45;
      ctx.fillStyle = `rgba(${g},${g},${g},0.16)`;
      ctx.beginPath();
      ctx.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    texCache.rock = tex;
    return tex;
  }

  function getWaterBumpTexture() {
    if (texCache.water) return texCache.water;
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const w = 18 + Math.random() * 44;
      const h = 3 + Math.random() * 7;
      const bright = Math.random() > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
      ctx.fillStyle = bright;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, (Math.random() - 0.5) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(14, 24);
    texCache.water = tex;
    return tex;
  }

  function getDeckTexture() {
    if (texCache.deck) return texCache.deck;
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#475569";
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    for (let y = 0; y < 256; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }
    for (let x = 0; x < 256; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    // Center runway dashed guide
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(124, 16, 8, 96);
    ctx.fillRect(124, 144, 8, 96);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 22);
    texCache.deck = tex;
    return tex;
  }

  function getGlowTexture(hexColor = "#38bdf8") {
    const key = "glow_" + hexColor;
    if (texCache[key]) return texCache[key];
    const c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0.0, "#ffffff");
    g.addColorStop(0.24, hexColor);
    g.addColorStop(0.62, hexColor + "44");
    g.addColorStop(1.0, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    texCache[key] = tex;
    return tex;
  }

  // Build PMREM Environment Map for realistic metallic & canopy glass reflections
  function buildEnvironmentMap(renderer) {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envScene = new THREE.Scene();

      // Sky gradient sphere inside envScene
      const skyGeo = new THREE.SphereGeometry(60, 24, 16);
      const pos = skyGeo.attributes.position;
      const colors = [];
      const cTop = new THREE.Color(0x0ea5e9);
      const cHor = new THREE.Color(0xfef3c7);
      const cBot = new THREE.Color(0x1e293b);
      for (let i = 0; i < pos.count; i++) {
        const ny = pos.getY(i) / 60;
        const col = new THREE.Color();
        if (ny >= 0) col.copy(cHor).lerp(cTop, Math.pow(ny, 0.55));
        else col.copy(cHor).lerp(cBot, Math.min(1, -ny * 1.8));
        colors.push(col.r, col.g, col.b);
      }
      skyGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const skyMesh = new THREE.Mesh(
        skyGeo,
        new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })
      );
      envScene.add(skyMesh);

      // Bright sun specular card for crisp highlights on metallic wings & glass
      const sunDisc = new THREE.Mesh(
        new THREE.SphereGeometry(6, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      sunDisc.position.set(22, 26, -34);
      envScene.add(sunDisc);

      const rt = pmrem.fromScene(envScene, 0.03);
      pmrem.dispose();
      return rt.texture;
    } catch (e) {
      return null;
    }
  }

  // Helper: Create realistic Bubble Canopy + Pilot Cockpit Interior
  function buildCockpitAssembly(glassMat, darkMetalMat, zOffset = -0.35, lengthScale = 1.65) {
    const grp = new THREE.Group();

    // Recessed cockpit tub & seat headrest
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.24), darkMetalMat);
    seat.position.set(0, 0.18, zOffset + 0.22);
    seat.rotation.x = -0.22;
    grp.add(seat);

    // Pilot flight helmet + dark reflective visor
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.3, roughness: 0.25 })
    );
    helmet.position.set(0, 0.28, zOffset + 0.04);
    grp.add(helmet);

    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.125, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.08 })
    );
    visor.position.set(0, 0.29, zOffset - 0.03);
    grp.add(visor);

    // Holographic HUD combiner glass
    const hud = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.14),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
    );
    hud.position.set(0, 0.28, zOffset - 0.32);
    hud.rotation.x = -0.45;
    grp.add(hud);

    // Teardrop Canopy Glass
    const canopyGeo = new THREE.SphereGeometry(0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.56);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.scale.set(0.84, 0.66, lengthScale);
    canopy.position.set(0, 0.15, zOffset);
    grp.add(canopy);

    // Canopy metallic arch frame
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.022, 8, 20, Math.PI), darkMetalMat);
    arch.position.set(0, 0.16, zOffset - 0.18);
    grp.add(arch);

    return grp;
  }

  // Helper: Build Twin Segmented Jet Afterburner Nozzles + Shock Diamonds
  function buildAfterburnerNozzle(xPos, yPos, zPos, darkMat, burnerHex, animParts) {
    const unit = new THREE.Group();
    unit.position.set(xPos, yPos, zPos);

    // Titanium outer shroud & inner petal ring
    const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.48, 16, 1, true), darkMat);
    shroud.rotation.x = Math.PI / 2;
    unit.add(shroud);

    const innerRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.36, 14),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: burnerHex,
        emissiveIntensity: 0.85,
        roughness: 0.4
      })
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.z = -0.05;
    unit.add(innerRing);

    // Plume group scaled dynamically with throttle / boost
    const plumeGroup = new THREE.Group();
    plumeGroup.position.z = 0.22;

    const outerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.19, 1.65, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: burnerHex,
        transparent: true,
        opacity: 0.58,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    outerCone.rotation.x = Math.PI / 2;
    outerCone.position.z = 0.82;
    plumeGroup.add(outerCone);

    const coreCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.10, 1.05, 12),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    coreCone.rotation.x = Math.PI / 2;
    coreCone.position.z = 0.52;
    plumeGroup.add(coreCone);

    // Mach shock diamonds
    for (let d = 0; d < 3; d++) {
      const diamond = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.075 - d * 0.015, 0),
        new THREE.MeshBasicMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.75 - d * 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      diamond.scale.set(1, 1, 1.8);
      diamond.position.z = 0.35 + d * 0.36;
      plumeGroup.add(diamond);
    }

    unit.add(plumeGroup);

    // Volumetric glow sprite at nozzle exit
    const hexStr = "#" + new THREE.Color(burnerHex).getHexString();
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: getGlowTexture(hexStr),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    glowSprite.scale.set(1.15, 1.15, 1);
    glowSprite.position.z = 0.28;
    unit.add(glowSprite);

    animParts.flames.push(plumeGroup);
    animParts.glowSprites.push(glowSprite);
    return unit;
  }

  // Helper: Extruded Airfoil Wing Builder
  function makeExtrudedWing(points2D, thickness = 0.07, mat) {
    const shape = new THREE.Shape();
    shape.moveTo(points2D[0][0], points2D[0][1]);
    for (let i = 1; i < points2D.length; i++) {
      shape.lineTo(points2D[i][0], points2D[i][1]);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: thickness * 0.45,
      bevelThickness: thickness * 0.42
    });
    geo.rotateX(Math.PI / 2);
    geo.translate(0, thickness * 0.5, 0);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // =========================================================================
  // CREATE REALISTIC 3D AIRCRAFT (3 MODELS × CUSTOM LIVERY)
  // =========================================================================
  function createAircraft(modelId = "falcon", liveryObj = LIVERY_CATALOG[0]) {
    const root = new THREE.Group();
    const animParts = { flames: [], glowSprites: [], gimbals: [], strobes: [] };

    const panel = getPanelTextures();
    const carbonTex = getCarbonTexture();

    const hullMat = new THREE.MeshStandardMaterial({
      color: liveryObj.primary,
      map: panel.map,
      bumpMap: panel.bump,
      bumpScale: 0.018,
      metalness: 0.62,
      roughness: 0.28
    });

    const secMat = new THREE.MeshStandardMaterial({
      color: liveryObj.secondary,
      map: carbonTex,
      bumpMap: carbonTex,
      bumpScale: 0.012,
      metalness: 0.55,
      roughness: 0.38
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: liveryObj.accent,
      emissive: liveryObj.accent,
      emissiveIntensity: 0.22,
      metalness: 0.5,
      roughness: 0.25
    });

    const glassMat = new THREE.MeshPhysicalMaterial
      ? new THREE.MeshPhysicalMaterial({
          color: 0x0c4a6e,
          metalness: 0.15,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0,
          transparent: true,
          opacity: 0.78
        })
      : new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          metalness: 0.85,
          roughness: 0.08,
          transparent: true,
          opacity: 0.78
        });

    if (modelId === "valkyrie") {
      // ---------------------------------------------------------------------
      // GX-07 VALKYRIE: Forward-Swept Wing + Counter-Rotating Gyro Gimbals
      // ---------------------------------------------------------------------
      const podPts = [
        new THREE.Vector2(0.001, 2.05),
        new THREE.Vector2(0.14, 1.55),
        new THREE.Vector2(0.36, 0.85),
        new THREE.Vector2(0.46, 0.10),
        new THREE.Vector2(0.42, -0.75),
        new THREE.Vector2(0.28, -1.35),
        new THREE.Vector2(0.01, -1.48)
      ];
      const fuselageGeo = new THREE.LatheGeometry(podPts, 24);
      fuselageGeo.rotateX(-Math.PI / 2);
      const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
      fuselage.scale.set(1.15, 0.76, 1.0);
      fuselage.castShadow = true;
      root.add(fuselage);

      // Nose pitot needle
      const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.022, 0.48, 8), secMat);
      needle.rotation.x = -Math.PI / 2;
      needle.position.set(0, -0.02, -2.22);
      root.add(needle);

      root.add(buildCockpitAssembly(glassMat, secMat, -0.45, 1.55));

      // Forward-swept gull wings (left & right)
      [-1, 1].forEach((side) => {
        const wing = makeExtrudedWing([
          [side * 0.35, -0.25],
          [side * 1.98, -0.95],
          [side * 2.12, -0.52],
          [side * 0.42, 0.65]
        ], 0.06, hullMat);
        wing.rotation.z = side * 0.06;
        root.add(wing);

        // Leading-edge accent slat
        const slat = makeExtrudedWing([
          [side * 1.45, -0.72],
          [side * 2.02, -0.94],
          [side * 2.08, -0.74],
          [side * 1.52, -0.54]
        ], 0.065, accentMat);
        slat.rotation.z = side * 0.06;
        root.add(slat);

        // Outboard ramjet nacelle
        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.25, 14), secMat);
        nacelle.rotation.x = Math.PI / 2;
        nacelle.position.set(side * 1.15, -0.08, 0.38);
        root.add(nacelle);
      });

      // Dual Machined Gyroscope Gimbal Rings around mid-body
      const outerGimbal = new THREE.Group();
      const gRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.048, 12, 40), secMat);
      gRing1.rotation.x = Math.PI / 2.3;
      outerGimbal.add(gRing1);
      for (let b = 0; b < 4; b++) {
        const ang = (b / 4) * Math.PI * 2;
        const node = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), accentMat);
        node.position.set(Math.cos(ang) * 0.92, Math.sin(ang) * 0.92 * 0.4, Math.sin(ang) * 0.92 * 0.9);
        outerGimbal.add(node);
      }
      root.add(outerGimbal);

      const innerGimbal = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.036, 10, 36), accentMat);
      innerGimbal.rotation.y = Math.PI / 3;
      root.add(innerGimbal);
      animParts.gimbals.push(outerGimbal, innerGimbal);

      // Twin high-output nozzles
      root.add(buildAfterburnerNozzle(-0.32, -0.04, 1.32, secMat, liveryObj.burner, animParts));
      root.add(buildAfterburnerNozzle(0.32, -0.04, 1.32, secMat, liveryObj.burner, animParts));

    } else if (modelId === "specter") {
      // ---------------------------------------------------------------------
      // RX-12 SPECTER: Heavy Twin-Boom Stealth Strike Fighter
      // ---------------------------------------------------------------------
      const bodyPts = [
        new THREE.Vector2(0.001, 2.25),
        new THREE.Vector2(0.22, 1.45),
        new THREE.Vector2(0.52, 0.55),
        new THREE.Vector2(0.58, -0.45),
        new THREE.Vector2(0.44, -1.28),
        new THREE.Vector2(0.01, -1.42)
      ];
      const hullGeo = new THREE.LatheGeometry(bodyPts, 8); // Faceted stealth chines!
      hullGeo.rotateZ(Math.PI / 8);
      hullGeo.rotateX(-Math.PI / 2);
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.scale.set(1.28, 0.58, 1.0);
      hull.castShadow = true;
      root.add(hull);

      root.add(buildCockpitAssembly(glassMat, secMat, -0.52, 1.7));

      // Swept stealth main wings + twin tail booms + V-tails
      [-1, 1].forEach((side) => {
        const mainWing = makeExtrudedWing([
          [side * 0.42, -0.65],
          [side * 2.24, 0.42],
          [side * 2.15, 0.88],
          [side * 0.48, 0.72]
        ], 0.065, hullMat);
        root.add(mainWing);

        // Glowing plasma cooling louver on upper wing root
        const vent = new THREE.Mesh(
          new THREE.BoxGeometry(0.36, 0.03, 0.55),
          new THREE.MeshStandardMaterial({
            color: liveryObj.burner,
            emissive: liveryObj.burner,
            emissiveIntensity: 0.9
          })
        );
        vent.position.set(side * 0.72, 0.09, 0.15);
        root.add(vent);

        // Twin elongated stealth tail boom
        const boom = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 2.15), secMat);
        boom.position.set(side * 0.88, -0.02, 0.65);
        boom.castShadow = true;
        root.add(boom);

        // Inward-canted V-Tail stabilizer
        const vTail = makeExtrudedWing([
          [0, 0],
          [side * -0.42, 0.45],
          [side * -0.36, 0.78],
          [0, 0.52]
        ], 0.045, accentMat);
        vTail.rotation.z = side * 0.95;
        vTail.position.set(side * 0.88, 0.08, 1.15);
        root.add(vTail);
      });

      root.add(buildAfterburnerNozzle(-0.42, -0.03, 1.38, secMat, liveryObj.burner, animParts));
      root.add(buildAfterburnerNozzle(0.42, -0.03, 1.38, secMat, liveryObj.burner, animParts));

    } else {
      // ---------------------------------------------------------------------
      // VX-01 FALCON (Default): Supersonic Swept-Delta Aerospace Fighter
      // ---------------------------------------------------------------------
      const fusePts = [
        new THREE.Vector2(0.001, 2.32),
        new THREE.Vector2(0.11, 1.85),
        new THREE.Vector2(0.28, 1.18),
        new THREE.Vector2(0.45, 0.35),
        new THREE.Vector2(0.48, -0.55),
        new THREE.Vector2(0.38, -1.32),
        new THREE.Vector2(0.01, -1.48)
      ];
      const fuseGeo = new THREE.LatheGeometry(fusePts, 24);
      fuseGeo.rotateX(-Math.PI / 2);
      const fuse = new THREE.Mesh(fuseGeo, hullMat);
      fuse.scale.set(1.16, 0.68, 1.0);
      fuse.castShadow = true;
      fuse.receiveShadow = true;
      root.add(fuse);

      // Dark dielectric nosecone tip + Mach pitot tube
      const radome = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.55, 16), secMat);
      radome.rotation.x = -Math.PI / 2;
      radome.scale.set(1.1, 0.72, 1.0);
      radome.position.set(0, 0, -2.08);
      root.add(radome);

      const pitot = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.018, 0.44, 8), secMat);
      pitot.rotation.x = -Math.PI / 2;
      pitot.position.set(0, -0.01, -2.42);
      root.add(pitot);

      // Cockpit canopy + pilot + HUD
      root.add(buildCockpitAssembly(glassMat, secMat, -0.55, 1.72));

      // Twin Canted Supersonic Air Intakes + Cropped Delta Wings + Canards + Twin Tails
      [-1, 1].forEach((side) => {
        // Air intake duct
        const intake = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 1.38), hullMat);
        intake.position.set(side * 0.48, -0.06, -0.05);
        intake.rotation.z = side * 0.14;
        intake.castShadow = true;
        root.add(intake);

        const intakeMouth = new THREE.Mesh(
          new THREE.PlaneGeometry(0.28, 0.22),
          new THREE.MeshBasicMaterial({ color: 0x020617 })
        );
        intakeMouth.position.set(side * 0.48, -0.06, -0.75);
        intakeMouth.rotation.y = Math.PI;
        root.add(intakeMouth);

        // Main cropped-delta wing
        const wing = makeExtrudedWing([
          [side * 0.44, -0.55],
          [side * 2.15, 0.52],
          [side * 2.12, 0.96],
          [side * 0.44, 0.92]
        ], 0.062, hullMat);
        root.add(wing);

        // Carbon control-surface aileron/flap
        const flap = makeExtrudedWing([
          [side * 0.65, 0.82],
          [side * 1.88, 0.84],
          [side * 1.88, 0.99],
          [side * 0.65, 0.98]
        ], 0.042, secMat);
        root.add(flap);

        // Wingtip accent trim & missile rail
        const tipRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.96), accentMat);
        tipRail.position.set(side * 2.15, 0.03, 0.68);
        root.add(tipRail);

        // Forward canard
        const canard = makeExtrudedWing([
          [side * 0.30, -1.12],
          [side * 0.92, -0.74],
          [side * 0.88, -0.54],
          [side * 0.32, -0.68]
        ], 0.042, accentMat);
        root.add(canard);

        // Outward-canted vertical tail stabilizer
        const tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0);
        tailShape.lineTo(0.55, 0);
        tailShape.lineTo(0.82, 0.74);
        tailShape.lineTo(0.46, 0.78);
        tailShape.closePath();
        const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
          depth: 0.045,
          bevelEnabled: true,
          bevelSegments: 2,
          bevelSize: 0.015,
          bevelThickness: 0.015
        });
        tailGeo.rotateY(Math.PI / 2);
        const tailFin = new THREE.Mesh(tailGeo, secMat);
        tailFin.position.set(side * 0.44, 0.10, 0.62);
        tailFin.rotation.z = -side * 0.36;
        tailFin.castShadow = true;
        root.add(tailFin);

        // Aviation Navigation Strobe (Port = Red, Starboard = Green)
        const strobeHex = side < 0 ? "#ef4444" : "#22c55e";
        const strobe = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: getGlowTexture(strobeHex),
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        strobe.scale.set(0.45, 0.45, 1);
        strobe.position.set(side * 2.18, 0.05, 0.68);
        root.add(strobe);
        animParts.strobes.push(strobe);
      });

      // Twin Segmented Vector-Thrust Nozzles
      root.add(buildAfterburnerNozzle(-0.30, -0.03, 1.44, secMat, liveryObj.burner, animParts));
      root.add(buildAfterburnerNozzle(0.30, -0.03, 1.44, secMat, liveryObj.burner, animParts));
    }

    return {
      root,
      animParts,
      setLivery(livery) {
        hullMat.color.setHex(livery.primary);
        secMat.color.setHex(livery.secondary);
        accentMat.color.setHex(livery.accent);
        accentMat.emissive.setHex(livery.accent);
      }
    };
  }

  // =========================================================================
  // REALISTIC 3D OBSTACLES, RINGS & SUPPLY PODS
  // =========================================================================
  function createDisplacedRockGeo(radius = 1.45, detail = 2, seed = 1.0) {
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n1 = Math.sin(v.x * 2.1 + seed) * Math.cos(v.y * 2.4 - seed) * Math.sin(v.z * 1.9 + seed * 0.5);
      const n2 = Math.cos(v.x * 4.7 - v.z * 3.8 + seed * 2.3) * 0.35;
      const scale = 0.84 + n1 * 0.24 + n2 * 0.14;
      v.multiplyScalar(scale);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  const OBSTACLE_TYPES = [
    "MINE",
    "BARRIER",
    "CROSS_BLADE",
    "BOULDER",
    "DRONE",
    "MONOLITH",
    "SHUTTER",
    "CRYSTAL_CLUSTER",
    "RING_TRAP",
    "TORII_GATE",
    "SAND_PILLAR",
    "ICE_SPIRE",
    "DEPTH_TORPEDO",
    "STEAM_GEAR",
    "MAGMA_METEOR"
  ];

  function createObstacle(type = "MINE", chapterObj = CHAPTERS[0]) {
    const grp = new THREE.Group();
    const hazardTex = getHazardTexture();
    const rockBump = getRockBumpTexture();
    const carbonTex = getCarbonTexture();
    const panel = getPanelTextures();

    const primaryHex = chapterObj.obsPrimaryHex || 0x334155;
    const glowHex = chapterObj.obsGlowHex || 0xef4444;
    const glowCss = "#" + new THREE.Color(glowHex).getHexString();

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      map: carbonTex,
      metalness: 0.78,
      roughness: 0.28
    });
    const hazardMat = new THREE.MeshStandardMaterial({
      map: hazardTex,
      metalness: 0.65,
      roughness: 0.34
    });
    const armorMat = new THREE.MeshStandardMaterial({
      color: primaryHex,
      map: panel.map,
      bumpMap: panel.bump,
      bumpScale: 0.03,
      metalness: 0.68,
      roughness: 0.34
    });
    const redPlasmaMat = new THREE.MeshBasicMaterial({
      color: glowHex,
      transparent: true,
      opacity: 0.92
    });

    const makeRedFlare = (scale = 1.7, customCss = glowCss) => {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: getGlowTexture(customCss),
          transparent: true,
          opacity: 0.88,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      sp.scale.set(scale, scale, 1);
      return sp;
    };

    if (type === "TORII_GATE") {
      // Vermilion Shrine Crossbeam & Lantern Gate Hazard (Sakura Shrine)
      const vermilionMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.42, metalness: 0.18 });
      const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.55, metalness: 0.2 });
      const beamLen = 7.0;
      const kasagi = new THREE.Mesh(new THREE.BoxGeometry(beamLen, 0.58, 0.72), vermilionMat);
      const capTop = new THREE.Mesh(new THREE.BoxGeometry(beamLen + 0.5, 0.24, 0.86), blackWoodMat);
      capTop.position.y = 0.38;
      const nuki = new THREE.Mesh(new THREE.BoxGeometry(beamLen - 0.9, 0.38, 0.52), vermilionMat);
      nuki.position.y = -0.58;
      grp.add(kasagi, capTop, nuki);

      [-2.35, 2.35].forEach((px) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.9, 12), vermilionMat);
        post.position.set(px, -0.35, 0);
        grp.add(post);
        const lantern = makeRedFlare(1.6, "#fb7185");
        lantern.position.set(px, -0.95, 0.35);
        grp.add(lantern);
      });
      return { mesh: grp, hitShape: "BAR", halfLen: beamLen * 0.5, thickness: 1.08 };
    }

    if (type === "SAND_PILLAR") {
      // Carved Golden Sandstone Obelisk (Desert & Ancient Ruins)
      const stoneMat = new THREE.MeshStandardMaterial({
        color: chapterObj.cliffHex || 0xb45309,
        bumpMap: rockBump,
        bumpScale: 0.14,
        roughness: 0.78,
        metalness: 0.12
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        metalness: 0.75,
        roughness: 0.22
      });
      const colH = 8.2;
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.35, colH, 4), stoneMat);
      shaft.rotation.y = Math.PI / 4;
      shaft.castShadow = true;
      grp.add(shaft);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.02, 1.5, 4), goldMat);
      cap.rotation.y = Math.PI / 4;
      cap.position.y = colH * 0.5 + 0.72;
      grp.add(cap);

      [-2.1, 0, 2.1].forEach((by) => {
        const ring = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.34, 1.92), goldMat);
        ring.position.y = by;
        grp.add(ring);
      });
      return { mesh: grp, hitShape: "BOX", halfW: 1.24, halfH: colH * 0.5 + 0.5 };
    }

    if (type === "ICE_SPIRE") {
      // Translucent Glacial Ice Crystal Formation (Crystal Glacier)
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        emissive: 0x0284c7,
        emissiveIntensity: 0.38,
        metalness: 0.25,
        roughness: 0.12,
        transparent: true,
        opacity: 0.9
      });
      const core = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 0), iceMat);
      grp.add(core);
      const dirs = [
        [0, 1, 0], [0, -1, 0], [1, 0.25, 0], [-1, -0.25, 0],
        [0.6, 0.65, 0.45], [-0.6, 0.65, -0.45], [0.6, -0.65, -0.45], [-0.6, -0.65, 0.45]
      ];
      dirs.forEach(([dx, dy, dz], idx) => {
        const dir = new THREE.Vector3(dx, dy, dz).normalize();
        const len = 1.65 + (idx % 2) * 0.45;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.38, len, 5), iceMat);
        shard.position.copy(dir).multiplyScalar(len * 0.46);
        shard.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        grp.add(shard);
      });
      grp.add(makeRedFlare(2.3, "#38bdf8"));
      return { mesh: grp, hitShape: "SPHERE", radius: 1.66 };
    }

    if (type === "DEPTH_TORPEDO") {
      // Subsea Naval Pressure Pod & Torpedo Rotor (Abyss Hydro-Tube)
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.82, roughness: 0.26 });
      const hull = new THREE.Mesh(new THREE.SphereGeometry(1.12, 18, 16), armorMat);
      hull.scale.set(1.22, 0.95, 1.22);
      grp.add(hull);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(1.26, 0.16, 10, 24), brassMat);
      grp.add(collar);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const port = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.52, 10), brassMat);
        port.position.set(Math.cos(a) * 1.18, Math.sin(a) * 1.18, 0);
        port.rotation.z = a - Math.PI / 2;
        grp.add(port);
      }
      grp.add(makeRedFlare(2.2, "#2dd4bf"));
      return { mesh: grp, hitShape: "SPHERE", radius: 1.54 };
    }

    if (type === "STEAM_GEAR") {
      // Giant Spinning Forged Iron-Bronze Cogwheel Ring (Clockwork Forge)
      const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, metalness: 0.82, roughness: 0.28 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.36, 12, 28), bronzeMat);
      grp.add(rim);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.68), darkSteelMat);
        tooth.position.set(Math.cos(a) * 2.88, Math.sin(a) * 2.88, 0);
        tooth.rotation.z = a;
        grp.add(tooth);
      }
      const glowRing = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.1, 8, 24), redPlasmaMat);
      grp.add(glowRing);
      return { mesh: grp, hitShape: "RING_TRAP", innerSafeR: 1.52, outerHitR: 3.32 };
    }

    if (type === "MAGMA_METEOR") {
      // Cracked Basalt Volcanic Meteor with Incandescent Lava Core (Volcano & Space)
      const basaltMat = new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        bumpMap: rockBump,
        bumpScale: 0.22,
        roughness: 0.88,
        metalness: 0.15
      });
      const lavaMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 1.15,
        roughness: 0.3
      });
      const crust = new THREE.Mesh(createDisplacedRockGeo(1.48, 2, Math.random() * 9), basaltMat);
      grp.add(crust);
      const magmaCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 1), lavaMat);
      magmaCore.scale.set(1.18, 0.88, 1.12);
      grp.add(magmaCore);
      grp.add(makeRedFlare(2.6, "#f97316"));
      return { mesh: grp, hitShape: "SPHERE", radius: 1.66 };
    }

    if (type === "BARRIER") {
      // 1. Industrial Truss Laser / Armor Gate Bar
      const beamLen = 7.1;
      const truss = new THREE.Mesh(new THREE.BoxGeometry(beamLen, 0.64, 0.64), hazardMat);
      truss.castShadow = true;
      grp.add(truss);

      [-0.54, 0.54].forEach((ly) => {
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, beamLen, 10), redPlasmaMat);
        beam.rotation.z = Math.PI / 2;
        beam.position.y = ly;
        grp.add(beam);
      });

      [-beamLen / 2, beamLen / 2].forEach((px) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 1.48, 14), darkSteelMat);
        pod.position.x = px;
        grp.add(pod);
        const flare = makeRedFlare(1.65);
        flare.position.set(px, 0, 0.35);
        grp.add(flare);
      });
      return { mesh: grp, hitShape: "BAR", halfLen: beamLen * 0.5, thickness: 1.02 };
    }

    if (type === "CROSS_BLADE") {
      // 2. Giant 4-Bladed Rotating Industrial Turbine / Cross Rotor
      const span = 8.2;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.9, 16), darkSteelMat);
      hub.rotation.x = Math.PI / 2;
      grp.add(hub);

      const hubCore = makeRedFlare(2.1);
      hubCore.position.z = 0.5;
      grp.add(hubCore);

      [0, Math.PI / 2].forEach((rot) => {
        const armGroup = new THREE.Group();
        armGroup.rotation.z = rot;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(span, 0.58, 0.32), armorMat);
        blade.castShadow = true;
        armGroup.add(blade);

        const edge = new THREE.Mesh(new THREE.BoxGeometry(span * 0.92, 0.14, 0.38), redPlasmaMat);
        armGroup.add(edge);

        [-span / 2, span / 2].forEach((tx) => {
          const tip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.78, 0.5), hazardMat);
          tip.position.x = tx;
          armGroup.add(tip);
        });
        grp.add(armGroup);
      });

      return { mesh: grp, hitShape: "CROSS", halfLen: span * 0.5, thickness: 0.92 };
    }

    if (type === "MONOLITH") {
      // 3. Tall Vertical Armored Skyscraper / Canyon Steel Pillar
      const colH = 8.4;
      const col = new THREE.Mesh(new THREE.BoxGeometry(1.75, colH, 1.65), armorMat);
      col.castShadow = true;
      grp.add(col);

      [-2.2, 0, 2.2].forEach((by) => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.42, 1.74), hazardMat);
        band.position.y = by;
        grp.add(band);
      });

      [-colH * 0.44, colH * 0.44].forEach((fy) => {
        const fl = makeRedFlare(1.6);
        fl.position.set(0, fy, 0.95);
        grp.add(fl);
      });

      return { mesh: grp, hitShape: "BOX", halfW: 1.25, halfH: colH * 0.5 };
    }

    if (type === "SHUTTER") {
      // 4. Heavy Armored Sliding Blast-Door Bulkhead
      const w = 4.8, h = 2.5;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.85), armorMat);
      plate.castShadow = true;
      grp.add(plate);

      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.36, 0.96), hazardMat);
      frameTop.position.y = h * 0.5 - 0.18;
      const frameBot = frameTop.clone();
      frameBot.position.y = -h * 0.5 + 0.18;
      grp.add(frameTop, frameBot);

      [-w * 0.42, w * 0.42].forEach((lx) => {
        const fl = makeRedFlare(1.45);
        fl.position.set(lx, 0, 0.55);
        grp.add(fl);
      });

      return { mesh: grp, hitShape: "BOX", halfW: w * 0.5 + 0.35, halfH: h * 0.5 + 0.35 };
    }

    if (type === "CRYSTAL_CLUSTER") {
      // 5. Razor-Sharp Metallic / Mineral Spike Cluster
      const crystalMat = new THREE.MeshStandardMaterial({
        color: glowHex,
        emissive: primaryHex,
        emissiveIntensity: 0.55,
        metalness: 0.55,
        roughness: 0.18
      });
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), darkSteelMat);
      grp.add(core);

      const dirs = [
        [1, 0.2, 0], [-1, -0.2, 0], [0.2, 1, 0], [-0.2, -1, 0],
        [0.65, 0.65, 0.3], [-0.65, 0.65, -0.3], [0.65, -0.65, -0.3], [-0.65, -0.65, 0.3],
        [0, 0.3, 1], [0, -0.3, -1]
      ];
      dirs.forEach(([dx, dy, dz], idx) => {
        const dir = new THREE.Vector3(dx, dy, dz).normalize();
        const len = 1.45 + (idx % 3) * 0.32;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.28, len, 6), crystalMat);
        spike.position.copy(dir).multiplyScalar(len * 0.48);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        grp.add(spike);
      });

      grp.add(makeRedFlare(2.4));
      return { mesh: grp, hitShape: "SPHERE", radius: 1.68 };
    }

    if (type === "RING_TRAP") {
      // 6. High-Voltage Electromagnetic Danger Coil Ring (Fly dead-center OR outside!)
      const outerCoil = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.38, 12, 32), darkSteelMat);
      grp.add(outerCoil);

      const plasmaCoil = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.42, 10, 24), redPlasmaMat);
      plasmaCoil.scale.set(1, 1, 0.45);
      grp.add(plasmaCoil);

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const lug = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.8), hazardMat);
        lug.position.set(Math.cos(a) * 2.65, Math.sin(a) * 2.65, 0);
        lug.rotation.z = a;
        grp.add(lug);
      }

      return { mesh: grp, hitShape: "RING_TRAP", innerSafeR: 1.55, outerHitR: 3.35 };
    }

    if (type === "BOULDER") {
      // 7. Craggy Asteroid / Canyon Boulder with Varied Geological Proportions
      const rockGeo = createDisplacedRockGeo(1.62, 2, Math.random() * 12);
      const rockMat = new THREE.MeshStandardMaterial({
        color: chapterObj.cliffHex || 0x64748b,
        bumpMap: rockBump,
        bumpScale: 0.16,
        roughness: 0.82,
        metalness: 0.12
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.scale.set(0.9 + Math.random() * 0.45, 0.9 + Math.random() * 0.45, 0.95);
      rock.castShadow = true;
      rock.receiveShadow = true;
      grp.add(rock);
      return { mesh: grp, hitShape: "SPHERE", radius: 1.62 };
    }

    if (type === "DRONE") {
      // 8. Autonomous Patrol Interceptor Drone
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.82, 18, 14), darkSteelMat);
      core.scale.set(1.38, 0.74, 1.12);
      grp.add(core);

      const wings = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.12, 0.72), armorMat);
      grp.add(wings);

      [-1.6, 1.6].forEach((wx) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.92, 10), hazardMat);
        pod.rotation.x = Math.PI / 2;
        pod.position.set(wx, 0, 0);
        grp.add(pod);
      });

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.22), redPlasmaMat);
      visor.position.set(0, 0.05, 0.8);
      grp.add(visor);

      const eyeGlow = makeRedFlare(1.85);
      eyeGlow.position.set(0, 0.05, 0.92);
      grp.add(eyeGlow);

      return { mesh: grp, hitShape: "SPHERE", radius: 1.52 };
    }

    // 9. Default: Armored Aerial Proximity Mine
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.06, 20, 16), darkSteelMat);
    sphere.castShadow = true;
    grp.add(sphere);

    const eqBand = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.28, 20), hazardMat);
    grp.add(eqBand);

    const hornGeo = new THREE.ConeGeometry(0.14, 0.6, 8);
    const hornDirs = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      [0.7, 0.7, 0], [-0.7, 0.7, 0], [0.7, -0.7, 0], [-0.7, -0.7, 0],
      [0, 0.7, 0.7], [0, -0.7, 0.7], [0, 0.7, -0.7], [0, -0.7, -0.7]
    ];
    hornDirs.forEach(([dx, dy, dz]) => {
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      const horn = new THREE.Mesh(hornGeo, darkSteelMat);
      horn.position.copy(dir).multiplyScalar(1.16);
      horn.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      grp.add(horn);
    });

    grp.add(makeRedFlare(2.35));
    return { mesh: grp, hitShape: "SPHERE", radius: 1.44 };
  }

  function createEnergyRing(accentHex = 0xfbbf24) {
    const grp = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.2
    });
    const outerTorus = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.13, 12, 40), frameMat);
    grp.add(outerTorus);

    const innerGlowMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 1.0,
      metalness: 0.35,
      roughness: 0.12
    });
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.08, 10, 36), innerGlowMat);
    grp.add(innerRing);

    // 4 Capacitor Clamp Housings
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.36), frameMat);
      clamp.position.set(Math.cos(a) * 2.02, Math.sin(a) * 2.02, 0);
      clamp.rotation.z = a;
      grp.add(clamp);
    }

    // Translucent energy field shimmer
    const field = new THREE.Mesh(
      new THREE.CircleGeometry(1.78, 32),
      new THREE.MeshBasicMaterial({
        color: accentHex,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    grp.add(field);

    const hexStr = "#" + new THREE.Color(accentHex).getHexString();
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: getGlowTexture(hexStr),
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    halo.scale.set(5.4, 5.4, 1);
    grp.add(halo);

    return { mesh: grp, innerRing };
  }

  function createSupplyPod() {
    const grp = new THREE.Group();
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.15
    });

    const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1.15, 6), coreMat);
    grp.add(canister);

    [-0.6, 0.6].forEach((cy) => {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.2, 6), capMat);
      cap.position.y = cy;
      grp.add(cap);
    });

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.06, 8, 28), capMat);
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(0.96, 0.05, 8, 28),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.55 })
    );
    ringB.rotation.x = Math.PI / 2;
    grp.add(ringA, ringB);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: getGlowTexture("#38bdf8"),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    halo.scale.set(2.4, 2.4, 1);
    grp.add(halo);

    return { mesh: grp, ringA, ringB };
  }

  // =========================================================================
  // REALISTIC 3D SKY DOME, OUTDOOR CANYON/OCEAN & 12 CORRIDOR STRUCTURES
  // =========================================================================
  function createAtmosphericSkyDome() {
    const uniforms = {
      uTopColor:     { value: new THREE.Color(0x172554) },
      uHorizonColor: { value: new THREE.Color(0xf97316) },
      uSunColor:     { value: new THREE.Color(0xfde68a) },
      uSunDir:       { value: new THREE.Vector3(0.35, 0.22, -1.0).normalize() },
      uNightMix:     { value: 0.0 }
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vWorldDir;
        void main() {
          vWorldDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        uniform float uNightMix;
        varying vec3 vWorldDir;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec3 dir = normalize(vWorldDir);
          float h = clamp(dir.y * 1.15 + 0.08, 0.0, 1.0);
          vec3 sky = mix(uHorizonColor, uTopColor, pow(h, 0.58));

          // Solar / Lunar disc & Mie atmospheric scattering glow
          float sunAmt = max(dot(dir, normalize(uSunDir)), 0.0);
          sky += uSunColor * pow(sunAmt, 14.0) * 0.42;
          sky += uSunColor * smoothstep(0.996, 0.9992, sunAmt) * 1.35;

          // Subtle upper-sky starfield for night / orbital chapters
          if (uNightMix > 0.05 && dir.y > 0.05) {
            vec2 grid = floor(dir.xz / (dir.y + 0.35) * 140.0);
            float st = hash(grid);
            if (st > 0.992) {
              sky += vec3(0.85, 0.92, 1.0) * (st - 0.992) * 110.0 * uNightMix * dir.y;
            }
          }

          gl_FragColor = vec4(sky, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(260, 32, 20), mat);
    return { mesh, uniforms };
  }

  function getCityWindowTexture() {
    if (texCache.cityWin) return texCache.cityWin;
    const c = document.createElement("canvas");
    c.width = 128; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#090f1d";
    ctx.fillRect(0, 0, 128, 256);
    for (let y = 8; y < 248; y += 10) {
      for (let x = 8; x < 120; x += 14) {
        const r = Math.random();
        if (r > 0.36) {
          ctx.fillStyle = r > 0.86 ? "#fde68a" : (r > 0.62 ? "#38bdf8" : "#cbd5e1");
          ctx.fillRect(x, y, 8, 5);
        }
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 2);
    texCache.cityWin = tex;
    return tex;
  }

  function createOutdoorWorld() {
    const group = new THREE.Group();
    const waterBump = getWaterBumpTexture();
    const rockBump = getRockBumpTexture();

    // Dynamic Surface Plane (Ocean / Sand Sea / Cloud Sea / Molten Lava / Hidden in Space)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      bumpMap: waterBump,
      bumpScale: 0.16,
      metalness: 0.78,
      roughness: 0.18
    });
    const water = new THREE.Mesh(new THREE.PlaneGeometry(340, 360), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -8.2, -130);
    water.receiveShadow = true;
    group.add(water);

    const cliffMat = new THREE.MeshStandardMaterial({
      color: 0x8c4a2f,
      bumpMap: rockBump,
      bumpScale: 0.25,
      roughness: 0.86,
      metalness: 0.08
    });
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.75,
      metalness: 0.1
    });
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.72,
      roughness: 0.32
    });

    const props = [];
    let spinners = [];
    const totalChunks = 14;
    const spacing = 22;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = new THREE.Group();
      chunk.position.z = 18 - i * spacing;
      group.add(chunk);
      props.push(chunk);
    }

    // Soft Volumetric 3D Cloud Clusters
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.0,
      transparent: true,
      opacity: 0.78
    });
    const clouds = [];
    for (let c = 0; c < 18; c++) {
      const cl = new THREE.Group();
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(2.2 + p * 0.6, 12, 10), cloudMat);
        puff.scale.set(1.9, 0.52, 1.25);
        puff.position.set((p - 1) * 2.3, (p % 2) * 0.45, 0);
        cl.add(puff);
      }
      const side = c % 2 === 0 ? -1 : 1;
      cl.position.set(side * (11 + Math.random() * 20), 6.5 + Math.random() * 8, -c * 16);
      group.add(cl);
      clouds.push(cl);
    }

    function rebuildBiome(ch = CHAPTERS[0]) {
      const biome = ch.biome || "CANYON";
      spinners = [];

      // Configure ground/ocean surface per biome worldview
      water.visible = biome !== "SPACE";
      waterMat.emissive.setHex(0x000000);
      waterMat.emissiveIntensity = 0;
      if (biome === "DESERT") {
        waterMat.color.setHex(0xd97706);
        waterMat.metalness = 0.05;
        waterMat.roughness = 0.88;
      } else if (biome === "SKY_ISLAND") {
        waterMat.color.setHex(0xf1f5f9);
        waterMat.metalness = 0.02;
        waterMat.roughness = 0.95;
      } else if (biome === "GLACIER") {
        waterMat.color.setHex(0x38bdf8);
        waterMat.metalness = 0.85;
        waterMat.roughness = 0.08;
      } else if (biome === "VOLCANO") {
        waterMat.color.setHex(0xdc2626);
        waterMat.emissive.setHex(0xb91c1c);
        waterMat.emissiveIntensity = 0.72;
        waterMat.metalness = 0.22;
        waterMat.roughness = 0.45;
      } else {
        waterMat.color.setHex(ch.waterHex);
        waterMat.metalness = 0.78;
        waterMat.roughness = 0.18;
      }

      cliffMat.color.setHex(ch.cliffHex);
      capMat.color.setHex(ch.capHex);

      // Clouds visibility & tint per worldview
      const hideClouds = biome === "SPACE" || biome === "ABYSS";
      clouds.forEach((cl) => { cl.visible = !hideClouds; });
      if (biome === "SAKURA") cloudMat.color.setHex(0xffe4e6);
      else if (biome === "VOLCANO" || biome === "FORGE") cloudMat.color.setHex(0x57534e);
      else if (biome === "METROPOLIS") cloudMat.color.setHex(0x1e293b);
      else if (biome === "DESERT") cloudMat.color.setHex(0xfef3c7);
      else cloudMat.color.setHex(0xffffff);

      const vermilionMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });
      const blossomMat = new THREE.MeshStandardMaterial({ color: 0xf9a8d4, roughness: 0.75 });
      const pineMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.82 });
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe, emissive: 0x0284c7, emissiveIntensity: 0.25,
        roughness: 0.14, metalness: 0.25, transparent: true, opacity: 0.92
      });
      const sandstoneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, bumpMap: rockBump, bumpScale: 0.12, roughness: 0.82 });
      const cityMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, map: getCityWindowTexture(),
        emissive: 0x38bdf8, emissiveMap: getCityWindowTexture(), emissiveIntensity: 0.85,
        metalness: 0.5, roughness: 0.3
      });
      const lavaGlowMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      const tealGlowMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
      const solarMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.85, roughness: 0.18 });

      props.forEach((chunk, i) => {
        while (chunk.children.length > 0) chunk.remove(chunk.children[0]);

        [-1, 1].forEach((side) => {
          const xBase = side * (25.5 + (i % 3) * 4.0);
          const hScale = 1.1 + ((i * 7 + (side > 0 ? 3 : 1)) % 5) * 0.3;

          if (biome === "DESERT") {
            // Giant Stepped Pyramids & Sandstone Obelisks
            const pyr = new THREE.Mesh(new THREE.ConeGeometry(8.5 * hScale * 0.75, 11.5 * hScale, 4), sandstoneMat);
            pyr.rotation.y = Math.PI / 4;
            pyr.position.set(xBase * 1.05, -8.2 + 5.7 * hScale, 0);
            chunk.add(pyr);
            if (i % 2 === 0) {
              const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.0, 9.5, 4), sandstoneMat);
              ob.position.set(side * 16.5, -3.5, 4);
              chunk.add(ob);
            }
          } else if (biome === "METROPOLIS") {
            // Illuminated Night Bay Skyscrapers
            const bH = 14 + ((i * 5 + (side > 0 ? 2 : 0)) % 5) * 5.5;
            const bW = 5.2 + (i % 2) * 1.8;
            const tower = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bW), cityMat);
            tower.position.set(side * (19.5 + (i % 3) * 3.5), -8.2 + bH * 0.5, 0);
            chunk.add(tower);
            const roofBeacon = new THREE.Mesh(new THREE.BoxGeometry(bW * 0.7, 0.35, bW * 0.7), tealGlowMat);
            roofBeacon.position.set(tower.position.x, -8.2 + bH + 0.2, 0);
            chunk.add(roofBeacon);
          } else if (biome === "SAKURA") {
            // Lakeside Hills with Sakura Cherry Trees & Waterside Torii Gates
            const hill = new THREE.Mesh(createDisplacedRockGeo(5.8, 1, i + side), cliffMat);
            hill.scale.set(1.2, 0.85, 1.2);
            hill.position.set(xBase, -5.2, 0);
            chunk.add(hill);

            const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(3.2, 1), blossomMat);
            canopy.scale.set(1.25, 0.8, 1.25);
            canopy.position.set(xBase * 0.82, -0.5, 2);
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 3.6, 7), trunkMat);
            trunk.position.set(xBase * 0.82, -2.8, 2);
            chunk.add(trunk, canopy);

            if (i % 2 === 0) {
              const torii = new THREE.Group();
              [-2.2, 2.2].forEach((px) => {
                const p = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 6.5, 10), vermilionMat);
                p.position.x = px;
                torii.add(p);
              });
              const topB = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.5, 0.6), vermilionMat);
              topB.position.y = 3.1;
              torii.add(topB);
              torii.position.set(side * 15.5, -5.0, -3);
              torii.rotation.y = side * 0.35;
              chunk.add(torii);
            }
          } else if (biome === "GLACIER") {
            // Towering Jagged Translucent Icebergs
            const spire = new THREE.Mesh(new THREE.ConeGeometry(5.2, 14.5 * hScale, 5), iceMat);
            spire.position.set(xBase * 0.92, -8.2 + 6.8 * hScale, 0);
            spire.rotation.z = -side * 0.12;
            chunk.add(spire);
          } else if (biome === "SKY_ISLAND") {
            // Floating Sky Islands + Rotating 3-Blade Wind Turbines
            const island = new THREE.Mesh(createDisplacedRockGeo(5.2, 1, i * 2 + side), cliffMat);
            const yFloat = 0.5 + ((i + (side > 0 ? 1 : 0)) % 3) * 2.4;
            island.scale.set(1.25, 0.72, 1.25);
            island.position.set(side * 20.5, yFloat, 0);
            const grass = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 4.2, 0.9, 8), capMat);
            grass.position.set(side * 20.5, yFloat + 2.6, 0);
            chunk.add(island, grass);

            if (i % 2 === 0) {
              const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 7.5, 8), bridgeMat);
              mast.position.set(side * 20.5, yFloat + 6.5, 0);
              const rotor = new THREE.Group();
              rotor.position.set(side * 20.5, yFloat + 10.1, 0.4);
              for (let b = 0; b < 3; b++) {
                const arm = new THREE.Group();
                arm.rotation.z = (b / 3) * Math.PI * 2;
                const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.4, 0.12), cloudMat);
                blade.position.y = 2.2;
                arm.add(blade);
                rotor.add(arm);
              }
              spinners.push(rotor);
              chunk.add(mast, rotor);
            }
          } else if (biome === "RUINS") {
            // Sunken Ancient Megalith Temple Colonnades
            const col = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.55, 15.0, 10), cliffMat);
            col.position.set(side * 18.5, -1.0, 0);
            const capBlock = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.2, 3.8), capMat);
            capBlock.position.set(side * 18.5, 6.8, 0);
            chunk.add(col, capBlock);
          } else if (biome === "ABYSS") {
            // Deep-Sea Trench Sonar Beacons & Bioluminescent Rings
            const spire = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 2.6, 16, 8), cliffMat);
            spire.position.set(side * 20.0, -1.0, 0);
            const sonar = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.18, 8, 20), tealGlowMat);
            sonar.rotation.x = Math.PI / 2;
            sonar.position.set(side * 20.0, 5.2, 0);
            chunk.add(spire, sonar);
          } else if (biome === "FORGE") {
            // Steampunk Blast Furnaces & Giant Rotating Cogwheels
            const furnace = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.2, 16, 12), cliffMat);
            furnace.position.set(side * 22.0, -0.5, 0);
            const vent = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.35, 8, 18), lavaGlowMat);
            vent.rotation.x = Math.PI / 2;
            vent.position.set(side * 22.0, 6.5, 0);
            chunk.add(furnace, vent);

            if (i % 2 === 1) {
              const gear = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.55, 8, 12), capMat);
              gear.position.set(side * 18.5, 2.5, 4);
              gear.rotation.y = Math.PI / 3;
              spinners.push(gear);
              chunk.add(gear);
            }
          } else if (biome === "VOLCANO") {
            // Jagged Obsidian Volcanic Cones with Glowing Magma Craters
            const cone = new THREE.Mesh(new THREE.ConeGeometry(7.2, 14.0 * hScale, 7), cliffMat);
            cone.position.set(xBase * 0.95, -8.2 + 6.5 * hScale, 0);
            const crater = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 1.2, 0.8, 8), lavaGlowMat);
            crater.position.set(xBase * 0.95, -8.2 + 12.8 * hScale, 0);
            chunk.add(cone, crater);
          } else if (biome === "SPACE") {
            // Deep-Space Orbital Satellites, Solar Arrays & Asteroids
            if (i % 2 === 0) {
              const sat = new THREE.Group();
              const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 4.2, 12), bridgeMat);
              const panelL = new THREE.Mesh(new THREE.BoxGeometry(7.5, 2.2, 0.12), solarMat);
              panelL.position.x = -4.8;
              const panelR = panelL.clone();
              panelR.position.x = 4.8;
              sat.add(hub, panelL, panelR);
              sat.position.set(side * 21.0, (i % 4 - 1.5) * 2.8, 0);
              sat.rotation.z = side * 0.35;
              spinners.push(sat);
              chunk.add(sat);
            } else {
              const ast = new THREE.Mesh(createDisplacedRockGeo(3.6, 1, i * 3 + side), cliffMat);
              ast.position.set(side * 22.0, -3 + (i % 3) * 3.5, 0);
              chunk.add(ast);
            }
          } else {
            // CANYON & FJORD: Sculpted Cliffs (+ Pine Forests for FJORD)
            const massif = new THREE.Mesh(createDisplacedRockGeo(6.4, 2, i * 1.7 + side), cliffMat);
            massif.scale.set(1.15, hScale * 1.55, 1.35);
            massif.position.set(xBase, -4.5 + hScale * 2.4, 0);
            chunk.add(massif);

            const cap = new THREE.Mesh(createDisplacedRockGeo(4.3, 1, i * 2.3), capMat);
            cap.scale.set(1.1, 0.36, 1.15);
            cap.position.set(xBase, -4.5 + hScale * 6.8, 0);
            chunk.add(cap);

            if (biome === "FJORD") {
              for (let t = 0; t < 2; t++) {
                const tree = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5.2, 7), pineMat);
                tree.position.set(side * (17.5 + t * 3.2), -5.0 + t * 1.2, (t - 0.5) * 6);
                chunk.add(tree);
              }
            }
          }
        });

        // Spanning Overhead World Landmarks every 4th chunk
        if (i % 4 === 2 && (biome === "CANYON" || biome === "METROPOLIS" || biome === "RUINS" || biome === "SPACE")) {
          if (biome === "SPACE") {
            const stargate = new THREE.Mesh(new THREE.TorusGeometry(19.5, 0.45, 10, 36), bridgeMat);
            stargate.position.y = 1.0;
            spinners.push(stargate);
            chunk.add(stargate);
          } else {
            const arch = new THREE.Group();
            const deck = new THREE.Mesh(new THREE.BoxGeometry(62, 0.55, 2.2), biome === "RUINS" ? cliffMat : bridgeMat);
            deck.position.y = 11.2;
            arch.add(deck);
            const archRing = new THREE.Mesh(new THREE.TorusGeometry(26, 0.42, 8, 24, Math.PI), bridgeMat);
            archRing.position.y = -5.5;
            arch.add(archRing);
            chunk.add(arch);
          }
        }
      });
    }

    rebuildBiome(CHAPTERS[0]);

    return {
      group,
      water,
      waterBump,
      cliffMat,
      capMat,
      props,
      clouds,
      getSpinners: () => spinners,
      rebuildBiome,
      totalSpan: totalChunks * spacing
    };
  }

  function createCorridorWorld() {
    const group = new THREE.Group();
    const deckTex = getDeckTexture();
    const panel = getPanelTextures();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x292220,
      map: deckTex,
      bumpMap: deckTex,
      bumpScale: 0.05,
      metalness: 0.52,
      roughness: 0.42
    });
    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x57534e,
      map: panel.map,
      bumpMap: panel.bump,
      bumpScale: 0.04,
      metalness: 0.68,
      roughness: 0.34
    });
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.65,
      metalness: 0.4,
      roughness: 0.25
    });
    const lightStripMat = new THREE.MeshBasicMaterial({ color: 0xfdba74 });

    // Textured Megastructure Highway Deck
    const road = new THREE.Mesh(new THREE.PlaneGeometry(18.5, 240), floorMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, -5.2, -100);
    road.receiveShadow = true;
    group.add(road);

    // Guardrails & Glowing Edge Guide Strips
    [-7.8, 7.8].forEach((rx) => {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 240), ribMat);
      barrier.position.set(rx, -4.8, -100);
      group.add(barrier);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 240), railMat);
      led.position.set(rx * 0.95, -4.45, -100);
      group.add(led);
    });

    let arches = [];
    let spinners = [];
    const archCount = 16;
    const archSpacing = 12.5;

    function buildSingleArch(shapeType) {
      const g = new THREE.Group();
      if (shapeType === "TORII") {
        // Authentic Vermilion Torii Colonnade
        [-7.2, 7.2].forEach((px) => {
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.64, 1.2, 12), floorMat);
          base.position.set(px, -4.6, 0);
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 11.8, 14), ribMat);
          pillar.position.set(px, 1.2, 0);
          g.add(base, pillar);
        });
        const kasagi = new THREE.Mesh(new THREE.BoxGeometry(17.8, 0.72, 0.88), ribMat);
        kasagi.position.set(0, 7.1, 0);
        const capTop = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.28, 1.05), floorMat);
        capTop.position.set(0, 7.55, 0);
        const nuki = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.48, 0.56), ribMat);
        nuki.position.set(0, 5.45, 0);
        const lanternL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.42), lightStripMat);
        lanternL.position.set(-6.4, 4.6, 0);
        const lanternR = lanternL.clone();
        lanternR.position.set(6.4, 4.6, 0);
        g.add(kasagi, capTop, nuki, lanternL, lanternR);
        return g;
      }

      if (shapeType === "GEAR" || shapeType === "TURBINE") {
        const outer = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.42, 10, 28), ribMat);
        g.add(outer);
        const rotor = new THREE.Group();
        const teeth = shapeType === "GEAR" ? 12 : 6;
        for (let t = 0; t < teeth; t++) {
          const a = (t / teeth) * Math.PI * 2;
          const toothGeo = shapeType === "GEAR"
            ? new THREE.BoxGeometry(1.1, 1.35, 0.55)
            : new THREE.BoxGeometry(0.55, 2.2, 0.18);
          const th = new THREE.Mesh(toothGeo, railMat);
          const rad = shapeType === "GEAR" ? 8.3 : 7.8;
          th.position.set(Math.cos(a) * rad, Math.sin(a) * rad, 0);
          th.rotation.z = a + (shapeType === "TURBINE" ? 0.4 : 0);
          rotor.add(th);
        }
        g.add(rotor);
        spinners.push(rotor);
        return g;
      }

      if (shapeType === "VOID") {
        const r1 = new THREE.Mesh(new THREE.TorusGeometry(9.0, 0.24, 10, 36), ribMat);
        const r2 = new THREE.Mesh(new THREE.TorusGeometry(8.1, 0.12, 8, 6), railMat);
        spinners.push(r2);
        g.add(r1, r2);
        return g;
      }

      let segs = 8, rotZ = Math.PI / 8;
      if (shapeType === "HEXAGON") { segs = 6; rotZ = Math.PI / 6; }
      else if (shapeType === "SQUARE") { segs = 4; rotZ = Math.PI / 4; }
      else if (shapeType === "DIAMOND") { segs = 4; rotZ = 0; }
      else if (shapeType === "TRIANGLE") { segs = 3; rotZ = Math.PI / 2; }
      else if (shapeType === "CIRCLE") { segs = 32; rotZ = 0; }

      const rib = new THREE.Mesh(new THREE.TorusGeometry(8.7, 0.36, 8, segs), ribMat);
      rib.rotation.z = rotZ;
      g.add(rib);

      // Overhead ceiling floodlight fixture
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.48), lightStripMat);
      lamp.position.set(0, 7.2, 0);
      g.add(lamp);
      return g;
    }

    function rebuildShape(shapeType) {
      arches.forEach((a) => group.remove(a));
      arches = [];
      spinners = [];
      for (let i = 0; i < archCount; i++) {
        const arch = buildSingleArch(shapeType);
        arch.position.set(0, 1.1, 14 - i * archSpacing);
        group.add(arch);
        arches.push(arch);
      }
    }

    rebuildShape("OCTAGON");

    return {
      group,
      deckTex,
      floorMat,
      ribMat,
      railMat,
      lightStripMat,
      getArches: () => arches,
      getSpinners: () => spinners,
      rebuildShape,
      totalSpan: archCount * archSpacing
    };
  }

  window.AeroModels = {
    CRAFT_CATALOG,
    LIVERY_CATALOG,
    CHAPTERS,
    OBSTACLE_TYPES,
    getGlowTexture,
    buildEnvironmentMap,
    createAircraft,
    createObstacle,
    createEnergyRing,
    createSupplyPod,
    createAtmosphericSkyDome,
    createOutdoorWorld,
    createCorridorWorld
  };
})();
