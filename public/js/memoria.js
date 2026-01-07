// Configuración de niveles 
const niveles = {
  facil: { columnas: 4, filas: 3, tiempo: 180 },
  medio: { columnas: 4, filas: 4, tiempo: 240 },
  dificil: { columnas: 5, filas: 4, tiempo: 300 }
};

// Base de datos de leucemias 
const leucemias = [
  { nombre: "Eritrocitos", descripcion: "Lente 40x. Hematíes predominantemente dismórficos, con contornos deformados, anisocitosis y brotes o vesículas en la membrana. Se identifican acantocitos (Células G1), eritrocitos en forma de anillo con proyecciones, hallazgo característico de hematuria de origen glomerular (Baños-Laredo, 2010). Cortesía: José A. T Poloni.", imagen: "../img/Imagenes/Celulas_2.jpeg" },
  { nombre: "Eritrocitos codocitos", descripcion: "Lente 40x. Se observan como células pequeñas, redondas, con bordes refringentes y sin núcleo (María Sandra Arauz, 2019) . Cortesía: José A. T Poloni.", imagen: "../img/Imagenes/Celulas_5.jpeg" },
  { nombre: "Eritrocitos codocitos", descripcion: "Lente 40x.  Células de formas no agrupadas, con bordes luminosos y se diferencia que no obtienen núcleo. (María Sandra Arauz, 2019) .Cortesía: José A. T Poloni.", imagen: "../img/Imagenes/Celulas_6.jpeg" },
  { nombre: "Leucocitos", descripcion: "Lente 40x. Presencia de numerosos leucocitos distribuidos en el campo, de forma redondeada, citoplasma granular y contornos bien definidos, además, se identifica la presencia de estructuras fúngicas correspondientes a levaduras ovoides con gemación y formación de pseudohifas delgadas, que se entrelazan entre los elementos celulares. (Ramírez et al., 2022). Cortesía: José A. T Poloni.", imagen: "../img/Imagenes/Celulas_8.jpeg" },
  { nombre: "Espermatozoides", descripcion: "Lente 40x. La imagen observada bajo un objetivo de 40x revela con claridad la presencia de un espermatozoide, distinguible por su característica cabeza ovalada y su cola delgada y alargada, estructuras que le permiten desplazarse con agilidad en medios líquidos. La cabeza, ligeramente achatada, contiene el material genético y se une a la pieza intermedia, donde se concentran las mitocondrias encargadas de suministrar la energía necesaria para el movimiento flagelar (Golomingi et al., 2022). Cortesía: José A. T. Poloni.", imagen: "../img/Imagenes/Celulas_9.jpeg" },
  { nombre: "Cilindro granuloso grueso", descripcion: "Lente 40x. Cilindro granuloso grueso con coloración amarillo-parduzca,presenta gránulos gruesos irregulares distribuidos en toda la estructura cilíndrica (Kitamura, 2024). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/cilindros/cil_gran_3.jpg" },
  { nombre: "Cilindro hemático", descripcion: "Lente 40X. Cilindro hemático con tonalidad parda, evidenciando hemoglobina y restos eritrocitarios en su estructura tubular (Kitamura, 2024). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/cilindros/cil_hematico_2.jpg" },
  { nombre: "Cilindro hialino", descripcion: "Lente de 40x: Cilindro hialino transparente con múltiples células epiteliales renales embebidas en matriz proteica, con bordes definidos y extremos redondeados (Cortez, 2019). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/cilindros/cil_hialino_2.jpg" },
  { nombre: "Cilindro leucocitario", descripcion: "Lente 40x. La imagen observada bajo un objetivo de 40x revela con claridad la presencia de un cilindro leucocitario dentro de un sedimento urinario, examinado en condiciones que preservan la integridad de las estructuras celulares. El uso de una preparación no teñida permite observar los elementos en su estado más natural, destacándose los contrastes ópticos propios de las células y la matriz que conforman el cilindro (Fernándezet al., 2025). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/cilindros/cil_leuco_5.jpg" },
  { nombre: "Cilindro graso", descripcion: "Lente 40x. Cilindro graso con múltiples gotas lipídicas refrigerantes de color amarillo claro en matriz hialina transparente característico de lipiduria y síndrome nefrótico (Kitamura, 2024). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/cilindros/cil_graso_3.jpg" },
  { nombre: "Cristales de ácido úrico", descripcion: "Lente 40x: Cristales de ácido úrico en forma de agujas finas, agrupadas en haces radiales tipo roseta. Ocupan la zona periférica y parte central del campo. Presentan birefringencia débil y disposición en abanico, típica de agregación cristalina en medio ácido. (Campos 2025) Cortesía: Ana Paula Giolo Franz.", imagen: "../img/img_cristales1/img3.png" },
  { nombre: "Cristales de bilirrubina", descripcion: "Lente 40x. Cristales de bilirrubina. Microscopía de contraste de fases. Su morfología es de espículas delgadas y a alargadas, con una tonalidad amarilla a castaña, son birrefringentes con luz polarizada. (Navaza et al., 2005) Cortesía: José A.T. Poloni.", imagen: "../img/img_cristales1/img13.png" },
  { nombre: "Cristales de cistina", descripcion: "Lente 40x. Se observan múltiples cristales de cistina distribuidos en el campo, con su morfología característica hexagonal plana, de bordes rectos y ángulos bien definidos. Algunos cristales se encuentran aislados, mientras que otros forman agrupaciones superpuestas, indicativas de una alta saturación urinaria de cistina. Presentan apariencia incolora, transparente y de baja refringencia, lo que facilita su diferenciación respecto de otros cristales urinarios. (Strasinger & Di Lorenzo, 2020). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/img_cristales1/img15.png" },
  { nombre: "Cristales de biurato", descripcion: "Lente 40x: Se puede apreciar en la imagen microscópica varios cristales de biurato que suelen ser irregulares y asimétricos, con bordes agudos o puntiagudos. En este caso, podemos ver que los cristales están dispersos en todo el campo, algunos con forma de 'aguja' o 'espina' y otros más redondeados. Las tonalidades varían entre marrones y dorados, que son comunes en los cristales de biurato debido a su forma. (Simhadri, 2024). Cortesía: José A. T. Poloni.", imagen: "../img/img_cristales1/img28.png" },
  { nombre: "Cristales de oxalato de calcio", descripcion: "Lente 40x: En el campo microscópico se observan cristales de oxalato de calcio monohidratado, los cuales presentan su morfología característica en forma de dumbbell o 'mancuerna'. Los cristales son incoloros y muy refringentes, lo que genera un contorno brillante y bien definido bajo luz de campo claro. Su disposición es mayoritariamente aislada, aunque algunos se agrupan en pequeñas concentraciones. (Strasinger & Di Lorenzo, 2020). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/img_cristales1/img35.png" },
  { nombre: "Hongos (Candida)", descripcion: "Lente 40x. La imagen observada bajo un aumento de 40x permite analizar con claridad un campo microscópico en el que se identifican como hifas (rojo) compatibles con la presencia de un hongo, probablemente del género Cándida, basándose en la morfología característica de las células y su organización. En el campo visual se observan células levaduriformes de forma ovalada, distribuidas de manera irregular sobre el sustrato, reflejando la fase levaduriforme típica de estas especies (Rahman et al., 2023). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/microorganismos/micro_2.jpg" },
  { nombre: "Microorganismos mixtos", descripcion: "Lente 40x. En la muestra observada bajo un objetivo de 40x se aprecia un campo microscópico complejo y heterogéneo, compuesto por abundantes leucocitos, células epiteliales escamosas, levaduras en proceso de gemación (amarillo) y estructuras filamentosas compatibles con pseudohifas (verde). Además, se observan numerosas bacterias de morfología variada, entre ellas cocos grampositivos dispuestos en grupos o cadenas, así como bacilos de diferentes longitudes (Ross & Herzberg, 2016). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/microorganismos/micro_6.jpg" },
  { nombre: "Hongos filamentosos", descripcion: "Lente 40x. En la imagen observada bajo un objetivo de 40x se distingue de manera clara y precisa una extensa red de estructuras filamentosas que corresponden a hifas y pseudohifas, las cuales son compatibles con el desarrollo característico de hongos levaduriformes con tendencia al crecimiento filamentoso. Estas formaciones se entrelazan conformando una red densa y ramificada que se distribuye de forma irregular sobre el campo de observación, evidenciando un patrón de crecimiento activo y una notable capacidad de expansión del micelio (Rahman et al., 2023). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/microorganismos/micro_7.jpg" },
  { nombre: "Cocos bacterianos", descripcion: "Lente 40x. La imagen observada bajo un aumento de 40x revela con claridad la presencia de un elevado número de cocos que se disponen formando agrupaciones características, principalmente en configuraciones de tétradas (rojo) y sarcinas (amarillo). Estas estructuras reflejan un patrón de división celular en múltiples planos perpendiculares, lo cual es un rasgo distintivo de ciertos géneros bacterianos pertenecientes al grupo de las Gram positivas (Guo et al., 2020). Cortesía: Ana Paula Giolo Franz.", imagen: "../img/microorganismos/micro_9.jpg" }
];

// Variables del juego 
let juegoState = {
  cartas: [],
  seleccionadas: [],
  bloqueado: false,
  timer: null,
  segundos: 0,
  movimientos: 0,
  aciertos: 0,
  juegoIniciado: false,
  nivelActual: 'facil'
};

// Sistema de efectos de sonido 
const sonidos = {
  voltear: () => {
    // Efecto de sonido al voltear carta
    if (window.audioContext) {
      const oscillator = window.audioContext.createOscillator();
      const gainNode = window.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(window.audioContext.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(window.audioContext.currentTime + 0.1);
    }
  },
  acierto: () => {
    // Efecto de sonido para acierto
    if (window.audioContext) {
      const oscillator = window.audioContext.createOscillator();
      const gainNode = window.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(window.audioContext.destination);
      oscillator.frequency.value = 1200;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(window.audioContext.currentTime + 0.2);
    }
  },
  victoria: () => {
    // Efecto de sonido para victoria
    if (window.audioContext) {
      [800, 1000, 1200, 1500].forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = window.audioContext.createOscillator();
          const gainNode = window.audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(window.audioContext.destination);
          oscillator.frequency.value = freq;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(window.audioContext.currentTime + 0.2);
        }, index * 100);
      });
    }
  }
};

// Inicializar contexto de audio
function inicializarAudio() {
  if (!window.audioContext && (window.AudioContext || window.webkitAudioContext)) {
    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Función  para renderizar tablero previo
function renderizarTableroPrevia() {
  const nivel = document.getElementById("nivel").value;
  juegoState.nivelActual = nivel;
  const { columnas, filas } = niveles[nivel];
  const cantidadCartas = columnas * filas;

  const tablero = document.getElementById("tablero");
  tablero.className = "tablero-memoria-enhanced";
  tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`; 
  tablero.innerHTML = "";

  // Crear cartas de vista previa con animación
  for (let i = 0; i < cantidadCartas; i++) {
    const card = document.createElement("div");
    card.className = "carta bloqueada loading-pulse";
    card.style.animationDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="frente"></div>
      <div class="atras">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 2rem;">
          ?
        </div>
      </div>
    `;
    tablero.appendChild(card);
  }

  detenerTimer();
  resetearContadores();
  ocultarMensajes();
  ocultarEstadisticas();
}

// Función  para iniciar juego
function iniciarJuego() {
  inicializarAudio();

  const btnIniciar = document.getElementById("btnIniciar");
  btnIniciar.disabled = true;
  btnIniciar.innerHTML = '<span class="btn-icon">⏳</span> Preparando...';

  const nivel = document.getElementById("nivel").value;
  juegoState.nivelActual = nivel;
  const { columnas, filas } = niveles[nivel];
  const cantidadCartas = (columnas * filas) / 2;

  // Selección aleatoria sin categorías
  let seleccion = leucemias
    .sort(() => Math.random() - 0.5)
    .slice(0, cantidadCartas);

  juegoState.cartas = [...seleccion, ...seleccion].sort(() => Math.random() - 0.5);

  const tablero = document.getElementById("tablero");
  tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
  tablero.innerHTML = "";

  // Crear cartas con animación secuencial
  juegoState.cartas.forEach((leucemia, idx) => {
    setTimeout(() => {
      const card = document.createElement("div");
      card.className = "carta";
      card.dataset.nombre = leucemia.nombre;
      card.dataset.index = idx;
      card.style.animationDelay = `${idx * 50}ms`;

      card.innerHTML = `
        <div class="frente"></div>
        <div class="atras">
          <img src="${leucemia.imagen}" alt="${leucemia.nombre}" loading="lazy" />
        </div>
      `;

      card.addEventListener("click", () => voltearCarta(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          voltearCarta(card);
        }
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Carta ${idx + 1}, ${leucemia.nombre}`);

      tablero.appendChild(card);
    }, idx * 30);
  });
  setTimeout(() => {
    tablero.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1000);

  // Resetear estado del juego
  juegoState.seleccionadas = [];
  juegoState.bloqueado = true;
  juegoState.movimientos = 0;
  juegoState.aciertos = 0;
  juegoState.juegoIniciado = false;

  ocultarMensajes();
  mostrarEstadisticas();

  // Mostrar todas las cartas brevemente
  setTimeout(() => {
    document.querySelectorAll(".carta").forEach(c => {
      c.classList.add("volteada");
      c.style.pointerEvents = 'none';
    });

    btnIniciar.innerHTML = '<span class="btn-icon">👀</span> Memoriza...';

    setTimeout(() => {
      document.querySelectorAll(".carta").forEach(c => {
        c.classList.remove("volteada");
        c.style.pointerEvents = 'auto';
      });
      juegoState.bloqueado = false;
      juegoState.juegoIniciado = true;
      iniciarTimer();

      btnIniciar.innerHTML = '<span class="btn-icon">🎮</span> ¡Jugando!';
      btnIniciar.disabled = false;
    }, 3000);
  }, 1000);

  resetearContadores();
  actualizarEstadisticas();
}
// Función  para voltear carta
function voltearCarta(carta) {
  if (juegoState.bloqueado || 
      carta.classList.contains("volteada") || 
      carta.classList.contains("descubierta") ||
      !juegoState.juegoIniciado) {
    return;
  }

  // Efectos visuales y sonoros
  carta.classList.add("volteada");
  carta.style.transform = "scale(1.05)";
  setTimeout(() => carta.style.transform = "", 300);
  
  sonidos.voltear();

  juegoState.seleccionadas.push(carta);

  // Incrementar movimientos solo en el primer volteo de cada par
  if (juegoState.seleccionadas.length === 1) {
    juegoState.movimientos++;
    actualizarEstadisticas();
  }

  if (juegoState.seleccionadas.length === 2) {
    juegoState.bloqueado = true;
    const [c1, c2] = juegoState.seleccionadas;

    if (c1.dataset.nombre === c2.dataset.nombre && c1.dataset.index !== c2.dataset.index) {
      // ¡Acierto!
      setTimeout(() => {
        c1.classList.add("descubierta");
        c2.classList.add("descubierta");
        
        // Efectos de acierto
        sonidos.acierto();
        crearEfectoParticulas(c1);
        crearEfectoParticulas(c2);
        
        mostrarInfo(c1.dataset.nombre);
        juegoState.seleccionadas = [];
        juegoState.bloqueado = false;
        juegoState.aciertos++;
        actualizarEstadisticas();
        verificarGanador();
      }, 600);
    } else {
      // Error
      setTimeout(() => {
        c1.classList.remove("volteada");
        c2.classList.remove("volteada");
        
        // Efecto de error
        [c1, c2].forEach(card => {
          card.style.animation = "shake 0.5s ease-in-out";
          setTimeout(() => card.style.animation = "", 500);
        });
        
        juegoState.seleccionadas = [];
        juegoState.bloqueado = false;
        actualizarEstadisticas();
      }, 1200);
    }
  }
}

// Crear efecto de partículas para aciertos
function crearEfectoParticulas(carta) {
  const particulas = ['✨', '⭐', '🎉', '💫'];
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const particula = document.createElement('div');
      particula.textContent = particulas[Math.floor(Math.random() * particulas.length)];
      particula.style.position = 'absolute';
      particula.style.fontSize = '1.5rem';
      particula.style.pointerEvents = 'none';
      particula.style.zIndex = '1000';
      particula.style.animation = 'particleFloat 2s ease-out forwards';
      
      const rect = carta.getBoundingClientRect();
      particula.style.left = (rect.left + Math.random() * rect.width) + 'px';
      particula.style.top = (rect.top + Math.random() * rect.height) + 'px';
      
      document.body.appendChild(particula);
      
      setTimeout(() => particula.remove(), 2000);
    }, i * 100);
  }
}

// Agregar keyframes para animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes particleFloat {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(0.5) rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

// Función  para mostrar información
function mostrarInfo(nombre) {
  const info = leucemias.find(l => l.nombre === nombre);
  const mensaje = document.getElementById("mensaje-leucemia");
  const infoContent = mensaje.querySelector('.info-content') || mensaje;
  
  if (mensaje.querySelector('.info-content')) {
    infoContent.innerHTML = `
      <strong>${info.nombre}</strong><br>
      ${info.descripcion}
    `;

  } else {
    mensaje.textContent = `${info.nombre}: ${info.descripcion}`;
  }
  
  mensaje.classList.remove("d-none");
  //mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
  
  // Auto-ocultar después de 10 segundos
  setTimeout(() => {
    if (!mensaje.classList.contains("d-none")) {
      mensaje.style.opacity = '0.7';
    }
  }, 10000);
}

// Función  para verificar ganador
function verificarGanador() {
  const descubiertas = document.querySelectorAll(".carta.descubierta");
  if (descubiertas.length === juegoState.cartas.length) {
    detenerTimer();
    sonidos.victoria();
    
    // Calcular estadísticas finales
    const precision = Math.round((juegoState.aciertos / juegoState.movimientos) * 100);
    const tiempoFinal = formatearTiempo(juegoState.segundos);
    
    // Efecto de confetti
    crearConfetti();
    
    setTimeout(() => {
      document.getElementById("tiempo-final").innerHTML = `
        <strong>⏱️ Tiempo:</strong> ${tiempoFinal}<br>
        <strong>🎯 Movimientos:</strong> ${juegoState.movimientos}<br>
        <strong>📊 Precisión:</strong> ${precision}%
      `;
      document.getElementById("modal-ganador").classList.remove("d-none");
    }, 1000);
  }
}

// Crear efecto confetti
function crearConfetti() {
  const colores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#ddd6fe'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.zIndex = '10000';
      confetti.style.borderRadius = '50%';
      confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }, i * 50);
  }
}

// Agregar animación de confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

// Función para cerrar modal ganador
function cerrarModalGanador() {
  document.getElementById("modal-ganador").classList.add("d-none");
  
  // Reinicializar automáticamente para otra partida
  setTimeout(() => {
    renderizarTableroPrevia();
    document.getElementById("btnIniciar").disabled = false;
    document.getElementById("btnIniciar").innerHTML = '<span class="btn-icon">🚀</span> Iniciar Juego';
  }, 500);
}

// Funciones de timer mejoradas
function iniciarTimer() {
  detenerTimer();
  juegoState.segundos = 0;
  actualizarTimer();
  juegoState.timer = setInterval(() => {
    juegoState.segundos++;
    actualizarTimer();
    const tiempoLimite = niveles[juegoState.nivelActual].tiempo;
    if (tiempoLimite && juegoState.segundos > tiempoLimite * 0.8) {
      document.getElementById("cronometro").style.color = '#dc2626';
      document.getElementById("cronometro").style.animation = 'pulse 1s infinite';
    }
  }, 1000);
}

function detenerTimer() {
  if (juegoState.timer) {
    clearInterval(juegoState.timer);
    juegoState.timer = null;
  }
  // Resetear estilos de advertencia
  document.getElementById("cronometro").style.color = '';
  document.getElementById("cronometro").style.animation = '';
}

function resetearContadores() {
  juegoState.segundos = 0;
  juegoState.movimientos = 0;
  juegoState.aciertos = 0;
  actualizarTimer();
  actualizarEstadisticas();
}

function actualizarTimer() {
  const timerElement = document.getElementById("cronometro");
  const timerSpan = timerElement.querySelector('span') || timerElement;
  timerSpan.textContent = formatearTiempo(juegoState.segundos);
}

function formatearTiempo(seg) {
  const min = Math.floor(seg / 60).toString().padStart(2, "0");
  const sec = (seg % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

// Funciones de estadísticas
function mostrarEstadisticas() {
  const statsElement = document.getElementById("gameStats");
  if (statsElement) {
    statsElement.classList.remove("d-none");
  }
}

function ocultarEstadisticas() {
  const statsElement = document.getElementById("gameStats");
  if (statsElement) {
    statsElement.classList.add("d-none");
  }
}

function actualizarEstadisticas() {
  const movimientosEl = document.getElementById("movimientos");
  const aciertosEl = document.getElementById("aciertos");
  const precisionEl = document.getElementById("precision");
  
  if (movimientosEl) movimientosEl.textContent = juegoState.movimientos;
  if (aciertosEl) aciertosEl.textContent = juegoState.aciertos;
  
  if (precisionEl) {
    const precision = juegoState.movimientos > 0 
      ? Math.round((juegoState.aciertos / juegoState.movimientos) * 100) 
      : 100;
    precisionEl.textContent = `${precision}%`;
    
    // Cambiar color según precisión
    if (precision >= 80) {
      precisionEl.style.color = '#16a34a';
    } else if (precision >= 60) {
      precisionEl.style.color = '#f59e0b';
    } else {
      precisionEl.style.color = '#dc2626';
    }
  }
}

// Función para ocultar mensajes
function ocultarMensajes() {
  document.getElementById("mensaje-leucemia").classList.add("d-none");
  document.getElementById("mensaje-leucemia").style.opacity = '1';
}

// Función de reinicio 
function reiniciarJuego() {
  detenerTimer();
  juegoState.bloqueado = false;
  juegoState.juegoIniciado = false;
  juegoState.seleccionadas = [];
  
  // Animación de salida para las cartas
  const cartas = document.querySelectorAll('.carta');
  cartas.forEach((carta, index) => {
    setTimeout(() => {
      carta.style.animation = 'cardSlideOut 0.3s ease-in forwards';
    }, index * 20);
  });
  
  setTimeout(() => {
    renderizarTableroPrevia();
    document.getElementById("btnIniciar").disabled = false;
    document.getElementById("btnIniciar").innerHTML = '<span class="btn-icon">🚀</span> Iniciar Juego';
  }, 500);
}

// Agregar animación de salida
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
  @keyframes cardSlideOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
    }
  }
`;
document.head.appendChild(slideOutStyle);

// Funciones de accesibilidad 
function configurarAccesibilidad() {
  // Navegación por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal-ganador');
      if (!modal.classList.contains('d-none')) {
        cerrarModalGanador();
      }
    }
  });
  
  // Mejoras para lectores de pantalla
  document.querySelectorAll('.carta').forEach((carta, index) => {
    carta.setAttribute('aria-label', `Carta ${index + 1}`);
    carta.setAttribute('role', 'button');
    carta.setAttribute('tabindex', '0');
  });
}
// Eventos iniciales mejorados
document.addEventListener("DOMContentLoaded", () => {
  renderizarTableroPrevia();
  configurarAccesibilidad();

  // Event listeners con mejoras
  document.getElementById("btnIniciar").addEventListener("click", iniciarJuego);
  
  document.getElementById("nivel").addEventListener("change", () => {
    reiniciarJuego();
  });
  
  document.getElementById("btnReiniciar").addEventListener("click", reiniciarJuego);
  
  document.getElementById("btnCerrarModalGanador").addEventListener("click", cerrarModalGanador);
  
  // Mejorar el modal para cerrar con click fuera
  document.getElementById("modal-ganador").addEventListener("click", (e) => {
    if (e.target.id === "modal-ganador") {
      cerrarModalGanador();
    }
  });
  
  // Prevenir zoom en mobile
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  });
  
  // Optimización de rendimiento
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reajustar tablero si es necesario
      if (juegoState.cartas.length > 0) {
        const nivel = document.getElementById("nivel").value;
        const { columnas } = niveles[nivel];
        document.getElementById("tablero").style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
      }
    }, 100);
  });
});

// Función de depuración (solo para desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.juegoDebug = {
    revelarTodas: () => {
      document.querySelectorAll('.carta').forEach(c => c.classList.add('volteada'));
    },
    completarJuego: () => {
      document.querySelectorAll('.carta').forEach(c => c.classList.add('descubierta'));
      verificarGanador();
    },
    estado: () => console.log(juegoState)
  };
}

// Exportar funciones principales para uso externo
window.juegoMemoria = {
  iniciar: iniciarJuego,
  reiniciar: reiniciarJuego,
  estado: () => ({ ...juegoState })
};