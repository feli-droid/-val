// =============================================
//  Tarjeta de cumpleaños para Valery
// =============================================
{
  const SVGNS = "http://www.w3.org/2000/svg";
  const COLORES = ["#ff5c8a", "#ffd23f", "#b388ff", "#7fc8f8", "#ff9ec0", "#f5c542", "#ffffff"];
  const azar = (min, max) => Math.random() * (max - min) + min;
  const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];
  const f = (n) => n.toFixed(1);
  const $ = (id) => document.getElementById(id);
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Dibujo del pastel ----------

  // Rosetón de crema con sombra y espiral
  function roseton(x, y, r) {
    return `<g>
      <ellipse cx="${f(x)}" cy="${f(y + r * .6)}" rx="${f(r)}" ry="${f(r * .38)}" fill="#5a1a33" opacity=".12"/>
      <circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#gCrema)"/>
      <path d="M${f(x - r * .55)},${f(y + r * .1)} a${f(r * .5)},${f(r * .45)} 0 1 1 ${f(r * .9)},${f(r * .05)}"
            fill="none" stroke="#a07a60" stroke-opacity=".25" stroke-width="1.3"/>
    </g>`;
  }

  // Reparte elementos sobre un arco de elipse, ordenados de atrás hacia adelante
  function arco(cx, cy, rx, ry, n, t0, t1, dibujar) {
    const items = [];
    for (let i = 0; i < n; i++) {
      const t = t0 + (t1 - t0) * (i + .5) / n;
      const x = cx + rx * Math.cos(t);
      const y = cy + ry * Math.sin(t);
      items.push([y, dibujar(x, y)]);
    }
    return items.sort((a, b) => a[0] - b[0]).map((i) => i[1]).join("");
  }

  $("cremaBaseAtras").innerHTML = arco(200, 260, 140, 26, 18, Math.PI, Math.PI * 2, (x, y) => roseton(x, y, 8.5));
  $("perlas").innerHTML = arco(200, 258, 100, 19, 28, 0, Math.PI,
    (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="url(#gPerla)"/>`);
  $("cremaBaseFrente").innerHTML = arco(200, 260, 140, 26, 18, 0, Math.PI, (x, y) => roseton(x, y, 9.5));
  $("cremaPie").innerHTML = arco(200, 352, 146, 28, 20, 0, Math.PI, (x, y) => roseton(x, y, 10.5));

  // Chispitas de colores sobre el piso de abajo
  let chispas = "";
  for (let i = 0; i < 75; i++) {
    const x = azar(62, 338), y = azar(272, 346);
    chispas += `<rect x="${f(x)}" y="${f(y)}" width="7" height="2.6" rx="1.3" fill="${elegir(COLORES.slice(0, 6))}"
      transform="rotate(${Math.round(azar(0, 180))} ${f(x + 3.5)} ${f(y + 1.3)})"/>`;
  }
  $("chispas").innerHTML = chispas;

  // Glaseado de frambuesa chorreando por el piso de arriba
  const borde = (x) => 170 + 19 * Math.sqrt(Math.max(0, 1 - ((x - 200) / 100) ** 2));
  function goteo() {
    const gotas = [[114, 14], [134, 30], [156, 18], [178, 38], [200, 22], [222, 34], [244, 16], [266, 28], [286, 12]];
    const ancho = 12, base = 7;
    let d = "M100,170 ";
    let x = 100;
    for (const [xc, largo] of gotas) {
      const x1 = xc - ancho / 2, x2 = xc + ancho / 2;
      for (let xi = x + 3; xi < x1; xi += 3) d += `L${f(xi)},${f(borde(xi) + base)} `;
      const y1 = borde(x1) + base, y2 = borde(x2) + base;
      const fondo = Math.max(y1, y2) + largo;
      d += `L${f(x1)},${f(y1)} C${f(x1 + 1)},${f(y1 + largo * .5)} ${f(x1)},${f(fondo - 4)} ${f(x1)},${f(fondo)} `;
      d += `A${ancho / 2},${ancho / 2} 0 0 0 ${f(x2)},${f(fondo)} `;
      d += `C${f(x2)},${f(fondo - 4)} ${f(x2 - 1)},${f(y2 + largo * .5)} ${f(x2)},${f(y2)} `;
      x = x2;
    }
    for (let xi = x + 3; xi < 300; xi += 3) d += `L${f(xi)},${f(borde(xi) + base)} `;
    d += "L300,170 A100,19 0 0 0 100,170 Z";
    $("goteo").setAttribute("d", d);
  }
  goteo();

  // Llama con halo
  function llama(x, y, escala = 1) {
    return `<g class="llama" data-x="${f(x)}" data-y="${f(y)}" transform="translate(${f(x)} ${f(y)}) scale(${escala})">
      <circle class="halo" cy="-11" r="22" fill="url(#gHalo)"/>
      <g class="fuego" style="animation-delay:-${azar(0, 1).toFixed(2)}s">
        <path d="M0,-24 C7,-13 8,-5 0,0 C-8,-5 -7,-13 0,-24Z" fill="url(#gLlama)"/>
        <ellipse cy="-4" rx="2.2" ry="3.6" fill="#7cc4ff" opacity=".6"/>
      </g>
    </g>`;
  }

  // Vela normal en espiral
  function velaNormal(x, y, patron) {
    const alto = 46, tope = y - alto;
    return `<g class="vela">
      <rect x="${x - 13}" y="${tope - 34}" width="26" height="${alto + 34}" fill="transparent"/>
      <rect x="${x - 4}" y="${tope}" width="8" height="${alto}" rx="2" fill="url(#${patron})"/>
      <rect x="${x - 4}" y="${tope}" width="8" height="${alto}" rx="2" fill="url(#gSombraVela)"/>
      <ellipse cx="${x}" cy="${tope}" rx="4" ry="1.6" fill="#fff" opacity=".85"/>
      <path d="M${x},${tope} q1.2,-3 0,-6" stroke="#2b2b2b" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      ${llama(x, tope - 5)}
    </g>`;
  }

  // Vela dorada con el número 17 (una mecha en cada número)
  function velaNumero() {
    const base = 180, topeNum = base - 58;
    const mecha = (x) => `<path d="M${x},${topeNum + 2} q1.2,-4 0,-9" stroke="#2b2b2b" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    return `<g class="vela vela-numero">
      <rect x="158" y="70" width="86" height="114" fill="transparent"/>
      <text class="numero" x="183" y="${base}" text-anchor="middle">1</text>
      <text class="numero" x="221" y="${base}" text-anchor="middle">7</text>
      ${mecha(185)}${mecha(219)}
      ${llama(185, topeNum - 6, 1.15)}
      ${llama(219, topeNum - 6, 1.15)}
    </g>`;
  }

  // Copete de crema batida, a veces con fruta
  function copete(x, y, s, i) {
    let g = `<g>
      <ellipse cx="${f(x)}" cy="${f(y + 2 * s)}" rx="${f(10 * s)}" ry="${f(3.4 * s)}" fill="#5a1a33" opacity=".18"/>
      <ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(9.5 * s)}" ry="${f(5 * s)}" fill="url(#gCrema)"/>
      <ellipse cx="${f(x)}" cy="${f(y - 4 * s)}" rx="${f(7 * s)}" ry="${f(4.4 * s)}" fill="url(#gCrema)"/>
      <ellipse cx="${f(x)}" cy="${f(y - 8 * s)}" rx="${f(4.5 * s)}" ry="${f(3.4 * s)}" fill="url(#gCrema)"/>
      <circle cx="${f(x + .5)}" cy="${f(y - 11 * s)}" r="${f(2 * s)}" fill="url(#gCrema)"/>`;
    if (i % 3 === 0) {
      g += `<circle cx="${f(x)}" cy="${f(y - 14 * s)}" r="${f(5.2 * s)}" fill="url(#gFresa)"/>`;
      for (let k = 0; k < 5; k++) {
        g += `<circle cx="${f(x + azar(-3, 3) * s)}" cy="${f(y - 14 * s + azar(-3, 3) * s)}" r=".8" fill="#ffd0d8" opacity=".8"/>`;
      }
    } else if (i % 3 === 1) {
      g += `<circle cx="${f(x)}" cy="${f(y - 13 * s)}" r="${f(4.2 * s)}" fill="url(#gArandano)"/>
            <circle cx="${f(x - 1.2)}" cy="${f(y - 14.5 * s)}" r="1.1" fill="#fff" opacity=".6"/>`;
    }
    return g + "</g>";
  }

  // Todo lo que va sobre el pastel, ordenado por profundidad
  const cima = [];
  for (let i = 0; i < 14; i++) {
    const t = (i / 14) * Math.PI * 2 + .11;
    const x = 200 + 88 * Math.cos(t), y = 170 + 15 * Math.sin(t);
    const s = .85 + .2 * (Math.sin(t) + 1) / 2;
    cima.push([y, copete(x, y, s, i)]);
  }
  [[146, 163, "pRosa"], [254, 163, "pAzul"], [126, 173, "pLila"],
   [274, 173, "pRosa"], [150, 183, "pAzul"], [252, 183, "pLila"]]
    .forEach(([x, y, p]) => cima.push([y, velaNormal(x, y, p)]));
  cima.push([178, velaNumero()]);
  $("cimaPastel").innerHTML = cima.sort((a, b) => a[0] - b[0]).map((c) => c[1]).join("");

  // ---------- Soplar las velas ----------
  const velas = [...document.querySelectorAll("#cimaPastel .vela")];
  const mensajeVelas = $("mensajeVelas");
  const btnSoplar = $("btnSoplar");
  const btnEncender = $("btnEncender");

  function humo(vela) {
    vela.querySelectorAll(".llama").forEach((l) => {
      const x = +l.dataset.x, y = +l.dataset.y;
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", `M${x},${y - 2} c-5,-8 5,-13 0,-21 c-5,-8 5,-13 0,-21`);
      p.setAttribute("class", "humo");
      vela.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    });
  }

  function apagar(vela, conSonido = true) {
    if (vela.classList.contains("apagada")) return;
    vela.classList.add("apagada");
    if (conSonido) sonidoSoplido();
    humo(vela);
    const quedan = velas.filter((v) => !v.classList.contains("apagada")).length;
    if (quedan === 0) {
      mensajeVelas.textContent = "¡Que se cumplan todos tus deseos, Valery!";
      btnSoplar.hidden = true;
      btnEncender.hidden = false;
      lanzarConfeti(260);
      mostrarTeQuiero();
    } else {
      mensajeVelas.textContent = `Quedan ${quedan} ${quedan === 1 ? "vela" : "velas"}…`;
    }
  }

  velas.forEach((v) => v.addEventListener("click", () => apagar(v)));

  btnSoplar.addEventListener("click", () => {
    sonidoSoplido(); // un solo soplido para todas
    velas.filter((v) => !v.classList.contains("apagada"))
      .forEach((v, i) => setTimeout(() => apagar(v, false), i * 90));
  });

  // Mensaje "Te quiero mucho" durante 3 segundos
  const teQuiero = $("teQuiero");
  let teQuieroTimer = null;
  function mostrarTeQuiero() {
    clearTimeout(teQuieroTimer);
    teQuiero.classList.add("visible");
    teQuieroTimer = setTimeout(() => teQuiero.classList.remove("visible"), 2400);
  }

  btnEncender.addEventListener("click", () => {
    velas.forEach((v) => v.classList.remove("apagada"));
    mensajeVelas.textContent = "Pide un deseo y toca cada vela para apagarla";
    btnSoplar.hidden = false;
    btnEncender.hidden = true;
  });

  // ---------- Confeti ----------
  const canvas = $("confeti");
  const ctx = canvas.getContext("2d");
  let piezas = [];
  let animando = false;

  function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", ajustarCanvas);
  ajustarCanvas();

  function animar() {
    if (!animando) {
      animando = true;
      requestAnimationFrame(dibujarConfeti);
    }
  }

  function lanzarConfeti(cantidad = 150) {
    for (let i = 0; i < cantidad; i++) {
      piezas.push({
        x: azar(0, canvas.width), y: azar(-canvas.height * .5, -10),
        ancho: azar(6, 12), alto: azar(8, 16), color: elegir(COLORES),
        velY: azar(2, 5), velX: azar(-1.5, 1.5),
        giro: azar(0, Math.PI * 2), velGiro: azar(-.2, .2),
      });
    }
    animar();
  }

  function explosion(x, y, color) {
    for (let i = 0; i < 25; i++) {
      piezas.push({
        x, y, ancho: azar(4, 8), alto: azar(6, 10),
        color: i % 2 ? color : elegir(COLORES),
        velY: azar(-4, 3), velX: azar(-4, 4),
        giro: azar(0, Math.PI * 2), velGiro: azar(-.3, .3),
      });
    }
    animar();
  }

  function dibujarConfeti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piezas.forEach((p) => {
      p.y += p.velY;
      p.x += p.velX + Math.sin(p.y / 30);
      p.giro += p.velGiro;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto * Math.cos(p.giro));
      ctx.restore();
    });
    piezas = piezas.filter((p) => p.y < canvas.height + 20);
    if (piezas.length) {
      requestAnimationFrame(dibujarConfeti);
    } else {
      animando = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ---------- Globos ----------
  const contenedorGlobos = $("globos");
  const COLORES_GLOBO = ["#ff6f9c", "#ffd23f", "#c4a1ff", "#8fd3ff", "#ffffff", "#f5c542"];

  function crearGlobo() {
    if (reducido) return;
    const globo = document.createElement("div");
    const color = elegir(COLORES_GLOBO);
    const escala = azar(.7, 1.2);
    globo.className = "globo";
    globo.style.background = color;
    globo.style.left = `${azar(0, 95)}vw`;
    globo.style.width = `${60 * escala}px`;
    globo.style.height = `${75 * escala}px`;
    globo.style.animationDuration = `${azar(11, 19)}s`;
    globo.addEventListener("click", (e) => {
      globo.classList.add("reventado");
      sonidoPop();
      explosion(e.clientX, e.clientY, color);
      setTimeout(() => globo.remove(), 250);
    });
    globo.addEventListener("animationend", (e) => {
      if (e.animationName === "subir") globo.remove();
    });
    contenedorGlobos.appendChild(globo);
  }

  // ---------- Sonidos y música ----------
  let audioCtx = null;
  const obtenerAudio = () => (audioCtx ??= new (window.AudioContext || window.webkitAudioContext)());
  const enServidor = /^https?:$/.test(location.protocol);

  function tocarNota(frecuencia, inicio, duracion, tipo = "triangle", volumen = .2, destino = null) {
    const ac = obtenerAudio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = tipo;
    osc.frequency.value = frecuencia;
    gain.gain.setValueAtTime(volumen, inicio);
    gain.gain.exponentialRampToValueAtTime(.001, inicio + duracion);
    osc.connect(gain).connect(destino || ac.destination);
    osc.start(inicio);
    osc.stop(inicio + duracion);
  }

  function sonidoPop() {
    try { tocarNota(azar(500, 900), obtenerAudio().currentTime, .12, "square", .15); } catch (e) {}
  }

  // --- Música de fondo: musica.mp3 ("Que Dios te bendiga") ---
  const musica = new Audio("musica.mp3");
  musica.loop = true;
  musica.preload = "auto";
  const VOL_NORMAL = 1;
  const VOL_BAJO = .2;      // volumen mientras se soplan las velas
  let ganancia = null;      // control de volumen con Web Audio (funciona también en iPhone)
  let usarMelodia = false;  // si no se encuentra musica.mp3, suena la melodía de respaldo
  let sonando = false;
  let volumenActual = VOL_NORMAL;
  let fadeId = null;
  musica.addEventListener("error", () => (usarMelodia = true));

  function conectarGanancia() {
    if (ganancia || !enServidor) return;
    try {
      const ac = obtenerAudio();
      const fuente = ac.createMediaElementSource(musica);
      ganancia = ac.createGain();
      fuente.connect(ganancia).connect(ac.destination);
    } catch (e) { ganancia = null; }
  }

  // Cambia el volumen de la música suavemente
  function fundirVolumen(destino, segundos = .4) {
    volumenActual = destino;
    try {
      const ac = obtenerAudio();
      for (const g of [ganancia, gainMelodia]) {
        if (!g) continue;
        g.gain.cancelScheduledValues(ac.currentTime);
        g.gain.setValueAtTime(g.gain.value, ac.currentTime);
        g.gain.linearRampToValueAtTime(destino, ac.currentTime + segundos);
      }
    } catch (e) {}
    if (ganancia) return;
    cancelAnimationFrame(fadeId);
    const desde = musica.volume, inicio = performance.now();
    const paso = (t) => {
      const k = Math.min((t - inicio) / (segundos * 1000), 1);
      musica.volume = desde + (destino - desde) * k;
      if (k < 1) fadeId = requestAnimationFrame(paso);
    };
    fadeId = requestAnimationFrame(paso);
  }

  // Baja la música al soplar y la vuelve a subir cuando se deja de soplar
  let subirTimer = null;
  function bajarMusica() {
    if (volumenActual !== VOL_BAJO) fundirVolumen(VOL_BAJO, .25);
    clearTimeout(subirTimer);
    subirTimer = setTimeout(() => fundirVolumen(VOL_NORMAL, 1.2), 1800);
  }

  // --- Sonido de soplar vela: soplar.mp3 ---
  const soplar = new Audio("soplar.mp3");
  soplar.preload = "auto";
  let soplarFalla = false;
  soplar.addEventListener("error", () => (soplarFalla = true));

  function sonidoSoplido() {
    bajarMusica();
    if (soplarFalla) return soplidoSintetico();
    const s = soplar.cloneNode();
    s.play().catch(soplidoSintetico);
  }

  function soplidoSintetico() {
    try {
      const ac = obtenerAudio();
      const ruido = ac.createBuffer(1, ac.sampleRate * .3, ac.sampleRate);
      const datos = ruido.getChannelData(0);
      for (let i = 0; i < datos.length; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / datos.length);
      const fuente = ac.createBufferSource();
      const filtro = ac.createBiquadFilter();
      const gain = ac.createGain();
      filtro.type = "lowpass";
      filtro.frequency.value = 900;
      gain.gain.value = .25;
      fuente.buffer = ruido;
      fuente.connect(filtro).connect(gain).connect(ac.destination);
      fuente.start();
    } catch (e) {}
  }

  // --- Melodía de respaldo (solo si falta musica.mp3) ---
  const N = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
  const MELODIA = [
    [N.G4, .75], [N.G4, .25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
    [N.G4, .75], [N.G4, .25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
    [N.G4, .75], [N.G4, .25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 2],
    [N.F5, .75], [N.F5, .25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2],
  ];
  const TIEMPO = .45;
  let gainMelodia = null;
  let rondaMelodia = null;
  let musicaTimer = null;

  function tocarMelodia() {
    const ac = obtenerAudio();
    if (!gainMelodia) {
      gainMelodia = ac.createGain();
      gainMelodia.gain.value = volumenActual;
      gainMelodia.connect(ac.destination);
    }
    rondaMelodia = ac.createGain();
    rondaMelodia.connect(gainMelodia);
    let t = ac.currentTime + .1;
    MELODIA.forEach(([freq, dur]) => {
      tocarNota(freq, t, dur * TIEMPO * .95, "triangle", .2, rondaMelodia);
      t += dur * TIEMPO;
    });
    const total = MELODIA.reduce((s, [, d]) => s + d, 0) * TIEMPO;
    musicaTimer = setTimeout(tocarMelodia, (total + 1) * 1000);
  }

  // --- Botón de música ---
  const btnMusica = $("btnMusica");
  function actualizarBoton() {
    btnMusica.textContent = sonando ? "Pausar música" : "Música";
    btnMusica.classList.toggle("activo", sonando);
  }

  function iniciarMusica() {
    sonando = true;
    actualizarBoton();
    try { obtenerAudio().resume(); } catch (e) {}
    if (usarMelodia) return tocarMelodia();
    conectarGanancia();
    musica.play().catch(() => {
      usarMelodia = true;
      if (sonando) tocarMelodia();
    });
  }

  function detenerMusica() {
    sonando = false;
    actualizarBoton();
    musica.pause();
    clearTimeout(musicaTimer);
    musicaTimer = null;
    if (rondaMelodia) { rondaMelodia.disconnect(); rondaMelodia = null; }
  }

  btnMusica.addEventListener("click", () => (sonando ? detenerMusica() : iniciarMusica()));

  // ---------- Abrir el sobre ----------
  $("sobre").addEventListener("click", () => {
    $("entrada").classList.add("abierta");
    iniciarMusica();
    setTimeout(() => {
      $("tarjeta").classList.add("visible");
      lanzarConfeti(220);
      for (let i = 0; i < 5; i++) setTimeout(crearGlobo, i * 600);
      setInterval(crearGlobo, 2600);
    }, 1300);
  }, { once: true });
}
