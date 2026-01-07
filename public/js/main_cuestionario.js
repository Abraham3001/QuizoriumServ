// main_cuestionario.js - Versión con retroalimentación

let questions = [];
let userAnswers = [];
let currentQuestion = 0;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("seleccionCuestionarioModal");
  const select = document.getElementById("cuestionarioSelect");
  const loadBtn = document.getElementById("cargarCuestionarioBtn");
  const form = document.getElementById("quizForm");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resultado = document.getElementById("resultado");
  const feedbackDiv = document.getElementById("feedback");
  const modalConfirm = document.getElementById("confirmModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  loadBtn.addEventListener("click", () => {
    const selectedFile = select.value;
    
    if (!selectedFile) {
      select.style.borderColor = "#e74c3c";
      select.style.animation = "shake 0.5s";
      setTimeout(() => {
        select.style.borderColor = "";
        select.style.animation = "";
      }, 500);
      return;
    }

    loadBtn.textContent = "Cargando...";
    loadBtn.disabled = true;

    const script = document.createElement("script");
    script.src = `../js/${selectedFile}`;
    
    script.onload = () => {
      if (window.questions && Array.isArray(window.questions)) {
        questions = window.questions;
        userAnswers = new Array(questions.length).fill(null);
        currentQuestion = 0;
        
        modal.style.display = "none";
        resultado.style.display = "none";
        feedbackDiv.style.display = "none";
        resultado.innerHTML = "";
        feedbackDiv.innerHTML = "";
        
        renderQuestions();
        renderNavButtons();
        updateNavigationButtons();
        
        document.getElementById("preguntas-container").scrollIntoView({ 
          behavior: "smooth" 
        });
      } else {
        showErrorMessage("No se pudieron cargar las preguntas del cuestionario.");
        loadBtn.textContent = "Cargar Cuestionario";
        loadBtn.disabled = false;
      }
    };
    
    script.onerror = () => {
      showErrorMessage(`Error al cargar el archivo: ${selectedFile}`);
      loadBtn.textContent = "Cargar Cuestionario";
      loadBtn.disabled = false;
    };
    
    document.body.appendChild(script);
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestions();
      updateNavigationButtons();
      scrollToQuestion();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestions();
      updateNavigationButtons();
      scrollToQuestion();
    }
  });

  submitBtn.addEventListener("click", () => {
    const sinResponder = userAnswers.filter(a => a === null).length;
    
    if (sinResponder > 0) {
      const modalContent = modalConfirm.querySelector('.modal-content p');
      modalContent.innerHTML = `
        <span style="color: #f39c12; font-size: 1.3rem;">⚠️</span><br>
        Tienes <strong>${sinResponder}</strong> pregunta(s) sin responder.<br>
        ¿Deseas enviar el cuestionario de todas formas?
      `;
    } else {
      const modalContent = modalConfirm.querySelector('.modal-content p');
      modalContent.textContent = "¿Estás seguro de que deseas enviar el cuestionario?";
    }
    
    modalConfirm.style.display = "flex";
  });

  confirmYes.addEventListener("click", () => {
    modalConfirm.style.display = "none";
    checkAnswers();
    resultado.style.display = "block";
    feedbackDiv.style.display = "block";
    
    setTimeout(() => {
      resultado.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  });

  confirmNo.addEventListener("click", () => {
    modalConfirm.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target === modalConfirm) {
      modalConfirm.style.display = "none";
    }
  };
});

function showErrorMessage(message) {
  const form = document.getElementById("quizForm");
  form.innerHTML = `
    <div style="
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
      border: 2px solid #e74c3c;
      border-left: 6px solid #e74c3c;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      animation: fadeIn 0.5s ease;
    ">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h4 style="color: #e74c3c; margin-bottom: 1rem;">Error al cargar</h4>
      <p style="color: var(--quiz-text); font-size: 1.1rem;">${message}</p>
      <button onclick="location.reload()" style="
        margin-top: 1.5rem;
        padding: 0.8rem 2rem;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        Recargar página
      </button>
    </div>
  `;
}

function renderQuestions() {
  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  if (questions.length === 0) return;

  const q = questions[currentQuestion];
  const div = document.createElement("div");
  div.className = "question";

  const questionText = document.createElement("p");
  questionText.innerHTML = `<strong>${currentQuestion + 1}.</strong> ${q.texto}`;
  div.appendChild(questionText);

  q.opciones.forEach((opcion, i) => {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${currentQuestion}`;
    input.value = i;
    input.id = `q${currentQuestion}_op${i}`;
    
    if (userAnswers[currentQuestion] === i) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      userAnswers[currentQuestion] = i;
      updateNavButtonState(currentQuestion);
    });

    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    label.textContent = opcion;

    div.appendChild(input);
    div.appendChild(label);
  });

  form.appendChild(div);
}

function renderNavButtons() {
  const container = document.getElementById("navBtns");
  container.innerHTML = "";

  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = "nav-btn";
    btn.type = "button";
    
    if (i === currentQuestion) {
      btn.classList.add("active");
    }
    
    if (userAnswers[i] !== null) {
      btn.style.fontWeight = "900";
    }

    btn.addEventListener("click", () => {
      currentQuestion = i;
      renderQuestions();
      updateNavigationButtons();
      scrollToQuestion();
    });

    container.appendChild(btn);
  });
}

function updateNavigationButtons() {
  document.querySelectorAll(".nav-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === currentQuestion);
    
    if (userAnswers[i] !== null) {
      btn.style.fontWeight = "900";
    } else {
      btn.style.fontWeight = "700";
    }
  });

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = currentQuestion === questions.length - 1;
}

function updateNavButtonState(index) {
  const navButtons = document.querySelectorAll(".nav-btn");
  if (navButtons[index]) {
    navButtons[index].style.fontWeight = "900";
  }
}

function scrollToQuestion() {
  const form = document.getElementById("quizForm");
  if (form) {
    form.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function checkAnswers() {
  let correctas = 0;
  let feedback = "";

  questions.forEach((q, i) => {
    const correcta = q.correcta;
    const respuesta = userAnswers[i];
    const esCorrecta = respuesta === correcta;
    
    if (esCorrecta) correctas++;

    const respuestaTexto = respuesta !== null 
      ? q.opciones[respuesta] 
      : "<em>Sin responder</em>";
    
    let estadoHTML = "";
    if (esCorrecta) {
      estadoHTML = '<span style="color: #27ae60; font-weight: 800;">✓ Correcto</span>';
    } else {
      estadoHTML = `
        <span style="color: #e74c3c; font-weight: 800;">✗ Incorrecto</span><br>
        <span style="color: #27ae60; font-weight: 600;">Respuesta correcta: ${q.opciones[correcta]}</span>
      `;
      
      // Agregar retroalimentación si existe
      if (q.retroalimentacion) {
        estadoHTML += `
          <div style="
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(52, 152, 219, 0.1);
            border-left: 4px solid #3498db;
            border-radius: 8px;
          ">
            <strong style="color: #3498db;">💡 Retroalimentación:</strong><br>
            <span style="color: var(--quiz-text); font-size: 0.95rem; line-height: 1.6;">
              ${q.retroalimentacion}
            </span>
          </div>
        `;
      }
    }

    feedback += `
      <div style="
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: var(--quiz-bg-main);
        border-radius: 12px;
        text-align: left;
        border-left: 4px solid ${esCorrecta ? '#27ae60' : '#e74c3c'};
      ">
        <strong style="color: var(--quiz-primary); font-size: 1.1rem;">
          ${i + 1}. ${q.texto}
        </strong><br><br>
        <strong>Tu respuesta:</strong> ${respuestaTexto}<br>
        ${estadoHTML}
      </div>
    `;
  });

  const porcentaje = ((correctas / questions.length) * 100).toFixed(1);
  
  let mensaje = "";
  if (porcentaje >= 90) {
    mensaje = "¡Excelente! 🌟";
  } else if (porcentaje >= 70) {
    mensaje = "¡Muy bien! 👍";
  } else if (porcentaje >= 50) {
    mensaje = "Puedes mejorar 📚";
  } else {
    mensaje = "Sigue estudiando 💪";
  }

  document.getElementById("resultado").innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--quiz-success);">
      ${mensaje}
    </h3>
    <div style="font-size: 2rem; font-weight: 900; color: var(--quiz-primary);">
      ${correctas} / ${questions.length}
    </div>
    <div style="font-size: 1.2rem; margin-top: 0.5rem; color: var(--quiz-text-light);">
      ${porcentaje}% de aciertos
    </div>
  `;
  
  document.getElementById("feedback").innerHTML = `
    <h4 style="margin-bottom: 1.5rem; color: var(--quiz-primary); font-size: 1.5rem;">
      📝 Revisión Detallada
    </h4>
    ${feedback}
  `;

  markQuestionsAsCorrectOrIncorrect();
}

function markQuestionsAsCorrectOrIncorrect() {
  questions.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.correcta;
    const navBtn = document.querySelectorAll(".nav-btn")[i];
    
    if (navBtn) {
      if (isCorrect) {
        navBtn.style.background = "linear-gradient(135deg, #27ae60, #229954)";
        navBtn.style.color = "white";
        navBtn.style.borderColor = "#27ae60";
      } else {
        navBtn.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
        navBtn.style.color = "white";
        navBtn.style.borderColor = "#e74c3c";
      }
    }
  });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);