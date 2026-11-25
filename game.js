// ============================================================================
// GYRO DODGE 3D — Main Flight Engine, Safe-Corridor Waves, JA/EN & Controls
// ============================================================================
(() => {
  const {
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
  } = window.AeroModels;

  // =========================================================================
  // 1. BILINGUAL DICTIONARY (JAPANESE & ENGLISH)
  // =========================================================================
  const I18N = {
    ja: {
      smokeTitle: "スモーク視界妨害中",
      smokeSub: "計器と動きで障害物を回避してください",
      camBadge: "カメラ操縦",
      bestRecord: "最高記録",
      envOutdoor: "空域",
      envIndoor: "回廊",
      changeBtn: "選択 ▾",
      diff0: "かんたん",
      diff1: "ふつう",
      diff2: "むずかしい",
      diff3: "げきむず",
      sortieBtn: "出撃スタート",
      goalPrefix: "目標 ",
      dockHangar: "格納庫",
      dockStages: "ステージ",
      dockBody: "体操作",
      dockMulti: "通信対戦",
      shieldLabel: "シールド",
      resetGyroBtn: "水平リセット",
      allowGyroBtn: "ジャイロ許可",
      abortBtn: "帰還",
      noItem: "なし",
      hangarTitle: "格納庫・機体選択",
      hangarSub: "3種のリアル機体と塗装を切り替え",
      airframeLabel: "機体モデル",
      paintLabel: "機体カラー",
      confirmCraftBtn: "この機体で決定",
      stagesTitle: "ステージ選択（全12章）",
      stagesSub: "空域または巨大建築回廊を選んで出撃",
      launchSky: "空域で出撃",
      launchCorridor: "回廊で出撃",
      multiTitle: "通信対戦・モニター・リモコン",
      multiSub: "4桁コードで友達やBOTとリアルタイム対戦",
      tabOnline: "オンライン対戦",
      tabMonitor: "モニター画面",
      tabRemote: "スマホリモコン",
      createRoomBtn: "4桁ルームを作成する",
      joinBtn: "参加",
      startBattleBtn: "対戦スタート",
      startMonitorBtn: "モニター対戦を開始",
      connectBtn: "接続する",
      settingsTitle: "設定・センサー調整",
      settingsSub: "言語切替・ジャイロ調整・収録ボイスの試聴",
      langSettingLabel: "表示言語 / Language",
      gyroSettingLabel: "ジャイロセンサー",
      gyroSettingSub: "傾き権限の許可と水平角度のリセット",
      voiceListLabel: "収録ボイス試聴（7種）",
      backHomeBtn: "ホームへ",
      retryBtn: "もう一度出撃",
      shareXBtn: "Xでスコア投稿",
      shareUrlBtn: "招待URLをコピー",
      stageClearTitle: "目標達成・ステージクリア！",
      gameOverTitle: "機体大破・フライト終了",
      ringBonusMsg: "リング通過！",
      nearMissMsg: "ニアミス回避！",
      shieldHitMsg: "シールド被弾！",
      shieldRepairMsg: "シールド修復！",
      gyroResetToast: "ジャイロの水平基準をリセットしました",
      dailyToast: "デイリーボーナス +300 CR 獲得！",
      copiedToast: "招待URLをコピーしました",
      camFallbackToast: "カメラ未検出のため通常操作で出撃します",
      waitPlayers: "参加者を待っています（BOT追加ですぐ開始可能）",
      enter4Digits: "4桁のコードを入力してください",
      connecting: "接続中...",
      waitingSlot: "待機中"
    },
    en: {
      smokeTitle: "SMOKE SCREEN ACTIVE",
      smokeSub: "Keep dodging using instruments and motion",
      camBadge: "MOTION CAM",
      bestRecord: "BEST RECORD",
      envOutdoor: "OPEN SKY",
      envIndoor: "CORRIDOR",
      changeBtn: "STAGE ▾",
      diff0: "EASY",
      diff1: "NORMAL",
      diff2: "HARD",
      diff3: "EXTREME",
      sortieBtn: "LAUNCH",
      goalPrefix: "GOAL ",
      dockHangar: "HANGAR",
      dockStages: "STAGES",
      dockBody: "CAMERA",
      dockMulti: "MULTI",
      shieldLabel: "SHIELD",
      resetGyroBtn: "RECENTER",
      allowGyroBtn: "ALLOW GYRO",
      abortBtn: "EXIT",
      noItem: "NONE",
      hangarTitle: "HANGAR & AIRCRAFT",
      hangarSub: "Select 3D airframe and metallic livery",
      airframeLabel: "AIRCRAFT MODEL",
      paintLabel: "PAINT LIVERY",
      confirmCraftBtn: "SELECT AIRCRAFT",
      stagesTitle: "SELECT STAGE (12 CHAPTERS)",
      stagesSub: "Launch in Open Sky or Megastructure Corridor",
      launchSky: "OPEN SKY",
      launchCorridor: "CORRIDOR",
      multiTitle: "MULTIPLAYER & REMOTE PAD",
      multiSub: "Real-time battle with 4-digit room code",
      tabOnline: "ONLINE",
      tabMonitor: "MONITOR",
      tabRemote: "PHONE PAD",
      createRoomBtn: "CREATE 4-DIGIT ROOM",
      joinBtn: "JOIN",
      startBattleBtn: "START BATTLE",
      startMonitorBtn: "START MONITOR MATCH",
      connectBtn: "CONNECT",
      settingsTitle: "SETTINGS & SENSORS",
      settingsSub: "Language, gyro calibration & voice check",
      langSettingLabel: "Language / 表示言語",
      gyroSettingLabel: "Gyro Sensor",
      gyroSettingSub: "Request permission and calibrate neutral tilt",
      voiceListLabel: "VOICE SAMPLES (7 CLIPS)",
      backHomeBtn: "HOME",
      retryBtn: "PLAY AGAIN",
      shareXBtn: "SHARE ON X",
      shareUrlBtn: "COPY LINK",
      stageClearTitle: "TARGET REACHED - STAGE CLEAR!",
      gameOverTitle: "AIRCRAFT DESTROYED",
      ringBonusMsg: "RING BONUS!",
      nearMissMsg: "NEAR MISS!",
      shieldHitMsg: "SHIELD HIT!",
      shieldRepairMsg: "SHIELD REPAIRED!",
      gyroResetToast: "Gyroscope neutral angle calibrated",
      dailyToast: "Daily Bonus +300 CR claimed!",
      copiedToast: "Invite link copied to clipboard",
      camFallbackToast: "Camera unavailable — launching with standard controls",
      waitPlayers: "Waiting for players (or add BOTs to start)",
      enter4Digits: "Please enter a 4-digit room code",
      connecting: "Connecting...",
      waitingSlot: "OPEN"
    }
  };

  // =========================================================================
  // 2. PERSISTENT SAVE STATE
  // =========================================================================
  const SAVE_KEY = "gyro_dodge_aero_save_v2";
  const defaultLang = (navigator.language || "ja").toLowerCase().startsWith("ja") ? "ja" : "en";
  const saveData = {
    lang: defaultLang,
    credits: 2500,
    xp: 0,
    bestScore: 0,
    bestDist: 0,
    craftId: "falcon",
    liveryIdx: 0,
    chapterIdx: 0,
    environment: "outdoor",
    diffIdx: 1,
    soundOn: true,
    lastLoginDate: ""
  };

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) Object.assign(saveData, JSON.parse(raw));
  } catch (e) {}

  function persistSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); } catch (e) {}
  }

  function tr(key) {
    const dict = I18N[saveData.lang] || I18N.ja;
    return dict[key] !== undefined ? dict[key] : key;
  }

  // =========================================================================
  // 3. DIFFICULTY & DISTANCE CONFIGURATION (25,000m / 15,000m / 8,000m / 5,000m)
  // =========================================================================
  const DIFFICULTIES = [
    {
      id: "EASY",
      goalDist: 25000,
      speed: 35,
      maxExtraSpeed: 16,
      spawnBase: 0.96,
      minSpawn: 0.56,
      shields: 5,
      minObs: 2,
      maxObs: 3,
      mult: 0.9
    },
    {
      id: "NORMAL",
      goalDist: 15000,
      speed: 42,
      maxExtraSpeed: 21,
      spawnBase: 0.78,
      minSpawn: 0.44,
      shields: 4,
      minObs: 2,
      maxObs: 4,
      mult: 1.0
    },
    {
      id: "HARD",
      goalDist: 8000,
      speed: 50,
      maxExtraSpeed: 25,
      spawnBase: 0.64,
      minSpawn: 0.36,
      shields: 3,
      minObs: 3,
      maxObs: 4,
      mult: 1.5
    },
    {
      id: "EXTREME",
      goalDist: 5000,
      speed: 58,
      maxExtraSpeed: 30,
      spawnBase: 0.52,
      minSpawn: 0.30,
      shields: 2,
      minObs: 3,
      maxObs: 5,
      mult: 2.2
    }
  ];

  const ATTACK_ITEMS = [
    { id: "EMP",     ja: "EMP衝撃波",   en: "EMP BLAST",    duration: 3.5 },
    { id: "REVERSE", ja: "反転ジャミング", en: "REVERSE JAM", duration: 3.5 },
    { id: "SMOKE",   ja: "チャフ煙幕",   en: "SMOKE SCREEN", duration: 3.2 },
    { id: "GUST",    ja: "乱気流ブラスト", en: "WIND GUST",   duration: 3.4 }
  ];

  function getItemName(item) {
    if (!item) return tr("noItem");
    return saveData.lang === "en" ? (item.en || item.name) : (item.ja || item.name);
  }

  // =========================================================================
  // 4. WEBAUDIO SFX + 7 RECORDED NAVIGATOR VOICES
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
      const targetFreq = (boosting ? 116 : 74) + Math.min(36, speedRatio * 28);
      const targetCut = boosting ? 520 : 220;
      const targetVol = boosting ? 0.052 : 0.025;
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

    sfxRing(combo = 1) {
      const pitchBoost = Math.min(1.5, 1 + (combo - 1) * 0.1);
      this.playTone(587.3 * pitchBoost, 1174.6 * pitchBoost, 0.18, "triangle", 0.14);
      setTimeout(() => this.playTone(880 * pitchBoost, 1760 * pitchBoost, 0.22, "sine", 0.10), 50);
    },

    sfxNearMiss() {
      this.playTone(420, 145, 0.2, "sawtooth", 0.08);
    },

    sfxHit() {
      this.playTone(150, 38, 0.35, "sawtooth", 0.22);
    },

    sfxEmp() {
      this.playTone(220, 960, 0.34, "sine", 0.16);
    },

    sfxClick() {
      this.playTone(680, 500, 0.045, "triangle", 0.045);
    }
  };

  function showCallout(text) {
    const wrap = document.getElementById("voice-banner-container");
    if (!wrap) return;
    wrap.innerHTML = "";
    const el = document.createElement("div");
    el.className = "voice-callout";
    el.innerHTML = `<span class="callout-dot"></span><span class="callout-text">${text}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1850);
  }

  function playVoice(key, force = false) {
    const v = window.VOICE_DATA && window.VOICE_DATA[key];
    if (!v) return;
    const now = performance.now();
    if (!force && now - AudioEngine.lastVoiceTime < 950) return;
    AudioEngine.lastVoiceTime = now;
    if (saveData.lang === "ja") showCallout(v.quote);
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
  // 5. THREE.JS REALISTIC PBR SCENE
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

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.15, 380);
  camera.position.set(0, 2.2, 9.5);

  const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.95);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.55);
  sunLight.position.set(18, 28, 16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 2;
  sunLight.shadow.camera.far = 95;
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

  const skyDome = createAtmosphericSkyDome();
  scene.add(skyDome.mesh);

  const outdoorWorld = createOutdoorWorld();
  scene.add(outdoorWorld.group);

  const corridorWorld = createCorridorWorld();
  scene.add(corridorWorld.group);

  // Showcase Aircraft (Angled cleanly at front-3/4 view!)
  const showcaseAnchor = new THREE.Group();
  showcaseAnchor.position.set(0, 1.15, 2.0);
  scene.add(showcaseAnchor);
  let showcaseCraft = null;

  function rebuildShowcaseCraft() {
    if (showcaseCraft) showcaseAnchor.remove(showcaseCraft.root);
    const livery = LIVERY_CATALOG[saveData.liveryIdx] || LIVERY_CATALOG[0];
    showcaseCraft = createAircraft(saveData.craftId, livery);
    showcaseAnchor.add(showcaseCraft.root);
  }
  rebuildShowcaseCraft();

  // Atmospheric Speed Streaks
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
    size: 0.22,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const speedDust = new THREE.Points(spGeo, spMat);
  scene.add(speedDust);

  // 3D Spark Bursts
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

  function applyWorldTheme() {
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const isIndoor = saveData.environment === "indoor";

    outdoorWorld.group.visible = !isIndoor;
    skyDome.mesh.visible = !isIndoor;
    corridorWorld.group.visible = isIndoor;

    if (isIndoor) {
      scene.background = new THREE.Color(ch.corridorBg);
      scene.fog = new THREE.FogExp2(ch.corridorBg, 0.0105);
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
      scene.fog = new THREE.FogExp2(ch.fogHex, 0.0058);

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

    syncAllUI();
  }

  // =========================================================================
  // 6. ANTI-CORNER-CAMPING + 100% PASSABLE SAFE-CORRIDOR WAVE ENGINE
  // =========================================================================
  const BOUND_X = 6.4;
  const BOUND_Y_MIN = -3.3;
  const BOUND_Y_MAX = 4.5;
  const PLAYER_Z = 2.0;

  let gameMode = "SOLO";
  let isPlaying = false;
  let hangarOpen = false;

  let score = 0;
  let distance = 0;
  let ringsCollected = 0;
  let ringCombo = 0;
  let lastRingAt = 0;
  let nearMisses = 0;
  let speedTierAnnounced = 1;
  let clearedStage = false;
  let boostEnergy = 100;
  let cameraShake = 0;
  let eventBannerTimer = 0;
  let waveCounter = 0;

  let players = [];
  let obstacles = [];
  let energyRings = [];
  let supplyPods = [];

  let obsSpawnTimer = 0;
  let podSpawnTimer = 4.0;

  // Start showcase camera at sleek front-3/4 angle so nose & canopy shine!
  let orbitYaw = 2.45;
  let orbitPitch = 0.18;
  let showcaseDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // Steering Inputs
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
    const sy = slotIdx === 0 ? 0.6 : 0.6 + Math.sin(angle) * 1.4;
    craft.root.position.set(sx, sy, PLAYER_Z);
    scene.add(craft.root);

    const diff = DIFFICULTIES[saveData.diffIdx];
    return {
      id, name, slotIdx, isBot, conn, craft,
      x: sx, y: sy,
      vx: 0, vy: 0,
      ix: 0, iy: 0,
      anchorX: sx, anchorY: sy, campTime: 0,
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

  // Exact signed clearance (> 0 = safe, < 0 = collision) for all 9 3D obstacle shapes!
  function getSignedClearance(obs, px, py, atX, atY, atAngleZ) {
    const dx = px - atX;
    const dy = py - atY;

    if (obs.hitShape === "BAR") {
      const ux = Math.cos(atAngleZ);
      const uy = Math.sin(atAngleZ);
      const proj = Math.max(-obs.halfLen, Math.min(obs.halfLen, dx * ux + dy * uy));
      const d = Math.hypot(dx - ux * proj, dy - uy * proj);
      return d - obs.thickness;
    }

    if (obs.hitShape === "CROSS") {
      let minD = 999;
      for (let arm = 0; arm < 2; arm++) {
        const a = atAngleZ + arm * (Math.PI * 0.5);
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        const proj = Math.max(-obs.halfLen, Math.min(obs.halfLen, dx * ux + dy * uy));
        const d = Math.hypot(dx - ux * proj, dy - uy * proj);
        if (d < minD) minD = d;
      }
      return minD - obs.thickness;
    }

    if (obs.hitShape === "BOX") {
      const qx = Math.max(0, Math.abs(dx) - obs.halfW);
      const qy = Math.max(0, Math.abs(dy) - obs.halfH);
      return Math.hypot(qx, qy);
    }

    if (obs.hitShape === "RING_TRAP") {
      const r = Math.hypot(dx, dy);
      if (r < obs.innerSafeR) return obs.innerSafeR - r;
      if (r > obs.outerHitR) return r - obs.outerHitR;
      return -1.0;
    }

    // Default SPHERE
    return Math.hypot(dx, dy) - (obs.radius || 1.45);
  }

  function pulseScoreReadout() {
    const el = document.getElementById("hud-score");
    if (!el) return;
    el.classList.add("pop");
    setTimeout(() => el.classList.remove("pop"), 150);
  }

  // Coordinated Wave Generator:
  // 1. Guarantees a clean 100%-passable Safe Corridor (safeX, safeY) away from current spot.
  // 2. Directly snipes current player spot (even at extreme edges/corners!) so standing still ALWAYS hits.
  // 3. Fills remaining lanes & corners with diverse 3D shapes while preserving (safeX, safeY) at arrival!
  function spawnObstacleWave(currentSpeed) {
    waveCounter++;
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const diff = DIFFICULTIES[saveData.diffIdx];
    const zSpawn = -142;
    const tArrival = (PLAYER_Z - zSpawn) / Math.max(20, currentSpeed);

    const focus = players.find((p) => p.id === "me" && p.alive) || players.find((p) => p.alive);
    const curX = focus ? focus.x : 0;
    const curY = focus ? focus.y : 0.6;

    // Step 1: Pick Guaranteed Passable Escape Gate (safeX, safeY) away from (curX, curY)
    let safeX = 0, safeY = 0.6;
    for (let attempt = 0; attempt < 24; attempt++) {
      const cx = (Math.random() - 0.5) * (BOUND_X - 1.1) * 2;
      const cy = (BOUND_Y_MIN + 0.95) + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN - 1.9);
      const dFromPlayer = Math.hypot(cx - curX, cy - curY);
      if (dFromPlayer >= 3.5 && dFromPlayer <= 8.2) {
        safeX = cx;
        safeY = cy;
        break;
      }
    }
    if (Math.hypot(safeX - curX, safeY - curY) < 3.2) {
      safeX = curX > 0 ? -3.4 : 3.4;
      safeY = curY > 0.6 ? -1.4 : 2.6;
    }

    const SAFE_MARGIN = 2.35; // Guarantees generous 4.7-unit wide passable opening!

    function tryPlaceSingleObstacle(type, ox, oy, allowMotion = true) {
      const built = createObstacle(type, ch);
      const angleZ = (type === "BARRIER" || type === "CROSS_BLADE") ? Math.random() * Math.PI : 0;
      let rotSpeedZ = 0;
      if (type === "CROSS_BLADE") rotSpeedZ = (Math.random() < 0.5 ? 1 : -1) * (1.05 + Math.random() * 0.7);
      else if (type === "BARRIER" && allowMotion && Math.random() < 0.55) {
        rotSpeedZ = (Math.random() < 0.5 ? 1 : -1) * (0.75 + Math.random() * 0.65);
      }

      let moveAmpX = 0, moveFreq = 0, movePhase = Math.random() * Math.PI * 2;
      if (allowMotion && (type === "DRONE" || type === "SHUTTER") && Math.random() < 0.65) {
        moveAmpX = 1.8 + Math.random() * 1.6;
        moveFreq = 1.6 + Math.random() * 0.9;
      }

      // Predict exact state when this obstacle reaches PLAYER_Z!
      const arrivalX = Math.max(-BOUND_X, Math.min(BOUND_X, ox + Math.sin(movePhase + moveFreq * tArrival) * moveAmpX));
      const arrivalY = oy;
      const arrivalAngle = angleZ + rotSpeedZ * tArrival;

      // Verify Safe Escape Gate is 100% clear at arrival!
      const clearanceAtSafe = getSignedClearance(built, safeX, safeY, arrivalX, arrivalY, arrivalAngle);
      if (clearanceAtSafe < SAFE_MARGIN) {
        return false;
      }

      built.mesh.position.set(ox, oy, zSpawn);
      built.mesh.rotation.z = angleZ;
      scene.add(built.mesh);

      obstacles.push({
        ...built,
        type,
        baseX: ox,
        x: ox,
        y: oy,
        z: zSpawn,
        prevZ: zSpawn,
        age: 0,
        angleZ,
        rotSpeedZ,
        moveAmpX,
        moveFreq,
        movePhase,
        spinX: (type === "BOULDER" || type === "CRYSTAL_CLUSTER") ? (Math.random() - 0.5) * 2.0 : 0,
        spinY: (type === "MINE" || type === "BOULDER" || type === "CRYSTAL_CLUSTER") ? (Math.random() - 0.5) * 2.2 : 0,
        passed: new Set()
      });
      return true;
    }

    // Step 2: Direct Anti-Camp / Anti-Corner Blocker right on player's current (curX, curY)!
    // Even if player sits at (-6.4, -3.3) extreme corner, this spawns dead-on (-6.4, -3.3)!
    const directPool = ["MINE", "BOULDER", "CRYSTAL_CLUSTER", "DRONE", "SHUTTER"];
    const directType = directPool[(waveCounter + Math.floor(Math.random() * directPool.length)) % directPool.length];
    const jitter = (focus && focus.campTime > 0.45) ? 0.0 : 0.22;
    const lockX = Math.max(-BOUND_X, Math.min(BOUND_X, curX + (Math.random() - 0.5) * jitter));
    const lockY = Math.max(BOUND_Y_MIN, Math.min(BOUND_Y_MAX, curY + (Math.random() - 0.5) * jitter));
    if (!tryPlaceSingleObstacle(directType, lockX, lockY, false)) {
      tryPlaceSingleObstacle("MINE", lockX, lockY, false);
    }

    // Step 3: Additional Random Diverse Shapes + Deliberate Edge/Corner Sweepers
    const progress = Math.min(1.3, distance / diff.goalDist);
    const targetExtra = Math.round(diff.minObs - 1 + progress * (diff.maxObs - diff.minObs + 0.6));

    const corners = [
      [-BOUND_X + 0.2, BOUND_Y_MAX - 0.2],
      [BOUND_X - 0.2, BOUND_Y_MAX - 0.2],
      [-BOUND_X + 0.2, BOUND_Y_MIN + 0.2],
      [BOUND_X - 0.2, BOUND_Y_MIN + 0.2]
    ];

    let placedExtra = 0;
    for (let slot = 0; slot < targetExtra; slot++) {
      for (let tries = 0; tries < 10; tries++) {
        const randType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
        let rx, ry;
        if (slot === 0 && Math.random() < 0.55) {
          // Edge / Corner sweeper so edges are actively contested!
          const c = corners[Math.floor(Math.random() * corners.length)];
          rx = c[0] + (Math.random() - 0.5) * 1.2;
          ry = c[1] + (Math.random() - 0.5) * 1.2;
        } else {
          // Full cross-section including extreme edges [-BOUND_X, +BOUND_X]
          rx = (Math.random() - 0.5) * BOUND_X * 2.0;
          ry = BOUND_Y_MIN + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN);
        }
        rx = Math.max(-BOUND_X, Math.min(BOUND_X, rx));
        ry = Math.max(BOUND_Y_MIN, Math.min(BOUND_Y_MAX, ry));

        if (tryPlaceSingleObstacle(randType, rx, ry, true)) {
          placedExtra++;
          break;
        }
      }
    }

    // Step 4: Spawn High-Value Score Ring inside the Guaranteed Safe Escape Gate!
    if (waveCounter % 2 === 1 || Math.random() < 0.65) {
      const ringObj = createEnergyRing(saveData.environment === "indoor" ? ch.railHex : 0xfbbf24);
      ringObj.mesh.position.set(safeX, safeY, zSpawn);
      scene.add(ringObj.mesh);
      energyRings.push({
        ...ringObj,
        x: safeX,
        y: safeY,
        z: zSpawn,
        prevZ: zSpawn,
        taken: false
      });
    }
  }

  function spawnWorldSupplyPod() {
    const podObj = createSupplyPod();
    const px = (Math.random() - 0.5) * (BOUND_X * 1.5);
    const py = BOUND_Y_MIN + 0.9 + Math.random() * (BOUND_Y_MAX - BOUND_Y_MIN - 1.8);
    const pz = -140;
    podObj.mesh.position.set(px, py, pz);
    scene.add(podObj.mesh);
    supplyPods.push({ ...podObj, x: px, y: py, z: pz, prevZ: pz, taken: false });
  }

  // =========================================================================
  // 7. HUD HELPERS & TACTICAL ITEMS
  // =========================================================================
  function showHudEvent(text, subText = "") {
    const el = document.getElementById("hud-event-text");
    const combo = document.getElementById("hud-combo-pill");
    if (el) el.textContent = text;
    if (combo) {
      if (subText) {
        combo.textContent = subText;
        combo.classList.remove("hidden");
      } else {
        combo.classList.add("hidden");
      }
    }
    eventBannerTimer = 1.25;
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
      lbl.textContent = getItemName(me.heldItem);
    } else {
      btn.classList.remove("ready");
      lbl.textContent = tr("noItem");
    }
  }

  function fireTacticalItem(attacker) {
    if (!attacker || !attacker.alive || !attacker.heldItem) return;
    const item = attacker.heldItem;
    attacker.heldItem = null;
    AudioEngine.sfxEmp();

    const rivals = players.filter((p) => p.alive && p.id !== attacker.id);
    if (rivals.length === 0 || item.id === "EMP") {
      let blasted = 0;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].z > -95 && obstacles[i].z < 10) {
          spawnBurst3D(obstacles[i].x, obstacles[i].y, obstacles[i].z, 0x38bdf8, 18);
          scene.remove(obstacles[i].mesh);
          obstacles.splice(i, 1);
          blasted++;
        }
      }
      const bonus = 400 + blasted * 150;
      attacker.score += bonus;
      if (attacker.id === "me") {
        pulseScoreReadout();
        showHudEvent("EMP BLAST!", `+${bonus} PTS`);
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

    showCallout(`${attacker.name} → ${target.name} : ${getItemName(item)}`);
    if (attacker.id === "me") updateTacticalButton(attacker);
    if (attacker.conn && attacker.conn.open) {
      attacker.conn.send({ type: "ITEM_STATE", itemName: null });
    }
    if (target.conn && target.conn.open) {
      target.conn.send({ type: "ATTACKED", item });
    }
  }

  // =========================================================================
  // 8. LAUNCH & FINISH FLIGHT FLOWS
  // =========================================================================
  async function launchSoloOrBody(useBodyCam = false) {
    AudioEngine.ensure();
    closeAllModals();

    gameMode = useBodyCam ? "BODY" : "SOLO";
    if (useBodyCam) {
      const ok = await enableBodyCamera();
      if (!ok) {
        showCallout(tr("camFallbackToast"));
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
    ringCombo = 0;
    lastRingAt = 0;
    nearMisses = 0;
    speedTierAnnounced = 1;
    clearedStage = false;
    boostEnergy = 100;
    isBoosting = false;
    waveCounter = 0;
    obsSpawnTimer = 0.55;
    podSpawnTimer = 3.2;

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
    const diff = DIFFICULTIES[saveData.diffIdx];
    const chTitle = saveData.lang === "en" ? ch.enName : ch.name;
    document.getElementById("hud-stage-title").textContent =
      `CH.${ch.chapter} ${chTitle} / ${diff.goalDist.toLocaleString()}m`;

    document.getElementById("home-shell").classList.add("hidden");
    document.getElementById("flight-hud").classList.remove("hidden");
    document.getElementById("hud-bottom-controls").classList.toggle("hidden", gameMode === "MONITOR");
    document.getElementById("hud-alive-wrap").classList.toggle("hidden", players.length <= 1);
    document.getElementById("body-preview-wrap").classList.toggle("hidden", gameMode !== "BODY");
    document.body.classList.add("in-flight");
    syncExternalAdProtection();

    isPlaying = true;
    showHudEvent("READY — GO!", `${tr("goalPrefix")}${diff.goalDist.toLocaleString()}m`);
    playVoice("start", true);

    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }

  function finishFlightSession(victory = false) {
    isPlaying = false;
    isBoosting = false;
    document.body.classList.remove("in-flight");
    syncExternalAdProtection();
    AudioEngine.updateEngine(false, false, 0);
    document.getElementById("blind-overlay").classList.remove("active");
    document.getElementById("screen-fx").classList.remove("boost-active", "damage-flash");
    document.getElementById("body-preview-wrap").classList.add("hidden");

    const me = players.find((p) => p.id === "me") || players[0];
    const finalScore = Math.floor(me ? me.score : score);
    const finalDist = Math.floor(me ? me.distance : distance);
    const earnedCredits = Math.max(30, Math.floor(finalScore * 0.06) + ringsCollected * 35 + (victory ? 500 : 0));

    saveData.credits += earnedCredits;
    saveData.xp += Math.floor(finalDist * 0.08) + ringsCollected * 20;
    if (finalScore > saveData.bestScore) saveData.bestScore = finalScore;
    if (finalDist > saveData.bestDist) saveData.bestDist = finalDist;
    persistSave();
    syncAllUI();

    document.getElementById("res-kicker").textContent = victory ? "STAGE CLEAR" : "FLIGHT ENDED";
    document.getElementById("res-kicker").style.color = victory ? "#10b981" : "#f87171";
    document.getElementById("res-title").textContent = victory ? tr("stageClearTitle") : tr("gameOverTitle");
    document.getElementById("res-score").textContent = finalScore.toLocaleString();
    document.getElementById("res-dist").textContent = `${finalDist.toLocaleString()}m`;
    document.getElementById("res-credits").textContent = `+${earnedCredits.toLocaleString()}`;
    document.getElementById("res-bonus").textContent = saveData.lang === "en"
      ? `Rings Passed: ${ringsCollected}  |  Near Misses: ${nearMisses}`
      : `リング通過: ${ringsCollected}回  /  ニアミス回避: ${nearMisses}回`;

    const rankBox = document.getElementById("res-ranking");
    if (players.length > 1) {
      rankBox.classList.remove("hidden");
      const sorted = [...players].sort((a, b) => b.score - a.score);
      rankBox.innerHTML = sorted.map((p, idx) => `
        <div class="setting-row" style="padding:7px 12px;">
          <span style="font-weight:900; font-size:13px;">#${idx + 1} ${p.name}</span>
          <span style="font-weight:800; font-size:13px; color:#fbbf24;">${Math.floor(p.score).toLocaleString()} (${Math.floor(p.distance).toLocaleString()}m)</span>
        </div>
      `).join("");
    } else {
      rankBox.classList.add("hidden");
    }

    const resModal = document.getElementById("modal-result");
    resModal.classList.remove("modal-offscreen", "hidden");
    resModal.querySelector(".dialog-body").scrollTop = 0;

    playVoice(victory ? "clear" : "gameover", true);
  }

  function returnToHangarHome() {
    isPlaying = false;
    isBoosting = false;
    document.body.classList.remove("in-flight");
    syncExternalAdProtection();
    AudioEngine.updateEngine(false, false, 0);
    stopBodyCamera();
    clearEntities();
    closeAllModals();

    showcaseAnchor.visible = true;
    document.getElementById("flight-hud").classList.add("hidden");
    document.getElementById("body-preview-wrap").classList.add("hidden");
    document.getElementById("blind-overlay").classList.remove("active");
    document.getElementById("home-shell").classList.remove("hidden");
    syncAllUI();
  }

  // =========================================================================
  // 9. DYNAMIC EXTERNAL AD OVERLAY GUARD (BUTTONS NEVER COVERED!)
  // =========================================================================
  const KNOWN_BODY_IDS = new Set([
    "game-canvas", "screen-fx", "voice-banner-container", "blind-overlay",
    "body-preview-wrap", "home-shell", "flight-hud", "side-rail-left", "side-rail-right",
    "modal-hangar", "modal-stages", "modal-multi", "modal-settings", "modal-result"
  ]);

  function syncExternalAdProtection() {
    let bottomOverlayH = 0;
    Array.from(document.body.children).forEach((el) => {
      if (el.tagName === "SCRIPT" || KNOWN_BODY_IDS.has(el.id)) return;
      if (isPlaying) {
        el.classList.add("admax-ext-hidden");
      } else {
        el.classList.remove("admax-ext-hidden");
        const st = window.getComputedStyle(el);
        if (st.position === "fixed" && st.display !== "none") {
          const rect = el.getBoundingClientRect();
          if (rect.height > 10 && rect.height < 160 && rect.bottom >= window.innerHeight - 24) {
            bottomOverlayH = Math.max(bottomOverlayH, rect.height + 6);
          }
        }
      }
    });
    document.documentElement.style.setProperty("--ad-bottom-safe", `${bottomOverlayH}px`);
  }
  setInterval(syncExternalAdProtection, 900);

  // =========================================================================
  // 10. INPUT HANDLERS (STICK, GYRO, TOUCH DRAG, CAMERA, KEYBOARD)
  // =========================================================================
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
    orbitPitch = Math.max(-0.28, Math.min(0.62, orbitPitch + dy * 0.008));
  });
  window.addEventListener("pointerup", () => { showcaseDragging = false; });

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
    dragSteerX = Math.max(-1, Math.min(1, (e.clientX - canvasOriginX) / 90));
    dragSteerY = Math.max(-1, Math.min(1, -(e.clientY - canvasOriginY) / 90));
  });
  window.addEventListener("pointerup", (e) => {
    if (e.pointerId === canvasPointerId) {
      canvasPointerId = null;
      dragSteerX = 0;
      dragSteerY = 0;
    }
  });

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
    showCallout(tr("gyroResetToast"));
  }

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

  // Body Camera Motion
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
  // 11. BILINGUAL UI SYNC, MODALS & MULTIPLAYER
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

  function syncAllUI() {
    document.documentElement.lang = saveData.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = tr(key);
    });

    const isEn = saveData.lang === "en";
    const craftMeta = CRAFT_CATALOG.find((c) => c.id === saveData.craftId) || CRAFT_CATALOG[0];
    const ch = CHAPTERS[saveData.chapterIdx] || CHAPTERS[0];
    const diff = DIFFICULTIES[saveData.diffIdx];
    const lvl = Math.floor(saveData.xp / 500) + 1;

    document.getElementById("ui-pilot-lvl").textContent = `LV.${lvl}`;
    document.getElementById("ui-credits").textContent = saveData.credits.toLocaleString();
    document.getElementById("ui-best-score").textContent = saveData.bestScore.toLocaleString();
    document.getElementById("ui-best-dist").textContent = `${saveData.bestDist.toLocaleString()}m`;

    document.getElementById("btn-lang-toggle").textContent = isEn ? "日本語" : "EN";
    document.getElementById("ui-audio-label").textContent = saveData.soundOn ? "ON" : "OFF";
    document.getElementById("audio-wave-path").style.display = saveData.soundOn ? "" : "none";

    document.getElementById("spec-code").textContent = `${craftMeta.code} ${craftMeta.name}`;
    document.getElementById("spec-name").textContent = isEn ? craftMeta.enName : craftMeta.jpName;
    document.getElementById("bar-speed").style.width = `${craftMeta.speedStat}%`;
    document.getElementById("bar-agility").style.width = `${craftMeta.agilityStat}%`;
    document.getElementById("bar-armor").style.width = `${craftMeta.armorStat}%`;

    document.getElementById("btn-env-outdoor").classList.toggle("active", saveData.environment === "outdoor");
    document.getElementById("btn-env-indoor").classList.toggle("active", saveData.environment === "indoor");
    document.getElementById("ui-stage-label").textContent =
      `CH.${ch.chapter} ${isEn ? ch.enName : ch.name}`;

    document.querySelectorAll("#diff-bar .diff-pill").forEach((b, idx) => {
      b.classList.toggle("active", idx === saveData.diffIdx);
    });
    document.getElementById("ui-sortie-goal").textContent =
      `${tr("goalPrefix")}${diff.goalDist.toLocaleString()}m`;

    renderVoiceSettings();
  }

  function toggleLanguage() {
    AudioEngine.sfxClick();
    saveData.lang = saveData.lang === "ja" ? "en" : "ja";
    persistSave();
    syncAllUI();
    if (!document.getElementById("modal-hangar").classList.contains("hidden")) renderHangarModal();
    if (!document.getElementById("modal-stages").classList.contains("hidden")) renderChaptersModal();
  }

  document.getElementById("btn-lang-toggle").addEventListener("click", toggleLanguage);
  document.getElementById("btn-settings-lang").addEventListener("click", toggleLanguage);

  function renderHangarModal() {
    const isEn = saveData.lang === "en";
    const cGrid = document.getElementById("hangar-craft-grid");
    cGrid.innerHTML = CRAFT_CATALOG.map((c) => `
      <button type="button" data-craft-id="${c.id}" class="craft-card ${c.id === saveData.craftId ? "active" : ""}">
        <div class="craft-card-code">${c.code}</div>
        <div class="craft-card-name">${isEn ? c.enName : c.jpName}</div>
        <div class="craft-card-role">${isEn ? c.enRole : c.role}</div>
      </button>
    `).join("");

    cGrid.querySelectorAll("[data-craft-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AudioEngine.sfxClick();
        saveData.craftId = btn.dataset.craftId;
        persistSave();
        rebuildShowcaseCraft();
        renderHangarModal();
        syncAllUI();
      });
    });

    const lRow = document.getElementById("hangar-livery-row");
    lRow.innerHTML = LIVERY_CATALOG.map((l, idx) => {
      const hex = "#" + new THREE.Color(l.primary).getHexString();
      return `
        <button type="button" data-livery-idx="${idx}" class="livery-swatch ${idx === saveData.liveryIdx ? "active" : ""}">
          <span class="swatch-dot" style="background:${hex};"></span>
          <span>${isEn ? l.enName : l.name}</span>
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

  function renderChaptersModal() {
    const isEn = saveData.lang === "en";
    const grid = document.getElementById("chapter-list-grid");
    grid.innerHTML = CHAPTERS.map((c, idx) => `
      <div class="chapter-card ${idx === saveData.chapterIdx ? "selected" : ""}">
        <div>
          <div class="chapter-top">
            <span class="chapter-num">CH.${String(c.chapter).padStart(2, "0")}</span>
            <span class="chapter-shape-badge">${isEn ? c.enTag : c.tag}</span>
          </div>
          <div class="chapter-title">${isEn ? c.enName : c.name}</div>
        </div>
        <div class="chapter-actions">
          <button type="button" data-launch-env="outdoor" data-launch-ch="${idx}" class="btn-secondary-sm">${tr("launchSky")}</button>
          <button type="button" data-launch-env="indoor" data-launch-ch="${idx}" class="btn-primary-sm">${tr("launchCorridor")}</button>
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

  function renderVoiceSettings() {
    const list = document.getElementById("voice-test-list");
    if (!list) return;
    const isEn = saveData.lang === "en";
    const items = [
      ["yahho",    isEn ? "01 Hello"     : "01 ヤッホー"],
      ["start",    isEn ? "02 Ready Go"  : "02 スタート"],
      ["abuna",    isEn ? "03 Watch Out" : "03 あぶなっ"],
      ["good",     isEn ? "04 Nice"      : "04 いいよ！"],
      ["speedup",  isEn ? "05 Speed Up"  : "05 スピードアップ"],
      ["clear",    isEn ? "06 Clear"     : "06 クリア"],
      ["gameover", isEn ? "07 Game Over" : "07 ゲーム失敗"]
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

  // PeerJS Multiplayer
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

  function renderOnlineMembers() {
    const box = document.getElementById("online-member-list");
    box.innerHTML = hostRoster.map((m, i) => `
      <div class="setting-row" style="padding:7px 12px;">
        <span style="font-weight:800; font-size:12px;">P${i + 1}: ${m.name}</span>
        <span style="font-size:11px; color:#38bdf8; font-weight:800;">${m.isBot ? "BOT" : "PLAYER"}</span>
      </div>
    `).join("");
  }

  document.getElementById("btn-online-create").addEventListener("click", () => {
    AudioEngine.sfxClick();
    const myName = document.getElementById("online-name").value.trim() || "HOST";
    const code = String(Math.floor(1000 + Math.random() * 9000));
    document.getElementById("online-room-code").textContent = code;
    document.getElementById("online-entry-box").classList.add("hidden");
    document.getElementById("online-room-box").classList.remove("hidden");
    document.getElementById("online-status-msg").textContent = tr("waitPlayers");

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
    hostRoster.push({ id: "bot-" + (botSeq++), name: `BOT-${hostRoster.length}`, isBot: true, conn: null });
    renderOnlineMembers();
  });

  document.getElementById("btn-online-start").addEventListener("click", () => {
    AudioEngine.sfxClick();
    if (hostRoster.length === 1) {
      hostRoster.push({ id: "bot-" + (botSeq++), name: "BOT-1", isBot: true, conn: null });
      hostRoster.push({ id: "bot-" + (botSeq++), name: "BOT-2", isBot: true, conn: null });
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
      status.textContent = tr("enter4Digits");
      return;
    }
    status.textContent = tr("connecting");
    if (peer) peer.destroy();
    peer = new Peer();
    peer.on("open", () => {
      clientConn = peer.connect("gd3d-online-" + code);
      clientConn.on("open", () => clientConn.send({ type: "JOIN", name: myName }));
      clientConn.on("data", (data) => {
        if (data.type === "WELCOME") {
          status.textContent = `${data.name} - OK`;
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
          showCallout(`! ${getItemName(data.item)}`);
          if (data.item.id === "SMOKE") {
            const bl = document.getElementById("blind-overlay");
            bl.classList.add("active");
            setTimeout(() => bl.classList.remove("active"), 3200);
          }
        }
      });
    });
  });

  function renderMonitorSlots() {
    document.getElementById("host-count").textContent = String(hostRoster.length);
    const box = document.getElementById("host-slots");
    let html = "";
    for (let i = 0; i < 10; i++) {
      const m = hostRoster[i];
      if (m) {
        html += `<div class="slot-box filled"><div style="font-weight:900; color:#38bdf8;">P${i + 1}</div><div style="font-weight:800;">${m.name}</div></div>`;
      } else {
        html += `<div class="slot-box"><div style="color:#64748b;">P${i + 1}</div><div style="color:#475569;">${tr("waitingSlot")}</div></div>`;
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
      new QRCode(qr, { text: `${location.origin}${location.pathname}?room=${code}`, width: 68, height: 68 });
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
      hostRoster.push({ id: "bot-" + (botSeq++), name: "BOT-1", isBot: true, conn: null });
      hostRoster.push({ id: "bot-" + (botSeq++), name: "BOT-2", isBot: true, conn: null });
    }
    gameMode = "MONITOR";
    closeAllModals();
    beginFlightSession(hostRoster);
  });

  document.getElementById("btn-remote-connect").addEventListener("click", () => {
    const code = document.getElementById("remote-code-input").value.trim();
    const name = document.getElementById("remote-name-input").value.trim() || "PLAYER";
    const msg = document.getElementById("remote-msg");
    if (code.length !== 4 || typeof Peer === "undefined") {
      msg.textContent = tr("enter4Digits");
      return;
    }
    msg.textContent = tr("connecting");
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
          document.getElementById("remote-item-label").textContent = data.itemName || "---";
        } else if (data.type === "ATTACKED") {
          document.getElementById("remote-alert").textContent = `! ${getItemName(data.item)}`;
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
    document.getElementById("remote-dot").style.transform = `translate(${rx * 42}px, ${-ry * 42}px)`;
    sendRemotePacket(rx, ry);
  }
  document.getElementById("btn-remote-boost").addEventListener("pointerdown", () => { isBoosting = true; sendRemotePacket(gyroX, gyroY); });
  document.getElementById("btn-remote-boost").addEventListener("pointerup", () => { isBoosting = false; sendRemotePacket(gyroX, gyroY); });
  document.getElementById("btn-remote-attack").addEventListener("click", () => {
    if (clientConn && clientConn.open) clientConn.send({ type: "ATTACK" });
  });

  // =========================================================================
  // 12. BUTTON EVENT WIRING
  // =========================================================================
  document.getElementById("btn-audio-toggle").addEventListener("click", () => {
    saveData.soundOn = !saveData.soundOn;
    persistSave();
    syncAllUI();
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
      syncAllUI();
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

  document.getElementById("btn-share-x").addEventListener("click", () => {
    AudioEngine.sfxClick();
    const s = document.getElementById("res-score").textContent;
    const d = document.getElementById("res-dist").textContent;
    const text = saveData.lang === "en"
      ? `Scored ${s} (${d}) in GYRO DODGE 3D! #GYRODODGE`
      : `GYRO DODGE 3D で スコア ${s}（飛行距離 ${d}）を達成！ #GYRODODGE`;
    const url = location.href.split("?")[0];
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  });

  document.getElementById("btn-share-copy").addEventListener("click", async () => {
    AudioEngine.sfxClick();
    const s = document.getElementById("res-score").textContent;
    const url = location.href.split("?")[0];
    const shareData = {
      title: "GYRO DODGE 3D",
      text: saveData.lang === "en" ? `Play GYRO DODGE 3D! My score: ${s}` : `GYRO DODGE 3D でスコア ${s} を記録！`,
      url
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${url}`);
      showCallout(tr("copiedToast"));
    } catch (e) {}
  });

  // =========================================================================
  // 13. MAIN 60FPS ANIMATION, SWEPT COLLISION & SAFE WORLD WRAP LOOP
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

    // Bounded Asymptotic Speed Curve — NEVER overflows or breaks stage geometry past 1,000+ km/h!
    const progressRatio = Math.min(1.45, distance / diff.goalDist);
    const activeBoost = isPlaying && isBoosting && boostEnergy > 2;
    const baseSpeed = isPlaying
      ? ((diff.speed + diff.maxExtraSpeed * progressRatio) * ch.speedMult) * (activeBoost ? 1.42 : 1.0)
      : 16;

    // Safe Modulo UV & Multi-Step While-Loop World Wrap (Stage NEVER Disappears!)
    if (saveData.environment === "indoor") {
      corridorWorld.deckTex.offset.y = ((corridorWorld.deckTex.offset.y - baseSpeed * dt * 0.045) % 1 + 1) % 1;
      corridorWorld.getArches().forEach((a) => {
        a.position.z += baseSpeed * dt;
        while (a.position.z > 16) a.position.z -= corridorWorld.totalSpan;
      });
      corridorWorld.getSpinners().forEach((s, idx) => {
        s.rotation.z += dt * (idx % 2 === 0 ? 0.85 : -0.85);
      });
    } else {
      outdoorWorld.waterBump.offset.y = ((outdoorWorld.waterBump.offset.y - baseSpeed * dt * 0.032) % 1 + 1) % 1;
      outdoorWorld.waterBump.offset.x = Math.sin(t * 0.35) * 0.08;
      outdoorWorld.props.forEach((chunk) => {
        chunk.position.z += baseSpeed * dt;
        while (chunk.position.z > 24) chunk.position.z -= outdoorWorld.totalSpan;
      });
      const cloudSpan = 18 * 16;
      outdoorWorld.clouds.forEach((cl) => {
        cl.position.z += baseSpeed * 0.55 * dt;
        while (cl.position.z > 22) cl.position.z -= cloudSpan;
      });
    }

    // Speed Dust Streaks
    const spArr = speedDust.geometry.attributes.position.array;
    for (let i = 0; i < speedParticlesCount; i++) {
      spArr[i * 3 + 2] += baseSpeed * (activeBoost ? 1.85 : 1.25) * dt;
      if (spArr[i * 3 + 2] > 14) {
        spArr[i * 3]     = (Math.random() - 0.5) * 28;
        spArr[i * 3 + 1] = (Math.random() - 0.5) * 18;
        spArr[i * 3 + 2] = -135 - Math.random() * 20;
      }
    }
    speedDust.geometry.attributes.position.needsUpdate = true;
    spMat.size = activeBoost ? 0.36 : 0.22;

    // 3D Spark Bursts
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
      if (!showcaseDragging) orbitYaw += dt * 0.26;
      showcaseAnchor.position.set(
        Math.sin(t * 1.1) * 0.18,
        (hangarOpen ? 1.5 : 1.05) + Math.sin(t * 2.0) * 0.1,
        2.0
      );
      showcaseAnchor.rotation.z = Math.cos(t * 1.1) * 0.07;
      animateAircraftDetails(showcaseCraft, 1.05, t, dt);

      const radius = hangarOpen ? 5.1 : 6.1;
      const targetCamX = showcaseAnchor.position.x + Math.sin(orbitYaw) * Math.cos(orbitPitch) * radius;
      const targetCamY = showcaseAnchor.position.y + Math.sin(orbitPitch) * radius + (hangarOpen ? 0.55 : 0.85);
      const targetCamZ = showcaseAnchor.position.z + Math.cos(orbitYaw) * Math.cos(orbitPitch) * radius;

      camera.position.x += (targetCamX - camera.position.x) * Math.min(1, dt * 6);
      camera.position.y += (targetCamY - camera.position.y) * Math.min(1, dt * 6);
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 6);
      camera.fov += (56 - camera.fov) * Math.min(1, dt * 6);
      camera.updateProjectionMatrix();
      camera.lookAt(showcaseAnchor.position.x, showcaseAnchor.position.y - (hangarOpen ? 0.5 : 0.05), showcaseAnchor.position.z);

      skyDome.mesh.position.copy(camera.position);
      burnerLight.position.set(showcaseAnchor.position.x, showcaseAnchor.position.y, showcaseAnchor.position.z + 2.2);
      renderer.render(scene, camera);
      return;
    }

    // =======================================================================
    // ACTIVE FLIGHT TELEMETRY, PHYSICS & SWEPT COLLISIONS
    // =======================================================================
    if (gameMode === "BODY") pollBodyCamera();

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

    if (isBoosting && boostEnergy > 0) {
      boostEnergy = Math.max(0, boostEnergy - 30 * dt);
    } else {
      boostEnergy = Math.min(100, boostEnergy + 11 * dt);
    }
    document.getElementById("screen-fx").classList.toggle("boost-active", activeBoost);
    document.getElementById("btn-boost-hold").classList.toggle("active", activeBoost);

    const arcOffset = 264 * (1 - boostEnergy / 100);
    document.getElementById("boost-meter-arc").style.strokeDashoffset = String(arcOffset);
    document.getElementById("boost-pct-label").textContent = `${Math.round(boostEnergy)}%`;

    AudioEngine.updateEngine(true, activeBoost, progressRatio);

    const agilityFactor = 0.88 + (craftMeta.agilityStat / 100) * 0.35;

    players.forEach((p) => {
      if (!p.alive) return;

      if (p.id === "me") {
        p.ix = combinedX;
        p.iy = combinedY;
        p.boost = activeBoost;
        sendRemotePacket(p.ix, p.iy);
      } else if (p.isBot) {
        let tx = Math.sin(t * 1.4 + p.slotIdx * 1.9) * 3.8;
        let ty = 0.6 + Math.cos(t * 1.6 + p.slotIdx * 2.1) * 2.3;
        const ringAhead = energyRings.find((r) => !r.taken && r.z > -65 && r.z < PLAYER_Z);
        if (ringAhead) {
          tx = ringAhead.x;
          ty = ringAhead.y;
        }
        p.ix = Math.max(-1, Math.min(1, (tx - p.x) * 0.72));
        p.iy = Math.max(-1, Math.min(1, (ty - p.y) * 0.72));
        p.boost = Math.random() < 0.03;
        if (p.heldItem && Math.random() < 0.02) fireTacticalItem(p);
      }

      const rev = now < p.revUntil ? -1 : 1;
      const gust = now < p.gustUntil ? p.gustDir * 5.2 : 0;
      const targetVx = p.ix * rev * 15.2 * agilityFactor + gust;
      const targetVy = p.iy * rev * 13.0 * agilityFactor;

      p.vx += (targetVx - p.vx) * Math.min(1, dt * 12);
      p.vy += (targetVy - p.vy) * Math.min(1, dt * 12);
      p.x = Math.max(-BOUND_X, Math.min(BOUND_X, p.x + p.vx * dt));
      p.y = Math.max(BOUND_Y_MIN, Math.min(BOUND_Y_MAX, p.y + p.vy * dt));

      // Track stationary / corner-camping dwell time
      if (Math.hypot(p.x - p.anchorX, p.y - p.anchorY) > 1.2) {
        p.anchorX = p.x;
        p.anchorY = p.y;
        p.campTime = 0;
      } else {
        p.campTime += dt;
      }

      p.craft.root.position.set(p.x, p.y, PLAYER_Z);
      p.craft.root.rotation.z = -p.vx * 0.05;
      p.craft.root.rotation.x = p.vy * 0.035;
      p.craft.root.rotation.y = -p.vx * 0.018;

      p.craft.root.visible = now < p.invulnUntil ? (Math.floor(now / 65) % 2 === 0) : true;
      animateAircraftDetails(p.craft, p.boost ? 1.65 : 1.0, t, dt);

      const pSpd = baseSpeed * (p.boost ? 1.15 : 1.0);
      // Supersonic distance scale calibrated to 25,000m / 15,000m / 8,000m / 5,000m!
      p.distance += pSpd * dt * 3.65;
      p.score += pSpd * dt * (p.boost ? 2.4 : 1.4) * diff.mult;
    });

    const me = players.find((p) => p.id === "me" && p.alive) || players.find((p) => p.alive);
    if (me) {
      document.getElementById("blind-overlay").classList.toggle("active", now < me.smokeUntil);

      cameraShake = Math.max(0, cameraShake - dt * 2.8);
      const shakeX = (Math.random() - 0.5) * cameraShake * 0.55;
      const shakeY = (Math.random() - 0.5) * cameraShake * 0.55;

      const camTargetX = me.x * 0.74 + shakeX;
      const camTargetY = me.y * 0.70 + 1.7 + shakeY;
      const camTargetZ = activeBoost ? 9.7 : 8.8;

      camera.position.x += (camTargetX - camera.position.x) * Math.min(1, dt * 9.0);
      camera.position.y += (camTargetY - camera.position.y) * Math.min(1, dt * 9.0);
      camera.position.z += (camTargetZ - camera.position.z) * Math.min(1, dt * 6.5);

      const targetFov = activeBoost ? 70 : 60;
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 7.0);
      camera.updateProjectionMatrix();

      camera.lookAt(me.x * 0.48, me.y * 0.48 + 0.3, -22);
      camera.rotation.z += (-me.vx * 0.008 - camera.rotation.z) * 0.25;

      skyDome.mesh.position.copy(camera.position);
      burnerLight.position.set(me.x, me.y, 4.0);
      burnerLight.intensity = activeBoost ? 2.5 : 1.2;

      score = me.score;
      distance = me.distance;
    }

    // Speed Tier Announcements & Difficulty Goal Milestone
    const nextTier = Math.min(5, Math.floor(progressRatio * 4) + 1);
    if (nextTier > speedTierAnnounced) {
      speedTierAnnounced = nextTier;
      showHudEvent(`SPEED UP LV.${speedTierAnnounced}`, "");
      playVoice("speedup", true);
    }
    if (!clearedStage && distance >= diff.goalDist) {
      clearedStage = true;
      if (me) me.score += Math.round(2500 * diff.mult);
      pulseScoreReadout();
      showHudEvent(tr("stageClearTitle"), "+2,500 CLEAR BONUS");
      playVoice("clear", true);
    }

    if (eventBannerTimer > 0) {
      eventBannerTimer -= dt;
      if (eventBannerTimer <= 0) {
        document.getElementById("hud-event-text").textContent = "";
        document.getElementById("hud-combo-pill").classList.add("hidden");
      }
    }

    // Spawn Coordinated Multi-Shape Waves
    obsSpawnTimer -= dt;
    if (obsSpawnTimer <= 0) {
      spawnObstacleWave(baseSpeed);
      const curInterval = diff.spawnBase - Math.min(1.15, progressRatio) * (diff.spawnBase - diff.minSpawn);
      obsSpawnTimer = Math.max(diff.minSpawn, curInterval);
    }

    // Update Obstacles with Swept-Z Hit Detection (Zero Tunneling at High Speed!)
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.prevZ = o.z;
      o.z += baseSpeed * dt;
      o.age += dt;
      o.angleZ += o.rotSpeedZ * dt;

      if (o.moveAmpX > 0) {
        o.x = Math.max(-BOUND_X, Math.min(BOUND_X, o.baseX + Math.sin(o.movePhase + o.moveFreq * o.age) * o.moveAmpX));
      }
      o.mesh.position.set(o.x, o.y, o.z);

      if (o.type === "BARRIER" || o.type === "CROSS_BLADE") {
        o.mesh.rotation.z = o.angleZ;
      } else {
        o.mesh.rotation.x += o.spinX * dt;
        o.mesh.rotation.y += o.spinY * dt;
      }

      // Swept Z-window across PLAYER_Z
      if (o.prevZ <= PLAYER_Z + 1.15 && o.z >= PLAYER_Z - 1.15) {
        players.forEach((p) => {
          if (!p.alive) return;
          const clearance = getSignedClearance(o, p.x, p.y, o.x, o.y, o.angleZ);

          if (clearance < 0) {
            if (now >= p.invulnUntil) {
              p.shields -= 1;
              p.invulnUntil = now + 1300;
              spawnBurst3D(p.x, p.y, PLAYER_Z, 0xef4444, 26);

              if (p.id === "me") {
                ringCombo = 0;
                AudioEngine.sfxHit();
                cameraShake = 1.0;
                updateShieldHUD(p);
                const fx = document.getElementById("screen-fx");
                fx.classList.add("damage-flash");
                setTimeout(() => fx.classList.remove("damage-flash"), 250);
                if (p.shields > 0) {
                  showHudEvent(tr("shieldHitMsg"), `SHIELD ${p.shields}/${p.maxShields}`);
                  playVoice("abuna", true);
                }
              }

              if (p.shields <= 0) {
                p.alive = false;
                p.craft.root.visible = false;
                spawnBurst3D(p.x, p.y, PLAYER_Z, 0xf97316, 42);
              }
            }
          } else if (clearance < 1.5 && !o.passed.has(p.id)) {
            o.passed.add(p.id);
            const nmBonus = Math.round(200 * diff.mult);
            p.score += nmBonus;
            if (p.id === "me") {
              nearMisses++;
              boostEnergy = Math.min(100, boostEnergy + 15);
              pulseScoreReadout();
              AudioEngine.sfxNearMiss();
              showHudEvent(tr("nearMissMsg"), `+${nmBonus} PTS`);
              if (nearMisses % 4 === 0) playVoice("good", false);
              else playVoice("abuna", false);
            }
          }
        });
      }

      if (o.z > 16) {
        scene.remove(o.mesh);
        obstacles.splice(i, 1);
      }
    }

    // Update Collectible Energy Rings (Swept-Z + Big Score Combo Multiplier!)
    for (let i = energyRings.length - 1; i >= 0; i--) {
      const r = energyRings[i];
      r.prevZ = r.z;
      r.z += baseSpeed * dt;
      r.mesh.position.z = r.z;
      r.innerRing.rotation.z += dt * 3.0;

      if (!r.taken && r.prevZ <= PLAYER_Z + 1.4 && r.z >= PLAYER_Z - 1.4) {
        for (const p of players) {
          if (!p.alive) continue;
          if (Math.hypot(p.x - r.x, p.y - r.y) < 2.35) {
            r.taken = true;
            r.mesh.visible = false;

            if (p.id === "me") {
              ringCombo = (now - lastRingAt < 5500) ? Math.min(5, ringCombo + 1) : 1;
              lastRingAt = now;
              const ringPts = Math.round(500 * ringCombo * diff.mult);
              p.score += ringPts;
              ringsCollected++;
              boostEnergy = Math.min(100, boostEnergy + 24);
              pulseScoreReadout();
              AudioEngine.sfxRing(ringCombo);
              spawnBurst3D(r.x, r.y, PLAYER_Z, 0xfbbf24, 22);

              if (ringsCollected % 5 === 0 && p.shields < p.maxShields) {
                p.shields++;
                updateShieldHUD(p);
                showHudEvent(tr("shieldRepairMsg"), `+${ringPts.toLocaleString()} PTS (COMBO x${ringCombo})`);
              } else {
                showHudEvent(tr("ringBonusMsg"), `+${ringPts.toLocaleString()} PTS${ringCombo > 1 ? ` (COMBO x${ringCombo})` : ""}`);
              }
              if (ringsCollected % 3 === 0) playVoice("good", false);
            } else {
              p.score += Math.round(500 * diff.mult);
            }
            break;
          }
        }
      }

      if (r.z > 15) {
        scene.remove(r.mesh);
        energyRings.splice(i, 1);
      }
    }

    // Spawn & Update Tactical Supply Pods
    podSpawnTimer -= dt;
    if (podSpawnTimer <= 0) {
      spawnWorldSupplyPod();
      podSpawnTimer = 4.8;
    }

    for (let i = supplyPods.length - 1; i >= 0; i--) {
      const pod = supplyPods[i];
      pod.prevZ = pod.z;
      pod.z += baseSpeed * dt;
      pod.mesh.position.z = pod.z;
      pod.ringA.rotation.y += dt * 2.6;
      pod.ringB.rotation.z -= dt * 2.2;

      if (!pod.taken && pod.prevZ <= PLAYER_Z + 1.35 && pod.z >= PLAYER_Z - 1.35) {
        for (const p of players) {
          if (!p.alive) continue;
          if (Math.hypot(p.x - pod.x, p.y - pod.y) < 2.05) {
            pod.taken = true;
            pod.mesh.visible = false;
            const picked = ATTACK_ITEMS[Math.floor(Math.random() * ATTACK_ITEMS.length)];
            p.heldItem = picked;
            spawnBurst3D(pod.x, pod.y, PLAYER_Z, 0x38bdf8, 20);

            if (p.id === "me") {
              AudioEngine.sfxRing(1);
              updateTacticalButton(p);
              showCallout(`ITEM: ${getItemName(picked)}`);
            }
            if (p.conn && p.conn.open) {
              p.conn.send({ type: "ITEM_STATE", itemName: getItemName(picked) });
            }
            break;
          }
        }
      }

      if (pod.z > 15) {
        scene.remove(pod.mesh);
        supplyPods.splice(i, 1);
      }
    }

    // Update HUD Telemetry
    const aliveList = players.filter((p) => p.alive);
    document.getElementById("hud-score").textContent = Math.floor(score).toLocaleString();
    document.getElementById("hud-dist").textContent = `${Math.floor(distance).toLocaleString()}m`;
    document.getElementById("hud-rings").textContent = String(ringsCollected);
    document.getElementById("hud-alive").textContent = `${aliveList.length}/${players.length}`;
    document.getElementById("hud-stage-fill").style.width = `${Math.min(100, (distance / diff.goalDist) * 100)}%`;

    const kmh = Math.round(baseSpeed * 28);
    document.getElementById("hud-speed-kmh").textContent = `${kmh.toLocaleString()} km/h`;

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
  // 14. RESIZE, DAILY BONUS & BOOT
  // =========================================================================
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    syncExternalAdProtection();
  });

  applyWorldTheme();

  const todayStr = new Date().toISOString().slice(0, 10);
  if (saveData.lastLoginDate !== todayStr) {
    saveData.lastLoginDate = todayStr;
    saveData.credits += 300;
    persistSave();
    setTimeout(() => showCallout(tr("dailyToast")), 700);
  }

  syncAllUI();

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
