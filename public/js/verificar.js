document.addEventListener("DOMContentLoaded", () => {
  const email = new URLSearchParams(window.location.search).get("email");

  const emailSpan   = document.getElementById("verificationEmail");
  const verifyBtn   = document.getElementById("verifyButton");
  const resendBtn   = document.getElementById("resendButton");
  const codeInput  = document.getElementById("verificationCodeInput");
  const errorDiv   = document.getElementById("verifyError");

  if (emailSpan) {
    emailSpan.textContent = email || "(no especificado)";
  }

  // ---------------- VERIFICAR CÓDIGO ----------------
  verifyBtn.addEventListener("click", async () => {
    errorDiv.style.color = "red";
    errorDiv.textContent = "";

    const code = codeInput.value.trim();
    if (!code) {
      errorDiv.textContent = "Ingresa el código de verificación.";
      return;
    }

    try {
      const res = await fetch("/verificar-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 🔥 Redirección decidida por el backend
        window.location.href = data.redirectTo;
      } else {
        errorDiv.textContent = data.error || "Código incorrecto.";
      }
    } catch (err) {
      console.error(err);
      errorDiv.textContent = "No se pudo verificar el código.";
    }
  });

  // ---------------- REENVIAR CÓDIGO ----------------
  resendBtn.addEventListener("click", async () => {
    errorDiv.style.color = "black";
    errorDiv.textContent = "";

    try {
      const res = await fetch("/reenviar-verificacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        errorDiv.style.color = "green";
        errorDiv.textContent = "Te enviamos un nuevo código al correo.";
      } else {
        errorDiv.textContent = data.error || "Error al reenviar el código.";
      }
    } catch (err) {
      console.error(err);
      errorDiv.textContent = "No se pudo reenviar el código.";
    }
  });
});
