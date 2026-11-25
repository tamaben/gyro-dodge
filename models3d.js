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
      role: "超音速デルタ翼ジェット",
      speedStat: 92,
      agilityStat: 86,
      armorStat: 80
    },
    {
      id: "valkyrie",
      code: "GX-07",
      name: "VALKYRIE",
      jpName: "ヴァルキリー試験機",
      role: "前進翼ジャイロ・ジンバル機",
      speedStat: 86,
      agilityStat: 98,
      armorStat: 76
    },
    {
      id: "specter",
      code: "RX-12",
      name: "SPECTER",
      jpName: "スペクター重装機",
      role: "双胴ステルス制空戦闘機",
      speedStat: 96,
      agilityStat: 82,
      armorStat: 94
    }
  ];

  const LIVERY_CATALOG = [
    { id: "titanium", name: "チタニウム・シルバー", primary: 0xe2e8f0, secondary: 0x334155, accent: 0x0ea5e9, burner: 0x38bdf8 },
    { id: "navy",     name: "ミッドナイト・ネイビー", primary: 0x1e3a5f, secondary: 0x0f172a, accent: 0xf59e0b, burner: 0x38bdf8 },
    { id: "crimson",  name: "クリムゾン・エース", primary: 0xb91c1c, secondary: 0x1e293b, accent: 0xfbbf24, burner: 0xfb923c },
    { id: "desert",   name: "デザート・サンド", primary: 0xd6bfa2, secondary: 0x44403c, accent: 0xea580c, burner: 0x60a5fa },
    { id: "emerald",  name: "エメラルド・スコードロン", primary: 0x0f766e, secondary: 0x0f172a, accent: 0x34d399, burner: 0x2dd4bf }
  ];

  const CHAPTERS = [
    {
      chapter: 1, name: "サンセット・キャニオン", tag: "八角格納回廊", shape: "OCTAGON",
      skyTop: 0x172554, skyHorizon: 0xf97316, sunColor: 0xfde68a, sunPos: [0.35, 0.22, -1.0],
      fogHex: 0xd97746, waterHex: 0x1e3a5f, cliffHex: 0x8c4a2f, capHex: 0xb45309,
      corridorBg: 0x1a1412, floorHex: 0x292220, ribHex: 0x57534e, railHex: 0xf97316, lightHex: 0xfdba74, speedMult: 0.92
    },
    {
      chapter: 2, name: "エメラルド・フィヨルド", tag: "六角バイオドーム", shape: "HEXAGON",
      skyTop: 0x0c4a6e, skyHorizon: 0xbae6fd, sunColor: 0xffffff, sunPos: [-0.3, 0.48, -1.0],
      fogHex: 0x93c5fd, waterHex: 0x0369a1, cliffHex: 0x475569, capHex: 0x15803d,
      corridorBg: 0x0f1f1c, floorHex: 0x1a2e29, ribHex: 0x334155, railHex: 0x10b981, lightHex: 0x6ee7b7, speedMult: 0.96
    },
    {
      chapter: 3, name: "サクラ・シュライン", tag: "千本鳥居回廊", shape: "TORII",
      skyTop: 0x1e293b, skyHorizon: 0xfda4af, sunColor: 0xfff1f2, sunPos: [0.0, 0.28, -1.0],
      fogHex: 0xe2a8b4, waterHex: 0x1e3a5f, cliffHex: 0x57534e, capHex: 0xf472b6,
      corridorBg: 0x1c1217, floorHex: 0x2b2126, ribHex: 0xdc2626, railHex: 0xef4444, lightHex: 0xfecdd3, speedMult: 1.00
    },
    {
      chapter: 4, name: "ゴールデン・デューン", tag: "ピラミッド石室", shape: "TRIANGLE",
      skyTop: 0x1e3a8a, skyHorizon: 0xfde047, sunColor: 0xfef9c3, sunPos: [0.42, 0.36, -1.0],
      fogHex: 0xeab308, waterHex: 0x0c4a6e, cliffHex: 0xa16207, capHex: 0xca8a04,
      corridorBg: 0x211b0d, floorHex: 0x362c16, ribHex: 0x854d0e, railHex: 0xf59e0b, lightHex: 0xfef08a, speedMult: 1.04
    },
    {
      chapter: 5, name: "クリスタル・グレイシャー", tag: "氷晶クレバス", shape: "DIAMOND",
      skyTop: 0x082f49, skyHorizon: 0xe0f2fe, sunColor: 0xffffff, sunPos: [-0.25, 0.4, -1.0],
      fogHex: 0xbae6fd, waterHex: 0x075985, cliffHex: 0x64748b, capHex: 0xf8fafc,
      corridorBg: 0x081e2e, floorHex: 0x0f2d44, ribHex: 0x38bdf8, railHex: 0x0ea5e9, lightHex: 0xe0f2fe, speedMult: 1.08
    },
    {
      chapter: 6, name: "アルパイン・クラウドシー", tag: "成層圏リング", shape: "CIRCLE",
      skyTop: 0x0369a1, skyHorizon: 0xf0f9ff, sunColor: 0xfffbeb, sunPos: [0.15, 0.55, -1.0],
      fogHex: 0xcbd5e1, waterHex: 0x0284c7, cliffHex: 0x475569, capHex: 0xf1f5f9,
      corridorBg: 0x0f172a, floorHex: 0x1e293b, ribHex: 0x94a3b8, railHex: 0xf59e0b, lightHex: 0xbae6fd, speedMult: 1.12
    },
    {
      chapter: 7, name: "エンシェント・モノリス", tag: "古代列柱神殿", shape: "SQUARE",
      skyTop: 0x1c1917, skyHorizon: 0xd6d3d1, sunColor: 0xfef3c7, sunPos: [-0.35, 0.25, -1.0],
      fogHex: 0xa8a29e, waterHex: 0x1e293b, cliffHex: 0x44403c, capHex: 0x57534e,
      corridorBg: 0x171412, floorHex: 0x292524, ribHex: 0x78716c, railHex: 0xd97706, lightHex: 0xfde68a, speedMult: 1.15
    },
    {
      chapter: 8, name: "アビス・ハイドロチューブ", tag: "海底タービン管", shape: "TURBINE",
      skyTop: 0x042f2e, skyHorizon: 0x2dd4bf, sunColor: 0x99f6e4, sunPos: [0.0, 0.62, -1.0],
      fogHex: 0x0d9488, waterHex: 0x0f766e, cliffHex: 0x1e293b, capHex: 0x115e59,
      corridorBg: 0x041f24, floorHex: 0x08333a, ribHex: 0x0e7490, railHex: 0x14b8a6, lightHex: 0x5eead4, speedMult: 1.18
    },
    {
      chapter: 9, name: "クロックワーク・フォージ", tag: "巨大歯車機関", shape: "GEAR",
      skyTop: 0x271709, skyHorizon: 0xf59e0b, sunColor: 0xfef3c7, sunPos: [0.28, 0.3, -1.0],
      fogHex: 0xb45309, waterHex: 0x1c1917, cliffHex: 0x451a03, capHex: 0x78350f,
      corridorBg: 0x1a120b, floorHex: 0x291d12, ribHex: 0xb45309, railHex: 0xf59e0b, lightHex: 0xfde68a, speedMult: 1.22
    },
    {
      chapter: 10, name: "ナイト・メトロポリス", tag: "湾岸ハイウェイ", shape: "SQUARE",
      skyTop: 0x020617, skyHorizon: 0x0f172a, sunColor: 0x38bdf8, sunPos: [-0.2, 0.18, -1.0],
      fogHex: 0x0f172a, waterHex: 0x020617, cliffHex: 0x0f172a, capHex: 0x38bdf8, isNight: true,
      corridorBg: 0x030712, floorHex: 0x0f172a, ribHex: 0x1e293b, railHex: 0x06b6d4, lightHex: 0x38bdf8, speedMult: 1.26
    },
    {
      chapter: 11, name: "カルデラ・ボルケーノ", tag: "地熱溶岩シャフト", shape: "HEXAGON",
      skyTop: 0x180808, skyHorizon: 0xdc2626, sunColor: 0xfca5a5, sunPos: [0.1, 0.16, -1.0],
      fogHex: 0x7f1d1d, waterHex: 0x450a0a, cliffHex: 0x1c1917, capHex: 0xea580c, isNight: true,
      corridorBg: 0x170909, floorHex: 0x261010, ribHex: 0x44403c, railHex: 0xef4444, lightHex: 0xf97316, speedMult: 1.30
    },
    {
      chapter: 12, name: "オービタル・スターゲート", tag: "軌道エレベーター", shape: "VOID",
      skyTop: 0x01040d, skyHorizon: 0x0c1e3d, sunColor: 0xe0f2fe, sunPos: [0.4, 0.35, -1.0],
      fogHex: 0x071126, waterHex: 0x020617, cliffHex: 0x1e293b, capHex: 0x64748b, isNight: true,
      corridorBg: 0x020510, floorHex: 0x0b1326, ribHex: 0x334155, railHex: 0x38bdf8, lightHex: 0xfbbf24, speedMult: 1.36
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

  function createObstacle(type = "MINE", chapterObj = CHAPTERS[0]) {
    const grp = new THREE.Group();
    const hazardTex = getHazardTexture();
    const rockBump = getRockBumpTexture();
    const carbonTex = getCarbonTexture();

    if (type === "BARRIER") {
      // Industrial Truss Laser / Armor Gate Bar
      const beamLen = 6.8;
      const truss = new THREE.Mesh(
        new THREE.BoxGeometry(beamLen, 0.62, 0.62),
        new THREE.MeshStandardMaterial({
          map: hazardTex,
          metalness: 0.68,
          roughness: 0.35
        })
      );
      truss.castShadow = true;
      grp.add(truss);

      // Twin Plasma Laser Rails above & below truss
      const laserMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.88
      });
      [-0.52, 0.52].forEach((ly) => {
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, beamLen, 10), laserMat);
        beam.rotation.z = Math.PI / 2;
        beam.position.y = ly;
        grp.add(beam);
      });

      // Heavy Generator End-Pods
      const podMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, map: carbonTex, metalness: 0.75, roughness: 0.28 });
      [-beamLen / 2, beamLen / 2].forEach((px) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.45, 14), podMat);
        pod.position.x = px;
        grp.add(pod);

        const flare = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: getGlowTexture("#ef4444"),
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        flare.scale.set(1.6, 1.6, 1);
        flare.position.set(px, 0, 0.35);
        grp.add(flare);
      });
      return { mesh: grp, hitShape: "BAR", halfLen: beamLen * 0.5, thickness: 0.95 };
    }

    if (type === "BOULDER") {
      const rockGeo = createDisplacedRockGeo(1.52, 2, Math.random() * 10);
      const rockMat = new THREE.MeshStandardMaterial({
        color: chapterObj.cliffHex || 0x64748b,
        bumpMap: rockBump,
        bumpScale: 0.14,
        roughness: 0.82,
        metalness: 0.12
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.castShadow = true;
      rock.receiveShadow = true;
      grp.add(rock);
      return { mesh: grp, hitShape: "SPHERE", radius: 1.45 };
    }

    if (type === "DRONE") {
      // Autonomous Security Interceptor Drone
      const shellMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, map: carbonTex, metalness: 0.78, roughness: 0.24 });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.78, 18, 14), shellMat);
      core.scale.set(1.35, 0.72, 1.1);
      grp.add(core);

      const wings = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 0.68), shellMat);
      grp.add(wings);

      [-1.52, 1.52].forEach((wx) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.88, 10), shellMat);
        pod.rotation.x = Math.PI / 2;
        pod.position.set(wx, 0, 0);
        grp.add(pod);
      });

      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.16, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      visor.position.set(0, 0.05, 0.78);
      grp.add(visor);

      const eyeGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: getGlowTexture("#ef4444"),
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      eyeGlow.scale.set(1.8, 1.1, 1);
      eyeGlow.position.set(0, 0.05, 0.9);
      grp.add(eyeGlow);

      return { mesh: grp, hitShape: "SPHERE", radius: 1.42 };
    }

    // Default: Armored Aerial Proximity Mine
    const mineMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      map: carbonTex,
      metalness: 0.75,
      roughness: 0.32
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.02, 20, 16), mineMat);
    sphere.castShadow = true;
    grp.add(sphere);

    const eqBand = new THREE.Mesh(
      new THREE.CylinderGeometry(1.06, 1.06, 0.26, 20),
      new THREE.MeshStandardMaterial({ map: hazardTex, metalness: 0.6, roughness: 0.35 })
    );
    grp.add(eqBand);

    // 14 Metallic Contact Horns
    const hornGeo = new THREE.ConeGeometry(0.13, 0.56, 8);
    const hornDirs = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      [0.7, 0.7, 0], [-0.7, 0.7, 0], [0.7, -0.7, 0], [-0.7, -0.7, 0],
      [0, 0.7, 0.7], [0, -0.7, 0.7], [0, 0.7, -0.7], [0, -0.7, -0.7]
    ];
    hornDirs.forEach(([dx, dy, dz]) => {
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      const horn = new THREE.Mesh(hornGeo, mineMat);
      horn.position.copy(dir).multiplyScalar(1.12);
      horn.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      grp.add(horn);
    });

    const beacon = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: getGlowTexture("#ef4444"),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    beacon.scale.set(2.3, 2.3, 1);
    grp.add(beacon);

    return { mesh: grp, hitShape: "SPHERE", radius: 1.35, beacon };
  }

  function createEnergyRing(accentHex = 0xfbbf24) {
    const grp = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.82,
      roughness: 0.22
    });
    const outerTorus = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.11, 12, 36), frameMat);
    grp.add(outerTorus);

    const innerGlowMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 0.85,
      metalness: 0.4,
      roughness: 0.15
    });
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.56, 0.065, 10, 32), innerGlowMat);
    grp.add(innerRing);

    // 4 Capacitor Clamp Housings
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.32), frameMat);
      clamp.position.set(Math.cos(a) * 1.72, Math.sin(a) * 1.72, 0);
      clamp.rotation.z = a;
      grp.add(clamp);
    }

    // Translucent energy field shimmer
    const field = new THREE.Mesh(
      new THREE.CircleGeometry(1.52, 28),
      new THREE.MeshBasicMaterial({
        color: accentHex,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    grp.add(field);

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

  function createOutdoorWorld() {
    const group = new THREE.Group();
    const waterBump = getWaterBumpTexture();
    const rockBump = getRockBumpTexture();

    // Specular Ocean / Water Surface below flight path
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

    // Sculpted Flanking Canyon Cliffs / Mountain Massifs & Sky-Bridges
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
    const totalChunks = 14;
    const spacing = 22;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = new THREE.Group();
      chunk.position.z = 18 - i * spacing;

      [-1, 1].forEach((side) => {
        const xBase = side * (17.5 + (i % 3) * 3.2);
        const hScale = 1.15 + ((i * 7 + (side > 0 ? 3 : 1)) % 5) * 0.32;
        const rockGeo = createDisplacedRockGeo(6.4, 2, i * 1.7 + side);
        const massif = new THREE.Mesh(rockGeo, cliffMat);
        massif.scale.set(1.15, hScale * 1.55, 1.35);
        massif.position.set(xBase, -4.5 + hScale * 2.4, 0);
        massif.castShadow = true;
        massif.receiveShadow = true;
        chunk.add(massif);

        // Biome ridge cap (snow / foliage / mesa plateau)
        const cap = new THREE.Mesh(createDisplacedRockGeo(4.3, 1, i * 2.3), capMat);
        cap.scale.set(1.1, 0.36, 1.15);
        cap.position.set(xBase, -4.5 + hScale * 6.8, 0);
        chunk.add(cap);
      });

      // Every 4th chunk: High-altitude Steel Arch Sky-Bridge spanning high above!
      if (i % 4 === 2) {
        const arch = new THREE.Group();
        const deck = new THREE.Mesh(new THREE.BoxGeometry(44, 0.55, 2.2), bridgeMat);
        deck.position.y = 10.6;
        arch.add(deck);

        const archRing = new THREE.Mesh(new THREE.TorusGeometry(19, 0.42, 8, 24, Math.PI), bridgeMat);
        archRing.position.y = -4.5;
        arch.add(archRing);
        chunk.add(arch);
      }

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

    return {
      group,
      water,
      waterBump,
      cliffMat,
      capMat,
      props,
      clouds,
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
