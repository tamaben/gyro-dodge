// ============================================================================
// GYRO DODGE 3D — Main Flight Engine, Audio/SFX, Controls & Multiplayer
// ============================================================================
(() => {
  const {
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
  } = window.AeroModels;

  // =========================================================================
  // 1. PERSISTENT SAVE STATE
  // =========================================================================
  const SAVE_KEY = "gyro_dodge_aero_save_v1";
  const saveData = {
    credits: 2500,
    xp: 0,
    bestScore: 0,
    bestDist: 0,
    craftId: "falcon",
    liveryIdx: 0,
    chapterIdx: 0,
    environment: "outdoor",
    diffIdx: 1,
    soundOn: true
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) Object.assign(saveData, JSON.parse(raw));
  } catch (e) {}

  function persistSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); } catch (e) {}
  }

  // =========================================================================
  // 2. PROCEDURAL WEBAUDIO SFX + 7 RECORDED NAVIGATOR VOICES
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    engineGain: null,
    engineOsc: null,
    engineFilter: null,
    lastVoiceTime: 0,

    ensure() {
      if (!saveData.soundOn) return;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();

        // Subtle continuous jet turbine hum
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = "sawtooth";
        this.engineOsc.frequency.value = 68;

        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = "lowpass";
        this.engineFilter.frequency.value = 180;

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.value = 0.0;

        this.engineOsc.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);
        this.engineOsc.start();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    },

    updateEngine(playing, boosting, speedRatio) {
      if (!this.ctx || !this.engineGain) return;
      const now = this.ctx.currentTime;
      if (!saveData.soundOn || !playing) {
        this.engineGain.gain.setTargetAtTime(0.0, now, 0.08);
        return;
      }
      const targetFreq = (boosting ? 118 : 74) + speedRatio * 24;
      const targetCut = boosting ? 540 : 230;
      const targetVol = boosting ? 0.055 : 0.026;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(targetCut, now, 0.08);
      this.engineGain.gain.setTargetAtTime(targetVol, now, 0.08);
    },

    playTone(freqStart, freqEnd, duration, type = "sine", vol = 0.12) {
      if (!saveData.soundOn) return;
      this.ensure();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + duration);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    },

    sfxRing() {
      this.playTone(587.3, 1174.6, 0.18, "triangle", 0.13);
      setTimeout(() => this.playTone(880, 1760, 0.22, "sine", 0.09), 55);
    },

    sfxNearMiss() {
      this.playTone(420, 140, 0.22, "sawtooth", 0.08);
    },

    sfxHit() {
      this.playTone(150, 38, 0.36, "sawtooth", 0.22);
    },

    sfxEmp() {
      this.playTone(220, 960, 0.35, "sine", 0.16);
    },

    sfxClick() {
      this.playTone(720, 520, 0.05, "triangle", 0.05);
    }
  };

  function showCallout(text) {
    const wrap = document.getElementById("voice-banner-container");
    if (!wrap) return;
    wrap.innerHTML = "";
    const el = document.createElement("div");
    el.className = "voice-callout";
    el.innerHTML = `
      <span class="callout-wave"><span></span><span></span><span></span></span>
      <span class="callout-text">${text}</span>
    `;
    wrap.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1900);
  }

  function playVoice(key, force = false) {
    const v = window.VOICE_DATA && window.VOICE_DATA[key];
    if (!v) return;
    const now = performance.now();
    if (!force && now - AudioEngine.lastVoiceTime < 950) return;
    AudioEngine.lastVoiceTime = now;
    showCallout(v.quote);
    if (!saveData.soundOn) return;
    AudioEngine.ensure();

    const audio = new Audio(v.file);
    audio.volume = 0.95;
    audio.play().catch(() => {
      if (v.b64) {
        const fb = new Audio(v.b64);
        fb.volume = 0.95;
        fb.play().catch(() => {});
      }
    });
  }

  // =========================================================================
  // 3. THREE.JS REALISTIC PBR SCENE INITIALIZATION
  // =========================================================================
  const canvas = document.getElementById("game-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const envMap = buildEnvironmentMap(renderer);
  if (envMap) scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.15, 340);
  camera.position.set(0, 2.2, 9.5);

  // Studio + Atmospheric Lighting
  const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.95);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.55);
  sunLight.position.set(18, 28, 16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 2;
  sunLight.shadow.camera.far = 90;
  sunLight.shadow.camera.left = -16;
  sunLight.shadow.camera.right = 16;
  sunLight.shadow.camera.top = 16;
  sunLight.shadow.camera.bottom = -16;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.55);
  rimLight.position.set(-14, 6, -18);
  scene.add(rimLight);

  const burnerLight = new THREE.PointLight(0x38bdf8, 1.4, 14);
  scene.add(burnerLight);

  // Worlds: Atmospheric Sky Dome + Outdoor Canyon/Ocean + 12-Chapter Corridor
  const skyDome = createAtmosphericSkyDome();
  scene.add(skyDome.mesh);

  const outdoorWorld = createOutdoorWorld();
  scene.add(outdoorWorld.group);

  const corridorWorld = createCorridorWorld();
  scene.add(corridorWorld.group);

  // Showcase Aircraft on Home / Hangar
  const showcaseAnchor = new THREE.Group();
  showcaseAnchor.position.set(0, 1.1, 2.0);
  scene.add(showcaseAnchor);
  let showcaseCraft = null;

  function rebuildShowcaseCraft() {
    if (showcaseCraft) showcaseAnchor.remove(showcaseCraft.root);
    const livery = LIVERY_CATALOG[saveData.liveryIdx] || LIVERY_CATALOG[0];
    showcaseCraft = createAircraft(saveData.craftId, livery);
    showcaseAnchor.add(showcaseCraft.root);
  }
  rebuildShowcaseCraft();

  // High-Speed Wind / Atmospheric Dust Particles
  const speedParticlesCount = 160;
  const spGeo = new THREE.BufferGeometry();
  const spPos = new Float32Array(speedParticlesCount * 3);
  for (let i = 0; i < speedParticlesCount; i++) {
    spPos[i * 3]     = (Math.random() - 0.5) * 28;
    spPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    spPos[i * 3 + 2] = -Math.random() * 140;
  }
  spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
  const spMat = new THREE.PointsMaterial({
    color: 0xe0f2fe,
    size: 0.24,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const speedDust = new THREE.Points(spGeo, spMat);
  scene.add(speedDust);

  // 3D Burst Spark Particles Pool
  const bursts = [];
  function spawnBurst3D(x, y, z, colorHex = 0xfbbf24, count = 18) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const spd = 4 + Math.random() * 11;
      velocities.push(
        Math.cos(theta) * Math.cos(phi) * spd,
        Math.sin(phi) * spd,
        Math.sin(theta) * Math.cos(phi) * spd
      );
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.42,
      map: getGlowTexture("#" + new THREE.Color(colorHex).getHexString()),
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    bursts.push({ pts, geo, mat, velocities, age: 0, maxAge: 0.65 });
  }

  // =========================================================================
  // 4. DIFFICULTIES, TACTICAL ITEMS & WORLD THEME APPLICATION
  // =========================================================================
  const DIFFICULTIES = [
    { id: "EASY",    label: "EASY",    speed: 30, spawn: 1.12, shields: 4, mult: 0.85 },
    { id: "NORMAL",  label: "NORMAL",  speed: 38, spawn: 0.86, shields: 3, mult: 1.00 },
    { id: "HARD",    label: "HARD",    speed: 48, spawn: 0.68, shields: 2, mult: 1.45 },
    { id: "EXTREME", label: "EXTREME", speed: 58, spawn: 0.52, shields: 1, mult: 2.20 }
  ];

  const ATTACK_ITEMS = [
    { id: "EMP",     name: "EMP衝撃波",   duration: 3.5 },
    { id: "REVERSE", name: "ジャミング反転", duration: 3.5 },
    { id: "SMOKE",   name: "チャフ煙幕",   duration: 3.2 },
    { id: "GUST",    name: "乱気流ブラスト", duration: 3.4 }
  ];

  function applyWorldTheme() {
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const isIndoor = saveData.environment === "indoor";

    outdoorWorld.group.visible = !isIndoor;
    skyDome.mesh.visible = !isIndoor;
    corridorWorld.group.visible = isIndoor;

    if (isIndoor) {
      scene.background = new THREE.Color(ch.corridorBg);
      scene.fog = new THREE.FogExp2(ch.corridorBg, 0.0115);
      hemiLight.color.setHex(ch.lightHex);
      hemiLight.groundColor.setHex(ch.floorHex);
      sunLight.color.setHex(ch.lightHex);
      sunLight.intensity = 1.25;

      corridorWorld.floorMat.color.setHex(ch.floorHex);
      corridorWorld.ribMat.color.setHex(ch.ribHex);
      corridorWorld.railMat.color.setHex(ch.railHex);
      corridorWorld.railMat.emissive.setHex(ch.railHex);
      corridorWorld.lightStripMat.color.setHex(ch.lightHex);
      corridorWorld.rebuildShape(ch.shape);
    } else {
      scene.background = null;
      scene.fog = new THREE.FogExp2(ch.fogHex, 0.0068);

      skyDome.uniforms.uTopColor.value.setHex(ch.skyTop);
      skyDome.uniforms.uHorizonColor.value.setHex(ch.skyHorizon);
      skyDome.uniforms.uSunColor.value.setHex(ch.sunColor);
      skyDome.uniforms.uSunDir.value.set(ch.sunPos[0], ch.sunPos[1], ch.sunPos[2]).normalize();
      skyDome.uniforms.uNightMix.value = ch.isNight ? 1.0 : 0.0;

      hemiLight.color.setHex(ch.sunColor);
      hemiLight.groundColor.setHex(ch.waterHex);
      sunLight.color.setHex(ch.sunColor);
      sunLight.intensity = ch.isNight ? 0.95 : 1.65;

      outdoorWorld.water.material.color.setHex(ch.waterHex);
      outdoorWorld.cliffMat.color.setHex(ch.cliffHex);
      outdoorWorld.capMat.color.setHex(ch.capHex);
    }

    syncHomeUI();
  }

  // =========================================================================
  // 5. GAME SESSION STATE & ENTITY MANAGEMENT
  // =========================================================================
  const BOUND_X = 6.5;
  const BOUND_Y_MIN = -3.4;
  const BOUND_Y_MAX = 4.6;

  let gameMode = "SOLO"; // SOLO | BODY | ONLINE | MONITOR | REMOTE
  let isPlaying = false;
  let hangarOpen = false;

  let score = 0;
  let distance = 0;
  let ringsCollected = 0;
  let nearMisses = 0;
  let speedLevel = 1;
  let clearedStage = false;
  let boostEnergy = 100;
  let cameraShake = 0;
  let eventBannerTimer = 0;

  let players = [];
  let obstacles = [];
  let energyRings = [];
  let supplyPods = [];

  let obsSpawnTimer = 0;
  let ringSpawnTimer = 0.6;
  let podSpawnTimer = 3.2;

  // Showcase 360° orbit camera state
  let orbitYaw = 0.36;
  let orbitPitch = 0.16;
  let showcaseDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // Player Steering Input
  let stickX = 0, stickY = 0;
  let gyroX = 0, gyroY = 0;
  let dragSteerX = 0, dragSteerY = 0;
  let bodyX = 0, bodyY = 0;
  let rawBeta = 0, rawGamma = 0;
  let zeroBeta = null, zeroGamma = null;
  let isBoosting = false;
  const keys = {};

  function clearEntities() {
    players.forEach((p) => scene.remove(p.craft.root));
    obstacles.forEach((o) => scene.remove(o.mesh));
    energyRings.forEach((r) => scene.remove(r.mesh));
    supplyPods.forEach((b) => scene.remove(b.mesh));
    players = [];
    obstacles = [];
    energyRings = [];
    supplyPods = [];
  }

  function spawnPlayerEntity(id, name, slotIdx, isBot = false, conn = null) {
    const modelId = slotIdx === 0
      ? saveData.craftId
      : CRAFT_CATALOG[slotIdx % CRAFT_CATALOG.length].id;
    const livery = slotIdx === 0
      ? LIVERY_CATALOG[saveData.liveryIdx]
      : LIVERY_CATALOG[(saveData.liveryIdx + slotIdx) % LIVERY_CATALOG.length];

    const craft = createAircraft(modelId, livery);
    const angle = (slotIdx / 8) * Math.PI * 2;
    const sx = slotIdx === 0 ? 0 : Math.cos(angle) * 2.2;
    const sy = slotIdx === 0 ? 0.8 : 0.8 + Math.sin(angle) * 1.4;
    craft.root.position.set(sx, sy, 2.0);
    scene.add(craft.root);

    const diff = DIFFICULTIES[saveData.diffIdx];
    return {
      id, name, slotIdx, isBot, conn, craft,
      x: sx, y: sy,
      vx: 0, vy: 0,
      ix: 0, iy: 0,
      boost: false,
      alive: true,
      shields: diff.shields,
      maxShields: diff.shields,
      invulnUntil: 0,
      score: 0,
      distance: 0,
      heldItem: null,
      revUntil: 0,
      smokeUntil: 0,
      gustUntil: 0,
      gustDir: 1
    };
  }

  function showHudEvent(text, comboText = "") {
    const el = document.getElementById("hud-event-text");
    const combo = document.getElementById("hud-combo-pill");
    if (el) el.textContent = text;
    if (combo) {
      if (comboText) {
        combo.textContent = comboText;
        combo.classList.remove("hidden");
      } else {
        combo.classList.add("hidden");
      }
    }
    eventBannerTimer = 1.35;
  }

  function updateShieldHUD(me) {
    const wrap = document.getElementById("hud-hull-segs");
    if (!wrap || !me) return;
    let html = "";
    for (let i = 0; i < me.maxShields; i++) {
      const active = i < me.shields;
      const cls = active ? (me.shields === 1 ? "hull-seg critical" : "hull-seg active") : "hull-seg";
      html += `<span class="${cls}"></span>`;
    }
    wrap.innerHTML = html;
  }

  function updateTacticalButton(me) {
    const btn = document.getElementById("btn-tactical-item");
    const lbl = document.getElementById("hud-item-name");
    if (!btn || !lbl) return;
    if (me && me.heldItem) {
      btn.classList.add("ready");
      lbl.textContent = me.heldItem.name;
    } else {
      btn.classList.remove("ready");
      lbl.textContent = "未装備";
    }
  }

  function fireTacticalItem(attacker) {
    if (!attacker || !attacker.alive || !attacker.heldItem) return;
    const item = attacker.heldItem;
    attacker.heldItem = null;
    AudioEngine.sfxEmp();

    const rivals = players.filter((p) => p.alive && p.id !== attacker.id);
    if (rivals.length === 0 || item.id === "EMP") {
      // Solo or EMP: blast nearby obstacles into 3D sparks!
      let blasted = 0;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].z > -85 && obstacles[i].z < 10) {
          spawnBurst3D(obstacles[i].x, obstacles[i].y, obstacles[i].z, 0x38bdf8, 20);
          scene.remove(obstacles[i].mesh);
          obstacles.splice(i, 1);
          blasted++;
        }
      }
      const bonus = 300 + blasted * 120;
      attacker.score += bonus;
      if (attacker.id === "me") {
        showHudEvent("EMP BLAST!", `障害物 ${blasted}個 粉砕 +${bonus}`);
        updateTacticalButton(attacker);
      }
      if (attacker.conn && attacker.conn.open) {
        attacker.conn.send({ type: "ITEM_STATE", itemName: null });
      }
      return;
    }

    const target = rivals[Math.floor(Math.random() * rivals.length)];
    const now = performance.now();
    if (item.id === "REVERSE") target.revUntil = now + item.duration * 1000;
    if (item.id === "SMOKE") target.smokeUntil = now + item.duration * 1000;
    if (item.id === "GUST") {
      target.gustUntil = now + item.duration * 1000;
      target.gustDir = Math.random() < 0.5 ? -1 : 1;
    }

    showCallout(`${attacker.name} → ${target.name} : ${item.name}！`);
    if (attacker.id === "me") updateTacticalButton(attacker);
    if (attacker.conn && attacker.conn.open) {
      attacker.conn.send({ type: "ITEM_STATE", itemName: null });
    }
    if (target.conn && target.conn.open) {
      target.conn.send({ type: "ATTACKED", item });
    }
  }

  // =========================================================================
  // 6. SPAWN OBSTACLES, ENERGY RINGS & TACTICAL PODS
  // =========================================================================
  function spawnWorldObstacle() {
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const roll = Math.random();
    let type = "MINE";
    if (roll < 0.30) type = "BARRIER";
    else if (roll < 0.58) type = saveData.environment === "outdoor" ? "BOULDER" : "MINE";
    else if (roll < 0.80) type = "DRONE";

    const built = createObstacle(type, ch);
    const ox = (Math.random() - 0.5) * (BOUND_X * 1.85);
    const oy = BOUND_Y_MIN + 0.8 + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN - 1.2);
    const oz = -138;

    built.mesh.position.set(ox, oy, oz);
    const angleZ = type === "BARRIER" ? (Math.random() * Math.PI) : 0;
    built.mesh.rotation.z = angleZ;
    const rotSpeedZ = type === "BARRIER" && speedLevel >= 2 ? (Math.random() - 0.5) * 1.4 : 0;

    scene.add(built.mesh);
    obstacles.push({
      ...built,
      type,
      x: ox,
      y: oy,
      z: oz,
      angleZ,
      rotSpeedZ,
      spinX: type === "BOULDER" ? (Math.random() - 0.5) * 1.8 : 0,
      spinY: type !== "BARRIER" ? (Math.random() - 0.5) * 2.2 : 0,
      passed: new Set()
    });
  }

  function spawnWorldRing() {
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const ringObj = createEnergyRing(saveData.environment === "indoor" ? ch.railHex : 0xfbbf24);
    const rx = (Math.random() - 0.5) * (BOUND_X * 1.5);
    const ry = BOUND_Y_MIN + 1.0 + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN - 1.6);
    const rz = -135;
    ringObj.mesh.position.set(rx, ry, rz);
    scene.add(ringObj.mesh);
    energyRings.push({ ...ringObj, x: rx, y: ry, z: rz, taken: false });
  }

  function spawnWorldSupplyPod() {
    const podObj = createSupplyPod();
    const px = (Math.random() - 0.5) * (BOUND_X * 1.4);
    const py = BOUND_Y_MIN + 1.0 + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN - 1.6);
    const pz = -135;
    podObj.mesh.position.set(px, py, pz);
    scene.add(podObj.mesh);
    supplyPods.push({ ...podObj, x: px, y: py, z: pz, taken: false });
  }

  // =========================================================================
  // 7. LAUNCH & END MISSION FLOWS
  // =========================================================================
  async function launchSoloOrBody(useBodyCam = false) {
    AudioEngine.ensure();
    closeAllModals();

    gameMode = useBodyCam ? "BODY" : "SOLO";
    if (useBodyCam) {
      const ok = await enableBodyCamera();
      if (!ok) {
        showCallout("カメラ未検出のため標準ジャイロ・スティック操作で出撃します");
        gameMode = "SOLO";
      }
    } else {
      stopBodyCamera();
    }

    beginFlightSession([{ id: "me", name: "YOU", isBot: false, conn: null }]);
  }

  function beginFlightSession(roster) {
    clearEntities();
    showcaseAnchor.visible = false;

    score = 0;
    distance = 0;
    ringsCollected = 0;
    nearMisses = 0;
    speedLevel = 1;
    clearedStage = false;
    boostEnergy = 100;
    isBoosting = false;
    obsSpawnTimer = 0.6;
    ringSpawnTimer = 0.4;
    podSpawnTimer = 2.6;

    // Auto-calibrate gyro baseline at launch
    if (rawBeta !== 0 || rawGamma !== 0) {
      zeroBeta = rawBeta;
      zeroGamma = rawGamma;
    }

    roster.forEach((m, idx) => {
      players.push(spawnPlayerEntity(m.id, m.name, idx, m.isBot, m.conn));
    });

    const me = players.find((p) => p.id === "me") || players[0];
    updateShieldHUD(me);
    updateTacticalButton(me);

    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    document.getElementById("hud-stage-title").textContent =
      `CH.${ch.chapter} ${ch.name} (${saveData.environment === "indoor" ? "回廊" : "空域"})`;

    document.getElementById("home-shell").classList.add("hidden");
    document.getElementById("flight-hud").classList.remove("hidden");
    document.getElementById("hud-bottom-controls").classList.toggle("hidden", gameMode === "MONITOR");
    document.getElementById("hud-alive-wrap").classList.toggle("hidden", players.length <= 1);
    document.getElementById("body-preview-wrap").classList.toggle("hidden", gameMode !== "BODY");
    document.body.classList.add("in-flight");

    isPlaying = true;
    showHudEvent("SORTIE // GO!", `TARGET 500m`);
    playVoice("start", true);

    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }

  function finishFlightSession(victory = false) {
    isPlaying = false;
    isBoosting = false;
    document.body.classList.remove("in-flight");
    AudioEngine.updateEngine(false, false, 0);
    document.getElementById("blind-overlay").classList.remove("active");
    document.getElementById("screen-fx").classList.remove("boost-active", "damage-flash");
    document.getElementById("body-preview-wrap").classList.add("hidden");

    const me = players.find((p) => p.id === "me") || players[0];
    const finalScore = Math.floor(me ? me.score : score);
    const finalDist = Math.floor(me ? me.distance : distance);
    const earnedCredits = Math.max(25, Math.floor(finalScore * 0.08) + ringsCollected * 25 + (victory ? 300 : 0));

    saveData.credits += earnedCredits;
    saveData.xp += Math.floor(finalDist * 0.6) + ringsCollected * 15;
    if (finalScore > saveData.bestScore) saveData.bestScore = finalScore;
    if (finalDist > saveData.bestDist) saveData.bestDist = finalDist;
    persistSave();
    syncHomeUI();

    document.getElementById("res-kicker").textContent = victory ? "MISSION ACCOMPLISHED" : "HULL BREACHED";
    document.getElementById("res-kicker").style.color = victory ? "#34d399" : "#f87171";
    document.getElementById("res-title").textContent = victory ? "ステージクリア！見事な飛行！" : "機体大破・ミッション終了";
    document.getElementById("res-score").textContent = finalScore.toLocaleString();
    document.getElementById("res-dist").textContent = `${finalDist}m`;
    document.getElementById("res-credits").textContent = `+${earnedCredits.toLocaleString()}`;
    document.getElementById("res-bonus").textContent =
      `リング通過: ${ringsCollected}個  /  ニアミス回避: ${nearMisses}回`;

    const rankBox = document.getElementById("res-ranking");
    if (players.length > 1) {
      rankBox.classList.remove("hidden");
      const sorted = [...players].sort((a, b) => b.score - a.score);
      rankBox.innerHTML = sorted.map((p, idx) => `
        <div class="setting-row" style="padding:7px 12px;">
          <span style="font-weight:900; font-size:13px;">#${idx + 1} ${p.name}</span>
          <span style="font-weight:800; font-size:13px; color:#fbbf24;">${Math.floor(p.score).toLocaleString()} pts (${Math.floor(p.distance)}m)</span>
        </div>
      `).join("");
    } else {
      rankBox.classList.add("hidden");
    }

    document.getElementById("modal-result").classList.remove("modal-offscreen", "hidden");
    const resFrame = document.querySelector("#result-ad-top iframe");
    const nowWall = Date.now();
    if (resFrame && (!window.__lastResAdAt || nowWall - window.__lastResAdAt > 35000)) {
      window.__lastResAdAt = nowWall;
      resFrame.src = "ad_slot_a.html?t=" + nowWall;
    }
    playVoice(victory ? "clear" : "gameover", true);
  }

  function returnToHangarHome() {
    isPlaying = false;
    isBoosting = false;
    document.body.classList.remove("in-flight");
    AudioEngine.updateEngine(false, false, 0);
    stopBodyCamera();
    clearEntities();
    closeAllModals();

    showcaseAnchor.visible = true;
    document.getElementById("flight-hud").classList.add("hidden");
    document.getElementById("body-preview-wrap").classList.add("hidden");
    document.getElementById("blind-overlay").classList.remove("active");
    document.getElementById("home-shell").classList.remove("hidden");
    syncHomeUI();
    playVoice("yahho", false);
  }

  // =========================================================================
  // 8. INPUT SYSTEMS (VIRTUAL STICK, GYRO, TOUCH DRAG, BODY CAM, KEYBOARD)
  // =========================================================================
  // A. Showcase 360° Orbit Drag on Home / Hangar
  const showcaseArea = document.getElementById("showcase-drag-area");
  showcaseArea.addEventListener("pointerdown", (e) => {
    showcaseDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  });
  window.addEventListener("pointermove", (e) => {
    if (!showcaseDragging || isPlaying) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    orbitYaw += dx * 0.011;
    orbitPitch = Math.max(-0.35, Math.min(0.65, orbitPitch + dy * 0.008));
  });
  window.addEventListener("pointerup", () => { showcaseDragging = false; });

  // B. Left Virtual Analog Thumbstick
  const stickZone = document.getElementById("stick-zone");
  const stickNub = document.getElementById("stick-nub");
  let stickPointerId = null;

  function updateStickFromEvent(e) {
    const rect = stickZone.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const maxR = rect.width * 0.38;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    stickX = dx / maxR;
    stickY = -dy / maxR;
    stickNub.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  stickZone.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    stickPointerId = e.pointerId;
    stickZone.setPointerCapture(e.pointerId);
    updateStickFromEvent(e);
  });
  stickZone.addEventListener("pointermove", (e) => {
    if (e.pointerId === stickPointerId) updateStickFromEvent(e);
  });
  function releaseStick(e) {
    if (e.pointerId !== stickPointerId) return;
    stickPointerId = null;
    stickX = 0;
    stickY = 0;
    stickNub.style.transform = "translate(0px, 0px)";
  }
  stickZone.addEventListener("pointerup", releaseStick);
  stickZone.addEventListener("pointercancel", releaseStick);

  // C. Fullscreen Canvas Drag Steer Fallback
  let canvasPointerId = null;
  let canvasOriginX = 0, canvasOriginY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    if (!isPlaying || gameMode === "BODY") return;
    canvasPointerId = e.pointerId;
    canvasOriginX = e.clientX;
    canvasOriginY = e.clientY;
  });
  window.addEventListener("pointermove", (e) => {
    if (!isPlaying || e.pointerId !== canvasPointerId || gameMode === "BODY") return;
    dragSteerX = Math.max(-1, Math.min(1, (e.clientX - canvasOriginX) / 95));
    dragSteerY = Math.max(-1, Math.min(1, -(e.clientY - canvasOriginY) / 95));
  });
  window.addEventListener("pointerup", (e) => {
    if (e.pointerId === canvasPointerId) {
      canvasPointerId = null;
      dragSteerX = 0;
      dragSteerY = 0;
    }
  });

  // D. Smartphone Gyroscope Orientation
  window.addEventListener("deviceorientation", (e) => {
    if (e.beta === null || e.gamma === null) return;
    rawBeta = e.beta;
    rawGamma = e.gamma;
    if (zeroBeta === null) {
      zeroBeta = rawBeta;
      zeroGamma = rawGamma;
    }
    gyroX = Math.max(-1, Math.min(1, (rawGamma - zeroGamma) / 22));
    gyroY = Math.max(-1, Math.min(1, -(rawBeta - zeroBeta) / 22));

    const rDot = document.getElementById("remote-dot");
    if (rDot && !remotePadActive) {
      rDot.style.transform = `translate(${gyroX * 42}px, ${-gyroY * 42}px)`;
      sendRemotePacket(gyroX, gyroY);
    }
  });

  async function requestGyroPermission() {
    AudioEngine.sfxClick();
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try { await DeviceOrientationEvent.requestPermission(); } catch (e) {}
    }
    calibrateGyroZero();
    playVoice("yahho", true);
  }

  function calibrateGyroZero() {
    AudioEngine.sfxClick();
    zeroBeta = rawBeta;
    zeroGamma = rawGamma;
    gyroX = 0;
    gyroY = 0;
    showCallout("ジャイロ水平基準をリセットしました");
  }

  // E. Keyboard Controls
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (k === " " || k === "shift") isBoosting = true;
    if ((k === "e" || k === "enter") && isPlaying) {
      const me = players.find((p) => p.id === "me");
      if (me) fireTacticalItem(me);
    }
    if (k === "escape" && isPlaying) returnToHangarHome();
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    keys[k] = false;
    if (k === " " || k === "shift") isBoosting = false;
  });

  // F. Body Camera Optical Motion Control
  let camStream = null;
  let prevCamFrame = null;
  const bodyVideo = document.getElementById("body-video");
  const bodyCanvas = document.getElementById("body-canvas");
  const bodyCtx = bodyCanvas.getContext("2d", { willReadFrequently: true });

  async function enableBodyCamera() {
    if (camStream) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 160, height: 120 },
        audio: false
      });
      bodyVideo.srcObject = camStream;
      await bodyVideo.play();
      prevCamFrame = null;
      return true;
    } catch (e) {
      return false;
    }
  }

  function stopBodyCamera() {
    if (camStream) {
      camStream.getTracks().forEach((t) => t.stop());
      camStream = null;
    }
    prevCamFrame = null;
    bodyX = 0;
    bodyY = 0;
  }

  function pollBodyCamera() {
    if (gameMode !== "BODY" || !camStream || bodyVideo.readyState < 2) return;
    const w = bodyCanvas.width, h = bodyCanvas.height;
    bodyCtx.drawImage(bodyVideo, 0, 0, w, h);
    const frame = bodyCtx.getImageData(0, 0, w, h).data;
    if (prevCamFrame) {
      let sx = 0, sy = 0, weight = 0;
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const i = (y * w + x) * 4;
          const d = Math.abs(frame[i] - prevCamFrame[i]) +
                    Math.abs(frame[i + 1] - prevCamFrame[i + 1]) +
                    Math.abs(frame[i + 2] - prevCamFrame[i + 2]);
          if (d > 52) {
            sx += ((w - x) / w * 2 - 1) * d;
            sy += (-(y / h * 2 - 1)) * d;
            weight += d;
          }
        }
      }
      if (weight > 16000) {
        const tx = Math.max(-1, Math.min(1, (sx / weight) * 1.85));
        const ty = Math.max(-1, Math.min(1, (sy / weight) * 1.85));
        bodyX += (tx - bodyX) * 0.28;
        bodyY += (ty - bodyY) * 0.28;
      } else {
        bodyX *= 0.9;
        bodyY *= 0.9;
      }
    }
    prevCamFrame = new Uint8ClampedArray(frame);
  }

  // =========================================================================
  // 9. UI MODALS, HANGAR, STAGE PICKER & MULTIPLAYER (PEERJS)
  // =========================================================================
  function closeAllModals() {
    hangarOpen = false;
    ["modal-hangar", "modal-stages", "modal-multi", "modal-settings"].forEach((id) => {
      document.getElementById(id).classList.add("hidden");
    });
    document.getElementById("modal-result").classList.add("modal-offscreen");
  }

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      AudioEngine.sfxClick();
      closeAllModals();
    });
  });

  function syncHomeUI() {
    const craftMeta = CRAFT_CATALOG.find((c) => c.id === saveData.craftId) || CRAFT_CATALOG[0];
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const lvl = Math.floor(saveData.xp / 500) + 1;

    document.getElementById("ui-pilot-lvl").textContent = `PILOT LV.${lvl}`;
    document.getElementById("ui-credits").textContent = saveData.credits.toLocaleString();
    document.getElementById("ui-best-score").textContent = saveData.bestScore.toLocaleString();
    document.getElementById("ui-best-dist").textContent = `MAX ${saveData.bestDist}m`;

    document.getElementById("spec-code").textContent = `${craftMeta.code} // ${craftMeta.name}`;
    document.getElementById("spec-name").textContent = craftMeta.jpName;
    document.getElementById("bar-speed").style.width = `${craftMeta.speedStat}%`;
    document.getElementById("bar-agility").style.width = `${craftMeta.agilityStat}%`;
    document.getElementById("bar-armor").style.width = `${craftMeta.armorStat}%`;

    document.getElementById("btn-env-outdoor").classList.toggle("active", saveData.environment === "outdoor");
    document.getElementById("btn-env-indoor").classList.toggle("active", saveData.environment === "indoor");
    document.getElementById("ui-stage-label").textContent = `CH.${ch.chapter} ${ch.name}`;

    document.querySelectorAll("#diff-bar .diff-pill").forEach((b, idx) => {
      b.classList.toggle("active", idx === saveData.diffIdx);
    });

    document.getElementById("btn-audio-toggle").textContent = saveData.soundOn ? "音・ボイス ON" : "ミュート中";
  }

  // Hangar UI Population
  function renderHangarModal() {
    const cGrid = document.getElementById("hangar-craft-grid");
    cGrid.innerHTML = CRAFT_CATALOG.map((c) => `
      <button type="button" data-craft-id="${c.id}" class="craft-card ${c.id === saveData.craftId ? "active" : ""}">
        <div class="craft-card-code">${c.code}</div>
        <div class="craft-card-name">${c.jpName}</div>
        <div class="craft-card-role">${c.role}</div>
      </button>
    `).join("");

    cGrid.querySelectorAll("[data-craft-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AudioEngine.sfxClick();
        saveData.craftId = btn.dataset.craftId;
        persistSave();
        rebuildShowcaseCraft();
        renderHangarModal();
        syncHomeUI();
      });
    });

    const lRow = document.getElementById("hangar-livery-row");
    lRow.innerHTML = LIVERY_CATALOG.map((l, idx) => {
      const hex = "#" + new THREE.Color(l.primary).getHexString();
      return `
        <button type="button" data-livery-idx="${idx}" class="livery-swatch ${idx === saveData.liveryIdx ? "active" : ""}">
          <span class="swatch-dot" style="background:${hex};"></span>
          <span>${l.name}</span>
        </button>
      `;
    }).join("");

    lRow.querySelectorAll("[data-livery-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AudioEngine.sfxClick();
        saveData.liveryIdx = Number(btn.dataset.liveryIdx);
        persistSave();
        if (showcaseCraft) showcaseCraft.setLivery(LIVERY_CATALOG[saveData.liveryIdx]);
        renderHangarModal();
      });
    });
  }

  // Chapters Modal Population
  function renderChaptersModal() {
    const grid = document.getElementById("chapter-list-grid");
    grid.innerHTML = CHAPTERS.map((c, idx) => `
      <div class="chapter-card ${idx === saveData.chapterIdx ? "selected" : ""}">
        <div>
          <div class="chapter-top">
            <span class="chapter-num">CHAPTER ${String(c.chapter).padStart(2, "0")}</span>
            <span class="chapter-shape-badge">${c.tag}</span>
          </div>
          <div class="chapter-title">${c.name}</div>
        </div>
        <div class="chapter-actions">
          <button type="button" data-launch-env="outdoor" data-launch-ch="${idx}" class="btn-secondary-sm">空域で出撃</button>
          <button type="button" data-launch-env="indoor" data-launch-ch="${idx}" class="btn-primary-sm">回廊で出撃</button>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll("[data-launch-ch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AudioEngine.sfxClick();
        saveData.environment = btn.dataset.launchEnv;
        saveData.chapterIdx = Number(btn.dataset.launchCh);
        persistSave();
        applyWorldTheme();
        launchSoloOrBody(false);
      });
    });
  }

  // Settings Voice Test Population
  function renderVoiceSettings() {
    const list = document.getElementById("voice-test-list");
    const items = [
      ["yahho", "01 ヤッホー"],
      ["start", "02 スタート"],
      ["abuna", "03 あぶなっ"],
      ["good", "04 いいよ！"],
      ["speedup", "05 スピードアップ"],
      ["clear", "06 クリア"],
      ["gameover", "07 ゲーム失敗"]
    ];
    list.innerHTML = items.map(([k, label]) => `
      <button type="button" data-voice-key="${k}" class="btn-action-slate" style="text-align:left; font-size:12px;">
        ▶ ${label}
      </button>
    `).join("");
    list.querySelectorAll("[data-voice-key]").forEach((btn) => {
      btn.addEventListener("click", () => playVoice(btn.dataset.voiceKey, true));
    });
  }
  renderVoiceSettings();

  // PeerJS Multiplayer (Online Battle / Monitor Host / Smartphone Remote)
  let peer = null;
  let hostRoster = [];
  let clientConn = null;
  let botSeq = 1;
  let remotePadActive = false;

  function switchMpTab(tabName) {
    document.querySelectorAll("[data-mp-tab]").forEach((b) => {
      b.classList.toggle("active", b.dataset.mpTab === tabName);
    });
    document.getElementById("mp-panel-online").classList.toggle("hidden", tabName !== "online");
    document.getElementById("mp-panel-monitor").classList.toggle("hidden", tabName !== "monitor");
    document.getElementById("mp-panel-remote").classList.toggle("hidden", tabName !== "remote");
    if (tabName === "monitor") initMonitorHost();
  }

  document.querySelectorAll("[data-mp-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      AudioEngine.sfxClick();
      switchMpTab(btn.dataset.mpTab);
    });
  });

  function sendRemotePacket(ix, iy) {
    if (clientConn && clientConn.open) {
      clientConn.send({ type: "CTRL", ix, iy, boost: isBoosting });
    }
  }

  // Online Room Create / Join
  function renderOnlineMembers() {
    const box = document.getElementById("online-member-list");
    box.innerHTML = hostRoster.map((m, i) => `
      <div class="setting-row" style="padding:7px 12px;">
        <span style="font-weight:800; font-size:12px;">P${i + 1}: ${m.name}</span>
        <span style="font-size:11px; color:#38bdf8; font-weight:800;">${m.isBot ? "AI RIVAL" : "PILOT"}</span>
      </div>
    `).join("");
  }

  document.getElementById("btn-online-create").addEventListener("click", () => {
    AudioEngine.sfxClick();
    const myName = document.getElementById("online-name").value.trim() || "HOST-01";
    const code = String(Math.floor(1000 + Math.random() * 9000));
    document.getElementById("online-room-code").textContent = code;
    document.getElementById("online-entry-box").classList.add("hidden");
    document.getElementById("online-room-box").classList.remove("hidden");
    document.getElementById("online-status-msg").textContent = "パイロット参加待機中...（BOT追加ですぐ対戦も可能）";

    hostRoster = [{ id: "me", name: myName, isBot: false, conn: null }];
    renderOnlineMembers();

    if (peer) peer.destroy();
    if (typeof Peer !== "undefined") {
      peer = new Peer("gd3d-online-" + code);
      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          if (data.type === "JOIN" && hostRoster.length < 6) {
            const pname = (data.name || `P${hostRoster.length + 1}`).slice(0, 10);
            hostRoster.push({ id: conn.peer, name: pname, isBot: false, conn });
            renderOnlineMembers();
            playVoice("yahho", true);
            conn.send({ type: "WELCOME", name: pname });
          } else if (data.type === "CTRL") {
            const p = players.find((pl) => pl.id === conn.peer);
            if (p) { p.ix = data.ix || 0; p.iy = data.iy || 0; p.boost = Boolean(data.boost); }
          } else if (data.type === "ATTACK") {
            const p = players.find((pl) => pl.id === conn.peer);
            if (p) fireTacticalItem(p);
          }
        });
      });
    }
  });

  document.getElementById("btn-online-add-bot").addEventListener("click", () => {
    if (hostRoster.length >= 6) return;
    AudioEngine.sfxClick();
    hostRoster.push({ id: "bot-" + (botSeq++), name: `ACE-BOT ${hostRoster.length}`, isBot: true, conn: null });
    renderOnlineMembers();
  });

  document.getElementById("btn-online-start").addEventListener("click", () => {
    AudioEngine.sfxClick();
    if (hostRoster.length === 1) {
      hostRoster.push({ id: "bot-" + (botSeq++), name: "ACE-BOT 1", isBot: true, conn: null });
      hostRoster.push({ id: "bot-" + (botSeq++), name: "ACE-BOT 2", isBot: true, conn: null });
    }
    hostRoster.forEach((m) => {
      if (m.conn && m.conn.open) m.conn.send({ type: "START_BATTLE" });
    });
    gameMode = "ONLINE";
    closeAllModals();
    beginFlightSession(hostRoster);
  });

  document.getElementById("btn-online-join").addEventListener("click", () => {
    const code = document.getElementById("online-join-code").value.trim();
    const myName = document.getElementById("online-name").value.trim() || "GUEST";
    const status = document.getElementById("online-status-msg");
    if (code.length !== 4 || typeof Peer === "undefined") {
      status.textContent = "4桁のルームコードを入力してください";
      return;
    }
    status.textContent = "接続中...";
    if (peer) peer.destroy();
    peer = new Peer();
    peer.on("open", () => {
      clientConn = peer.connect("gd3d-online-" + code);
      clientConn.on("open", () => clientConn.send({ type: "JOIN", name: myName }));
      clientConn.on("data", (data) => {
        if (data.type === "WELCOME") {
          status.textContent = `${data.name} として接続完了！ホストの出撃を待っています...`;
          playVoice("yahho", true);
        } else if (data.type === "START_BATTLE") {
          gameMode = "ONLINE";
          closeAllModals();
          beginFlightSession([{ id: "me", name: myName, isBot: false, conn: null }]);
        } else if (data.type === "ITEM_STATE") {
          const me = players.find((p) => p.id === "me");
          if (me) {
            me.heldItem = data.itemName ? { id: "EMP", name: data.itemName } : null;
            updateTacticalButton(me);
          }
        } else if (data.type === "ATTACKED") {
          showCallout(`⚠️ ${data.item.name} を受けた！`);
          if (data.item.id === "SMOKE") {
            const bl = document.getElementById("blind-overlay");
            bl.classList.add("active");
            setTimeout(() => bl.classList.remove("active"), 3200);
          }
        }
      });
    });
  });

  // Monitor Host Mode
  function renderMonitorSlots() {
    document.getElementById("host-count").textContent = String(hostRoster.length);
    const box = document.getElementById("host-slots");
    let html = "";
    for (let i = 0; i < 10; i++) {
      const m = hostRoster[i];
      if (m) {
        html += `<div class="slot-box filled"><div style="font-weight:900; color:#38bdf8;">P${i + 1}</div><div style="font-weight:800;">${m.name}</div></div>`;
      } else {
        html += `<div class="slot-box"><div style="color:#64748b;">P${i + 1}</div><div style="color:#475569;">待機中</div></div>`;
      }
    }
    box.innerHTML = html;
  }

  function initMonitorHost() {
    hostRoster = [];
    renderMonitorSlots();
    const code = String(Math.floor(1000 + Math.random() * 9000));
    document.getElementById("host-code").textContent = code;
    const qr = document.getElementById("host-qrcode");
    qr.innerHTML = "";
    try {
      new QRCode(qr, { text: `${location.origin}${location.pathname}?room=${code}`, width: 72, height: 72 });
    } catch (e) {}

    if (peer) peer.destroy();
    if (typeof Peer !== "undefined") {
      peer = new Peer("gd3d-mon-" + code);
      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          if (data.type === "JOIN" && hostRoster.length < 10) {
            const slot = hostRoster.length + 1;
            const pname = (data.name || `P${slot}`).slice(0, 10);
            hostRoster.push({ id: conn.peer, name: pname, isBot: false, conn });
            renderMonitorSlots();
            playVoice("yahho", true);
            conn.send({ type: "JOINED", slot, name: pname });
          } else if (data.type === "CTRL") {
            const p = players.find((pl) => pl.id === conn.peer);
            if (p) { p.ix = data.ix || 0; p.iy = data.iy || 0; p.boost = Boolean(data.boost); }
          } else if (data.type === "ATTACK") {
            const p = players.find((pl) => pl.id === conn.peer);
            if (p) fireTacticalItem(p);
          }
        });
      });
    }
  }

  document.getElementById("btn-host-add-bot").addEventListener("click", () => {
    if (hostRoster.length >= 10) return;
    AudioEngine.sfxClick();
    hostRoster.push({ id: "bot-" + (botSeq++), name: `BOT-${hostRoster.length + 1}`, isBot: true, conn: null });
    renderMonitorSlots();
  });

  document.getElementById("btn-host-clear-bot").addEventListener("click", () => {
    AudioEngine.sfxClick();
    hostRoster = hostRoster.filter((m) => !m.isBot);
    renderMonitorSlots();
  });

  document.getElementById("btn-host-start").addEventListener("click", () => {
    AudioEngine.sfxClick();
    if (hostRoster.length === 0) {
      hostRoster.push({ id: "bot-" + (botSeq++), name: "ACE-1", isBot: true, conn: null });
      hostRoster.push({ id: "bot-" + (botSeq++), name: "ACE-2", isBot: true, conn: null });
      hostRoster.push({ id: "bot-" + (botSeq++), name: "ACE-3", isBot: true, conn: null });
    }
    gameMode = "MONITOR";
    closeAllModals();
    beginFlightSession(hostRoster);
  });

  // Smartphone Remote Controller Tab
  document.getElementById("btn-remote-connect").addEventListener("click", () => {
    const code = document.getElementById("remote-code-input").value.trim();
    const name = document.getElementById("remote-name-input").value.trim() || "PILOT";
    const msg = document.getElementById("remote-msg");
    if (code.length !== 4 || typeof Peer === "undefined") {
      msg.textContent = "4桁コードを入力してください";
      return;
    }
    msg.textContent = "接続中...";
    if (peer) peer.destroy();
    peer = new Peer();
    peer.on("open", () => {
      clientConn = peer.connect("gd3d-mon-" + code);
      clientConn.on("open", () => clientConn.send({ type: "JOIN", name }));
      clientConn.on("data", (data) => {
        if (data.type === "JOINED") {
          document.getElementById("remote-login-view").classList.add("hidden");
          document.getElementById("remote-pad-view").classList.remove("hidden");
          document.getElementById("remote-badge").textContent = `P${data.slot} : ${data.name}`;
          playVoice("yahho", true);
        } else if (data.type === "ITEM_STATE") {
          document.getElementById("remote-item-label").textContent = data.itemName || "未装備";
        } else if (data.type === "ATTACKED") {
          document.getElementById("remote-alert").textContent = `⚠️ ${data.item.name} 攻撃を受けた！`;
        }
      });
    });
  });

  const remoteTouch = document.getElementById("remote-touch-area");
  remoteTouch.addEventListener("pointerdown", (e) => { remotePadActive = true; moveRemotePad(e); });
  window.addEventListener("pointermove", (e) => { if (remotePadActive) moveRemotePad(e); });
  window.addEventListener("pointerup", () => {
    if (!remotePadActive) return;
    remotePadActive = false;
    document.getElementById("remote-dot").style.transform = "translate(0px, 0px)";
    sendRemotePacket(0, 0);
  });
  function moveRemotePad(e) {
    const rect = remoteTouch.getBoundingClientRect();
    const rx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.4)));
    const ry = Math.max(-1, Math.min(1, -(e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.4)));
    document.getElementById("remote-dot").style.transform = `translate(${rx * 44}px, ${-ry * 44}px)`;
    sendRemotePacket(rx, ry);
  }
  document.getElementById("btn-remote-boost").addEventListener("pointerdown", () => { isBoosting = true; sendRemotePacket(gyroX, gyroY); });
  document.getElementById("btn-remote-boost").addEventListener("pointerup", () => { isBoosting = false; sendRemotePacket(gyroX, gyroY); });
  document.getElementById("btn-remote-attack").addEventListener("click", () => {
    if (clientConn && clientConn.open) clientConn.send({ type: "ATTACK" });
  });

  // =========================================================================
  // 10. BUTTON EVENT WIRING
  // =========================================================================
  document.getElementById("btn-audio-toggle").addEventListener("click", () => {
    saveData.soundOn = !saveData.soundOn;
    persistSave();
    syncHomeUI();
    if (saveData.soundOn) playVoice("yahho", true);
    else AudioEngine.updateEngine(false, false, 0);
  });

  document.getElementById("btn-open-settings").addEventListener("click", () => {
    AudioEngine.sfxClick();
    document.getElementById("modal-settings").classList.remove("hidden");
  });

  document.getElementById("btn-settings-gyro").addEventListener("click", requestGyroPermission);
  document.getElementById("btn-settings-zero").addEventListener("click", calibrateGyroZero);
  document.getElementById("btn-remote-gyro").addEventListener("click", requestGyroPermission);
  document.getElementById("btn-remote-zero").addEventListener("click", calibrateGyroZero);
  document.getElementById("btn-hud-zero").addEventListener("click", calibrateGyroZero);
  document.getElementById("btn-hud-pause").addEventListener("click", returnToHangarHome);

  document.getElementById("btn-env-outdoor").addEventListener("click", () => {
    AudioEngine.sfxClick();
    saveData.environment = "outdoor";
    persistSave();
    applyWorldTheme();
  });
  document.getElementById("btn-env-indoor").addEventListener("click", () => {
    AudioEngine.sfxClick();
    saveData.environment = "indoor";
    persistSave();
    applyWorldTheme();
  });

  document.querySelectorAll("#diff-bar .diff-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      AudioEngine.sfxClick();
      saveData.diffIdx = Number(btn.dataset.diff);
      persistSave();
      syncHomeUI();
    });
  });

  document.getElementById("btn-sortie").addEventListener("click", () => launchSoloOrBody(false));

  document.getElementById("btn-dock-hangar").addEventListener("click", () => {
    AudioEngine.sfxClick();
    hangarOpen = true;
    renderHangarModal();
    document.getElementById("modal-hangar").classList.remove("hidden");
  });

  const openStagesFn = () => {
    AudioEngine.sfxClick();
    renderChaptersModal();
    document.getElementById("modal-stages").classList.remove("hidden");
  };
  document.getElementById("btn-dock-stages").addEventListener("click", openStagesFn);
  document.getElementById("btn-stage-picker").addEventListener("click", openStagesFn);

  document.getElementById("btn-dock-body").addEventListener("click", () => launchSoloOrBody(true));

  document.getElementById("btn-dock-multi").addEventListener("click", () => {
    AudioEngine.sfxClick();
    document.getElementById("online-entry-box").classList.remove("hidden");
    document.getElementById("online-room-box").classList.add("hidden");
    switchMpTab("online");
    document.getElementById("modal-multi").classList.remove("hidden");
  });

  const boostHoldBtn = document.getElementById("btn-boost-hold");
  boostHoldBtn.addEventListener("pointerdown", (e) => { e.stopPropagation(); isBoosting = true; });
  boostHoldBtn.addEventListener("pointerup", () => { isBoosting = false; });
  boostHoldBtn.addEventListener("pointercancel", () => { isBoosting = false; });
  boostHoldBtn.addEventListener("pointerleave", () => { isBoosting = false; });

  document.getElementById("btn-tactical-item").addEventListener("click", (e) => {
    e.stopPropagation();
    if (clientConn && clientConn.open) {
      clientConn.send({ type: "ATTACK" });
    } else {
      const me = players.find((p) => p.id === "me");
      if (me) fireTacticalItem(me);
    }
  });

  document.getElementById("btn-res-home").addEventListener("click", returnToHangarHome);
  document.getElementById("btn-res-retry").addEventListener("click", () => {
    AudioEngine.sfxClick();
    document.getElementById("modal-result").classList.add("modal-offscreen");
    if (gameMode === "BODY") launchSoloOrBody(true);
    else if ((gameMode === "ONLINE" || gameMode === "MONITOR") && hostRoster.length > 0) beginFlightSession(hostRoster);
    else launchSoloOrBody(false);
  });

  document.getElementById("btn-share-x")?.addEventListener("click", () => {
    AudioEngine.sfxClick();
    const s = document.getElementById("res-score").textContent;
    const d = document.getElementById("res-dist").textContent;
    const text = `GYRO DODGE 3D で スコア ${s}（飛行距離 ${d}）を達成！スマホの傾き＆4桁ルームで空中戦しよう！ #GYRODODGE`;
    const url = location.href.split("?")[0];
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  });

  document.getElementById("btn-share-copy")?.addEventListener("click", async () => {
    AudioEngine.sfxClick();
    const s = document.getElementById("res-score").textContent;
    const url = location.href.split("?")[0];
    const shareData = {
      title: "GYRO DODGE 3D",
      text: `GYRO DODGE 3D でスコア ${s} を記録！一緒に遊ぼう！`,
      url
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${url}`);
      showCallout("招待リンクをコピーしました！LINEやSNSに貼れます");
    } catch (e) {
      showCallout("URLを共有して友達と対戦しよう！");
    }
  });

  // =========================================================================
  // 11. MAIN 60FPS ANIMATION, AERODYNAMICS & COLLISION LOOP
  // =========================================================================
  function animateAircraftDetails(craft, throttleScale, t, dt) {
    if (!craft || !craft.animParts) return;
    const flicker = 0.92 + Math.sin(t * 48) * 0.1;
    craft.animParts.flames.forEach((f) => {
      f.scale.set(throttleScale * 0.95, throttleScale * 0.95, throttleScale * flicker);
    });
    craft.animParts.glowSprites.forEach((s) => {
      const gs = (0.95 + throttleScale * 0.45) * flicker;
      s.scale.set(gs, gs, 1);
    });
    craft.animParts.gimbals.forEach((g, idx) => {
      if (idx === 0) g.rotation.z += dt * 1.9 * throttleScale;
      else g.rotation.x -= dt * 2.4 * throttleScale;
    });
    const blinkOn = (Math.floor(t * 2.4) % 2 === 0);
    craft.animParts.strobes.forEach((st) => {
      st.material.opacity = blinkOn ? 0.95 : 0.18;
    });
  }

  let prevTime = performance.now();

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - prevTime) / 1000);
    prevTime = now;
    const t = now * 0.001;

    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const diff = DIFFICULTIES[saveData.diffIdx];
    const craftMeta = CRAFT_CATALOG.find((c) => c.id === saveData.craftId) || CRAFT_CATALOG[0];

    // Determine World Scroll Speed
    const activeBoost = isPlaying && isBoosting && boostEnergy > 2;
    const baseSpeed = isPlaying
      ? (diff.speed * ch.speedMult + (speedLevel - 1) * 5.2) * (activeBoost ? 1.48 : 1.0)
      : 16;

    // Scroll Realistic Worlds
    if (saveData.environment === "indoor") {
      corridorWorld.deckTex.offset.y -= baseSpeed * dt * 0.045;
      corridorWorld.getArches().forEach((a) => {
        a.position.z += baseSpeed * dt;
        if (a.position.z > 16) a.position.z -= corridorWorld.totalSpan;
      });
      corridorWorld.getSpinners().forEach((s, idx) => {
        s.rotation.z += dt * (idx % 2 === 0 ? 0.85 : -0.85);
      });
    } else {
      outdoorWorld.waterBump.offset.y -= baseSpeed * dt * 0.032;
      outdoorWorld.waterBump.offset.x = Math.sin(t * 0.35) * 0.08;
      outdoorWorld.props.forEach((chunk) => {
        chunk.position.z += baseSpeed * dt;
        if (chunk.position.z > 24) chunk.position.z -= outdoorWorld.totalSpan;
      });
      outdoorWorld.clouds.forEach((cl) => {
        cl.position.z += baseSpeed * 0.55 * dt;
        if (cl.position.z > 22) cl.position.z -= 18 * 16;
      });
    }

    // Animate Atmospheric Speed Dust
    const spArr = speedDust.geometry.attributes.position.array;
    for (let i = 0; i < speedParticlesCount; i++) {
      spArr[i * 3 + 2] += baseSpeed * (activeBoost ? 1.9 : 1.25) * dt;
      if (spArr[i * 3 + 2] > 14) {
        spArr[i * 3]     = (Math.random() - 0.5) * 28;
        spArr[i * 3 + 1] = (Math.random() - 0.5) * 18;
        spArr[i * 3 + 2] = -135 - Math.random() * 20;
      }
    }
    speedDust.geometry.attributes.position.needsUpdate = true;
    spMat.size = activeBoost ? 0.38 : 0.22;

    // Update 3D Spark Bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.age += dt;
      if (b.age >= b.maxAge) {
        scene.remove(b.pts);
        b.geo.dispose();
        b.mat.dispose();
        bursts.splice(i, 1);
        continue;
      }
      const arr = b.geo.attributes.position.array;
      for (let k = 0; k < b.velocities.length / 3; k++) {
        arr[k * 3]     += b.velocities[k * 3] * dt;
        arr[k * 3 + 1] += b.velocities[k * 3 + 1] * dt;
        arr[k * 3 + 2] += (b.velocities[k * 3 + 2] + baseSpeed * 0.45) * dt;
      }
      b.geo.attributes.position.needsUpdate = true;
      b.mat.opacity = 1.0 - b.age / b.maxAge;
    }

    if (!isPlaying) {
      // =====================================================================
      // SHOWCASE HANGAR / SCENIC FLYBY CAMERA
      // =====================================================================
      if (!showcaseDragging) {
        orbitYaw += dt * 0.28;
      }
      showcaseAnchor.position.set(
        Math.sin(t * 1.1) * 0.22,
        (hangarOpen ? 1.55 : 1.05) + Math.sin(t * 2.1) * 0.12,
        2.0
      );
      showcaseAnchor.rotation.z = Math.cos(t * 1.1) * 0.08;
      animateAircraftDetails(showcaseCraft, 1.05, t, dt);

      const radius = hangarOpen ? 5.2 : 6.4;
      const targetCamX = showcaseAnchor.position.x + Math.sin(orbitYaw) * Math.cos(orbitPitch) * radius;
      const targetCamY = showcaseAnchor.position.y + Math.sin(orbitPitch) * radius + (hangarOpen ? 0.55 : 0.9);
      const targetCamZ = showcaseAnchor.position.z + Math.cos(orbitYaw) * Math.cos(orbitPitch) * radius;

      camera.position.x += (targetCamX - camera.position.x) * Math.min(1, dt * 6);
      camera.position.y += (targetCamY - camera.position.y) * Math.min(1, dt * 6);
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 6);
      camera.fov += (56 - camera.fov) * Math.min(1, dt * 6);
      camera.updateProjectionMatrix();
      camera.lookAt(showcaseAnchor.position.x, showcaseAnchor.position.y - (hangarOpen ? 0.55 : 0.05), showcaseAnchor.position.z);

      burnerLight.position.set(showcaseAnchor.position.x, showcaseAnchor.position.y, showcaseAnchor.position.z + 2.2);
      renderer.render(scene, camera);
      return;
    }

    // =======================================================================
    // ACTIVE FLIGHT TELEMETRY, PHYSICS & COLLISIONS
    // =======================================================================
    if (gameMode === "BODY") pollBodyCamera();

    // Combine Keyboard, Virtual Stick, Canvas Drag, Gyro, or Body Input
    let kx = 0, ky = 0;
    if (keys["arrowleft"] || keys["a"]) kx -= 1;
    if (keys["arrowright"] || keys["d"]) kx += 1;
    if (keys["arrowup"] || keys["w"]) ky += 1;
    if (keys["arrowdown"] || keys["s"]) ky -= 1;

    let combinedX = 0, combinedY = 0;
    if (gameMode === "BODY") {
      combinedX = bodyX;
      combinedY = bodyY;
    } else if (kx !== 0 || ky !== 0) {
      combinedX = kx;
      combinedY = ky;
    } else if (Math.hypot(stickX, stickY) > 0.04) {
      combinedX = stickX;
      combinedY = stickY;
    } else if (Math.hypot(dragSteerX, dragSteerY) > 0.04) {
      combinedX = dragSteerX;
      combinedY = dragSteerY;
    } else {
      combinedX = gyroX;
      combinedY = gyroY;
    }

    // Boost Capacitor Drain & Recharge
    if (isBoosting && boostEnergy > 0) {
      boostEnergy = Math.max(0, boostEnergy - 30 * dt);
    } else {
      boostEnergy = Math.min(100, boostEnergy + 11 * dt);
    }
    document.getElementById("screen-fx").classList.toggle("boost-active", activeBoost);
    document.getElementById("btn-boost-hold").classList.toggle("active", activeBoost);

    const arcOffset = 276 * (1 - boostEnergy / 100);
    document.getElementById("boost-meter-arc").style.strokeDashoffset = String(arcOffset);
    document.getElementById("boost-pct-label").textContent = `${Math.round(boostEnergy)}%`;

    AudioEngine.updateEngine(true, activeBoost, (speedLevel - 1) * 0.25);

    const agilityFactor = 0.85 + (craftMeta.agilityStat / 100) * 0.35;

    players.forEach((p) => {
      if (!p.alive) return;

      if (p.id === "me") {
        p.ix = combinedX;
        p.iy = combinedY;
        p.boost = activeBoost;
        sendRemotePacket(p.ix, p.iy);
      } else if (p.isBot) {
        let tx = Math.sin(t * 1.2 + p.slotIdx * 1.9) * 3.2;
        let ty = 0.8 + Math.cos(t * 1.5 + p.slotIdx * 2.1) * 2.1;
        const threat = obstacles.find((o) => o.z > -48 && o.z < 2);
        if (threat) {
          tx = threat.x > 0 ? -4.2 : 4.2;
          ty = threat.y > 0.8 ? -1.8 : 3.2;
        }
        p.ix = Math.max(-1, Math.min(1, (tx - p.x) * 0.68));
        p.iy = Math.max(-1, Math.min(1, (ty - p.y) * 0.68));
        p.boost = Math.random() < 0.03;
        if (p.heldItem && Math.random() < 0.02) fireTacticalItem(p);
      }

      const rev = now < p.revUntil ? -1 : 1;
      const gust = now < p.gustUntil ? p.gustDir * 5.2 : 0;
      const targetVx = p.ix * rev * 14.5 * agilityFactor + gust;
      const targetVy = p.iy * rev * 12.5 * agilityFactor;

      p.vx += (targetVx - p.vx) * Math.min(1, dt * 11);
      p.vy += (targetVy - p.vy) * Math.min(1, dt * 11);
      p.x = Math.max(-BOUND_X, Math.min(BOUND_X, p.x + p.vx * dt));
      p.y = Math.max(BOUND_Y_MIN, Math.min(BOUND_Y_MAX, p.y + p.vy * dt));

      p.craft.root.position.set(p.x, p.y, 2.0);
      // Realistic aerodynamic roll, pitch & slight yaw banking
      p.craft.root.rotation.z = -p.vx * 0.052;
      p.craft.root.rotation.x = p.vy * 0.036;
      p.craft.root.rotation.y = -p.vx * 0.018;

      // Invulnerability blink after shield hit
      if (now < p.invulnUntil) {
        p.craft.root.visible = Math.floor(now / 65) % 2 === 0;
      } else {
        p.craft.root.visible = true;
      }

      animateAircraftDetails(p.craft, p.boost ? 1.65 : 1.0, t, dt);

      const pSpd = baseSpeed * (p.boost ? 1.15 : 1.0);
      p.distance += pSpd * dt * 0.42;
      p.score += pSpd * dt * (p.boost ? 3.4 : 2.1) * diff.mult;
    });

    const me = players.find((p) => p.id === "me" && p.alive) || players.find((p) => p.alive);
    if (me) {
      document.getElementById("blind-overlay").classList.toggle("active", now < me.smokeUntil);

      // Smooth Dynamic Chase Camera with subtle roll & shake
      cameraShake = Math.max(0, cameraShake - dt * 2.8);
      const shakeX = (Math.random() - 0.5) * cameraShake * 0.55;
      const shakeY = (Math.random() - 0.5) * cameraShake * 0.55;

      const camTargetX = me.x * 0.72 + shakeX;
      const camTargetY = me.y * 0.68 + 1.75 + shakeY;
      const camTargetZ = activeBoost ? 9.8 : 8.8;

      camera.position.x += (camTargetX - camera.position.x) * Math.min(1, dt * 8.5);
      camera.position.y += (camTargetY - camera.position.y) * Math.min(1, dt * 8.5);
      camera.position.z += (camTargetZ - camera.position.z) * Math.min(1, dt * 6.0);

      const targetFov = activeBoost ? 71 : 60;
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 7.0);
      camera.updateProjectionMatrix();

      camera.lookAt(me.x * 0.45, me.y * 0.45 + 0.35, -22);
      camera.rotation.z += (-me.vx * 0.008 - camera.rotation.z) * 0.25;

      burnerLight.position.set(me.x, me.y, 4.0);
      burnerLight.intensity = activeBoost ? 2.6 : 1.2;

      score = me.score;
      distance = me.distance;
    }

    // Speed Level Escalation & 500m Stage Milestone
    const nextLvl = Math.floor(distance / 140) + 1;
    if (nextLvl > speedLevel) {
      speedLevel = nextLvl;
      showHudEvent(`SPEED LEVEL ${speedLevel}`, "超音速域へ加速！");
      playVoice("speedup", true);
    }
    if (!clearedStage && distance >= 500) {
      clearedStage = true;
      showHudEvent("500m STAGE CLEAR!", "ENDLESS OVERDRIVE 突入");
      playVoice("clear", true);
    }

    // Event Banner Fade
    if (eventBannerTimer > 0) {
      eventBannerTimer -= dt;
      if (eventBannerTimer <= 0) {
        document.getElementById("hud-event-text").textContent = "";
        document.getElementById("hud-combo-pill").classList.add("hidden");
      }
    }

    // Spawn & Update Obstacles
    obsSpawnTimer -= dt;
    if (obsSpawnTimer <= 0) {
      spawnWorldObstacle();
      obsSpawnTimer = Math.max(0.32, diff.spawn - (speedLevel - 1) * 0.055);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.z += baseSpeed * dt;
      o.mesh.position.z = o.z;
      o.angleZ += o.rotSpeedZ * dt;
      if (o.type === "BARRIER") {
        o.mesh.rotation.z = o.angleZ;
      } else {
        o.mesh.rotation.x += o.spinX * dt;
        o.mesh.rotation.y += o.spinY * dt;
      }

      if (Math.abs(o.z - 2.0) < 1.25) {
        players.forEach((p) => {
          if (!p.alive) return;

          // Precise distance check (Line-segment distance for rotated BARRIER, sphere for others)
          let dist = 999;
          if (o.hitShape === "BAR") {
            const dx = p.x - o.x;
            const dy = p.y - o.y;
            const ux = Math.cos(o.angleZ);
            const uy = Math.sin(o.angleZ);
            const proj = Math.max(-o.halfLen, Math.min(o.halfLen, dx * ux + dy * uy));
            const cx = o.x + ux * proj;
            const cy = o.y + uy * proj;
            dist = Math.hypot(p.x - cx, p.y - cy);
          } else {
            dist = Math.hypot(p.x - o.x, p.y - o.y);
          }

          const hitRadius = o.hitShape === "BAR" ? o.thickness : o.radius;
          if (dist < hitRadius) {
            if (now >= p.invulnUntil) {
              p.shields -= 1;
              p.invulnUntil = now + 1350;
              spawnBurst3D(p.x, p.y, 2.0, 0xef4444, 26);

              if (p.id === "me") {
                AudioEngine.sfxHit();
                cameraShake = 1.0;
                updateShieldHUD(p);
                const fx = document.getElementById("screen-fx");
                fx.classList.add("damage-flash");
                setTimeout(() => fx.classList.remove("damage-flash"), 260);
                if (p.shields > 0) {
                  showHudEvent("SHIELD HIT!", `残りシールド ${p.shields}`);
                  playVoice("abuna", true);
                }
              }

              if (p.shields <= 0) {
                p.alive = false;
                p.craft.root.visible = false;
                spawnBurst3D(p.x, p.y, 2.0, 0xf97316, 42);
              }
            }
          } else if (dist < hitRadius + 1.55 && !o.passed.has(p.id)) {
            o.passed.add(p.id);
            const nmBonus = Math.round(150 * diff.mult);
            p.score += nmBonus;
            if (p.id === "me") {
              nearMisses++;
              boostEnergy = Math.min(100, boostEnergy + 16);
              AudioEngine.sfxNearMiss();
              showHudEvent("NEAR MISS!", `+${nmBonus} PTS // BOOST +16%`);
              if (nearMisses % 3 === 0) playVoice("good", false);
              else playVoice("abuna", false);
            }
          }
        });
      }

      if (o.z > 15) {
        scene.remove(o.mesh);
        obstacles.splice(i, 1);
      }
    }

    // Spawn & Update Collectible Energy Rings
    ringSpawnTimer -= dt;
    if (ringSpawnTimer <= 0) {
      spawnWorldRing();
      ringSpawnTimer = 1.65;
    }

    for (let i = energyRings.length - 1; i >= 0; i--) {
      const r = energyRings[i];
      r.z += baseSpeed * dt;
      r.mesh.position.z = r.z;
      r.innerRing.rotation.z += dt * 2.8;

      if (!r.taken && Math.abs(r.z - 2.0) < 1.35) {
        for (const p of players) {
          if (!p.alive) continue;
          if (Math.hypot(p.x - r.x, p.y - r.y) < 1.95) {
            r.taken = true;
            r.mesh.visible = false;
            p.score += Math.round(250 * diff.mult);
            spawnBurst3D(r.x, r.y, 2.0, 0xfbbf24, 18);

            if (p.id === "me") {
              ringsCollected++;
              boostEnergy = Math.min(100, boostEnergy + 24);
              AudioEngine.sfxRing();
              if (ringsCollected % 5 === 0 && p.shields < p.maxShields) {
                p.shields++;
                updateShieldHUD(p);
                showHudEvent("SHIELD REPAIRED!", "リング5個ボーナス");
              }
              if (ringsCollected % 4 === 0) playVoice("good", false);
            }
            break;
          }
        }
      }

      if (r.z > 14) {
        scene.remove(r.mesh);
        energyRings.splice(i, 1);
      }
    }

    // Spawn & Update Tactical Supply Pods
    podSpawnTimer -= dt;
    if (podSpawnTimer <= 0) {
      spawnWorldSupplyPod();
      podSpawnTimer = 4.6;
    }

    for (let i = supplyPods.length - 1; i >= 0; i--) {
      const pod = supplyPods[i];
      pod.z += baseSpeed * dt;
      pod.mesh.position.z = pod.z;
      pod.ringA.rotation.y += dt * 2.6;
      pod.ringB.rotation.z -= dt * 2.2;

      if (!pod.taken && Math.abs(pod.z - 2.0) < 1.4) {
        for (const p of players) {
          if (!p.alive) continue;
          if (Math.hypot(p.x - pod.x, p.y - pod.y) < 1.9) {
            pod.taken = true;
            pod.mesh.visible = false;
            const picked = ATTACK_ITEMS[Math.floor(Math.random() * ATTACK_ITEMS.length)];
            p.heldItem = picked;
            spawnBurst3D(pod.x, pod.y, 2.0, 0x38bdf8, 20);

            if (p.id === "me") {
              AudioEngine.sfxRing();
              updateTacticalButton(p);
              showCallout(`ウェポン獲得: 「${picked.name}」`);
            }
            if (p.conn && p.conn.open) {
              p.conn.send({ type: "ITEM_STATE", itemName: picked.name });
            }
            break;
          }
        }
      }

      if (pod.z > 14) {
        scene.remove(pod.mesh);
        supplyPods.splice(i, 1);
      }
    }

    // Update Flight Telemetry Readouts
    const aliveList = players.filter((p) => p.alive);
    document.getElementById("hud-score").textContent = Math.floor(score).toLocaleString();
    document.getElementById("hud-dist").textContent = `${Math.floor(distance)}m`;
    document.getElementById("hud-rings").textContent = String(ringsCollected);
    document.getElementById("hud-alive").textContent = `${aliveList.length}/${players.length}`;
    document.getElementById("hud-stage-fill").style.width = `${Math.min(100, (distance / 500) * 100)}%`;

    const kmh = Math.round(baseSpeed * 38);
    const mach = (kmh / 1225).toFixed(1);
    document.getElementById("hud-speed-kmh").textContent = `MACH ${mach} // ${kmh.toLocaleString()} km/h`;

    // Check Mission End Conditions
    if (gameMode === "SOLO" || gameMode === "BODY") {
      const myEntity = players.find((p) => p.id === "me");
      if (myEntity && !myEntity.alive) finishFlightSession(clearedStage);
    } else {
      if (players.length > 1 && aliveList.length <= 1) {
        const myEntity = players.find((p) => p.id === "me");
        finishFlightSession(aliveList.length === 1 && (!myEntity || myEntity.alive));
      } else if (aliveList.length === 0) {
        finishFlightSession(false);
      }
    }

    renderer.render(scene, camera);
  }

  // =========================================================================
  // 12. RESIZE, URL ROOM PARAM & INITIAL BOOT
  // =========================================================================
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  applyWorldTheme();

  // Daily Login Bonus to boost repeat daily visits
  const todayStr = new Date().toISOString().slice(0, 10);
  if (saveData.lastLoginDate !== todayStr) {
    saveData.lastLoginDate = todayStr;
    saveData.credits += 300;
    persistSave();
    setTimeout(() => showCallout("デイリーログインボーナス +300 CR 獲得！"), 700);
  }

  syncHomeUI();

  const urlRoom = new URLSearchParams(location.search).get("room");
  if (urlRoom) {
    document.getElementById("remote-code-input").value = urlRoom;
    switchMpTab("remote");
    document.getElementById("modal-multi").classList.remove("hidden");
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  requestAnimationFrame(tick);
})();
