//-------------------- Dependencias y Configuración Inicial --------------------//
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();
const sequelize = require('./database/db');
const Usuario = require('./models/usuario');
const Pregunta = require('./models/pregunta');
const Cuestionario = require('./models/cuestionario');
const TipoLeucemia = require('./models/tipoLeucemia');
const SubtipoLeucemia = require('./models/subtipoLeucemia');
const leucemiaEspecifica = require('./models/leucemiaEspecifica');
const Contenido = require('./models/contenido');
const usuariosRouter = require('./routes/usuarios');
const passport = require('passport');
//const configurePassport = require('./config/passport');
const Attempt      = require('./models/attempt');
const Answer       = require('./models/answer');

// 1) Attempt ↔ Answer
Attempt.hasMany(Answer,    { foreignKey: 'attemptId',    as: 'respuestas' });
Answer.belongsTo(Attempt,  { foreignKey: 'attemptId',    as: 'intento' });

// 2) Attempt ↔ Usuario
Attempt.belongsTo(Usuario,      { foreignKey: 'usuarioId',      as: 'usuario' });
Usuario.hasMany(Attempt,        { foreignKey: 'usuarioId',      as: 'intentos' });

// 3) Attempt ↔ Cuestionario
Attempt.belongsTo(Cuestionario, { foreignKey: 'cuestionarioId', as: 'cuestionario' });
Cuestionario.hasMany(Attempt,   { foreignKey: 'cuestionarioId', as: 'intentos' });

// 4) Answer ↔ Pregunta
Answer.belongsTo(Pregunta, { foreignKey: 'preguntaId', as: 'pregunta' });
Pregunta.hasMany(Answer,   { foreignKey: 'preguntaId', as: 'respuestas' });

//-------------------- Configurar Passport --------------------//
//configurePassport();

//-------------------- Inicialización de Express --------------------//
const app = express();
const PORT = process.env.PORT || 3000;

//-------------------- Asociación entre modelos --------------------//
TipoLeucemia.hasMany(SubtipoLeucemia, { foreignKey: 'tipoLeucemiaId', as: 'subtipos' });
SubtipoLeucemia.belongsTo(TipoLeucemia, { foreignKey: 'tipoLeucemiaId', as: 'tipo' });

//-------------------- Middlewares globales --------------------//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secreto_único_123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 2 }
}));
app.use(passport.initialize());
app.use(passport.session());

//-------------------- Middlewares personalizados --------------------//
function requiereLogin(req, res, next) {
  if (!req.session.usuarioId) return res.redirect('/iniciar-sesion');
  next();
}

function requiereRol(rol) {
  return (req, res, next) => {
    if (!req.session.usuarioId) return res.redirect('/iniciar-sesion');
    if (req.session.rol !== rol) {
      return res.status(403).sendFile(path.join(__dirname, 'public', 'html', '403.html'));
    }
    next();
  };
}

function redirigirSiAutenticado(req, res, next) {
  if (req.session.usuarioId) {
    return res.redirect(req.session.rol === 'profesor' ? '/admin' : '/estudiante');
  }
  next();
}

//-------------------- Configuración de Multer (Uploads) --------------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public', 'uploads')),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

//-------------------- Rutas HTML Públicas --------------------//
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'index.html')));
app.get('/iniciar-sesion', redirigirSiAutenticado, (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'login.html')));
app.get('/registro', redirigirSiAutenticado, (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'registro.html')));
app.get('/admin-login', redirigirSiAutenticado, (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'admin-login.html')));
app.get('/verificar', (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'verificar.html')));

//-------------------- Rutas HTML Protegidas --------------------//
app.get('/retroalimentacion-estudiante', requiereRol('estudiante'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'retroalimentacion-estudiante.html')));
app.get('/contenido', requiereLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'contenido.html')));
app.get('/ajustes', requiereLogin, (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'ajustes-usuario.html')));
app.get('/admin', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'panel-admin.html')));
app.get('/admin/tipo', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'admin-tipos.html')));
app.get('/admin/contenido', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'agregar-contenido.html')));
app.get('/admin/agregar-contenido', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'admin-agregar-contenido.html')));
app.get('/docente', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'panel-docente.html')));
app.get('/editar-cuestionario/:id', requiereRol('profesor'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'editar-cuestionario.html')));
app.get('/lista-cuestionarios', requiereRol('profesor'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'lista-cuestionarios.html')));
app.get('/estudiante', requiereRol('estudiante'), (_, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'panel-estudiante.html')));
app.get('/lista-respuestas', requiereRol('profesor'),(req, res) => {res.sendFile(path.join(__dirname, 'public', 'html', 'lista-respuestas-estudiantes.html'));});
app.get('/lista-cuestionarios-estudiante', requiereRol('estudiante'), (_,res) =>res.sendFile(path.join(__dirname,'public','html','responder-cuestionario-profe.html')));
app.get('/memoria',(_,res) =>res.sendFile(path.join(__dirname,'public','html','juego-didactico.html')));
//-------------------- Rutas API --------------------//
app.use('/api', require('./routes/api'));
app.use('/api/usuarios', usuariosRouter);
app.get('/api/cuestionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cuestionario = await Cuestionario.findByPk(id, {
      include: [{ model: Pregunta, as: 'preguntas' }]
    });

    if (!cuestionario) {
      return res.status(404).json({ error: 'Cuestionario no encontrado' });
    }

    res.json(cuestionario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el cuestionario' });
  }
});
//-------------------- Logout --------------------//
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/iniciar-sesion'));
});

//-------------------- Guardar Contenido --------------------//
app.post('/admin/contenido', requiereRol('profesor'), upload.single('imagen'), async (req, res) => {
  const { titulo, subtitulo, descripcion, alt } = req.body;
  const imagenPath = req.file ? '/uploads/' + req.file.filename : '';
  try {
    await Contenido.create({ titulo, subtitulo, descripcion, imagen: imagenPath, alt });
    res.redirect('/admin');
  } catch (error) {
    console.error('Error al guardar contenido:', error);
    res.status(500).send('Error al guardar el contenido.');
  }
});

//-------------------- Login de Usuario --------------------//
app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(400).json({ error: 'Contraseña incorrecta.' });
    }

    if (!usuario.verified) {
      return res.json({ verify: true, email: usuario.email });
    }

    req.session.usuarioId = usuario.id;
    req.session.rol = usuario.rol;

    return res.json({ success: true, rol: usuario.rol });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

//-------------------- Reenviar código de verificación --------------------//
app.post('/reenviar-verificacion', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requerido.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (usuario.verified) {
      return res.status(400).json({ error: 'La cuenta ya está verificada.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await usuario.update({ verificationCode: newCode });

    await transporter.sendMail({
      from: `"Quizorium" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: 'Tu nuevo código de verificación',
      html: `
<div style="
  background-color:#F2F6FA;
  padding:40px 0;
  font-family:Arial,Helvetica,sans-serif;
">
  <div style="
    max-width:600px;
    margin:auto;
    background:#FFFFFF;
    border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.1);
    overflow:hidden;
  ">

    <div style="
      background-color:#003DA5;
      color:#FFFFFF;
      padding:24px;
      text-align:center;
    ">
      <h1 style="margin:0;font-size:26px;">
        🔐 Verifica tu cuenta
      </h1>
    </div>

    <div style="padding:30px;color:#212529;text-align:center;">
      <p style="font-size:16px;">
        Estás a un paso de activar tu cuenta en <strong>Quizorium</strong>
      </p>

      <p style="font-size:15px;margin-top:20px;">
        Tu código de verificación es:
      </p>

      <div style="
        margin:25px auto;
        display:inline-block;
        background-color:#F2F6FA;
        border:2px dashed #003DA5;
        border-radius:8px;
        padding:15px 30px;
        font-size:28px;
        font-weight:bold;
        color:#003DA5;
        letter-spacing:4px;
      ">
        ${newCode}
      </div>

      <p style="font-size:14px;line-height:1.6;margin-top:20px;">
        Ingresa este código en la página para completar tu registro.
      </p>

      <p style="font-size:13px;color:#6C757D;margin-top:30px;">
        Si no solicitaste este registro, puedes ignorar este correo con tranquilidad.
      </p>
    </div>

    <div style="
      background-color:#F2F6FA;
      text-align:center;
      padding:15px;
      font-size:12px;
      color:#6C757D;
    ">
      © ${new Date().getFullYear()} Quizorium · Aprende jugando
    </div>

  </div>
</div>
`
    });

    res.json({ success: true, message: 'Nuevo código enviado.' });
  } catch (error) {
    console.error('Error reenviando verificación:', error);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación.' });
  }
});

//-------------------- Login de Administrador --------------------//
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email, rol: 'profesor' } });
    if (!usuario) return res.send('Usuario no autorizado.');

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.send('Contraseña incorrecta.');

    req.session.usuarioId = usuario.id;
    req.session.rol = usuario.rol;
    res.redirect('/admin');
  } catch (err) {
    console.error('Error en ingreso admin:', err);
    res.send('Error al intentar ingresar.');
  }
});
//-------------------- Configuración de Nodemailer --------------------//
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true si usas el puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  requireTLS: true,
  tls: {
    rejectUnauthorized: false
  }

});

transporter.verify()
  .then(() => console.log('SMTP listo para enviar correos'))
  .catch(err => console.error('SMTP NO funcional:', err));


//-------------------- Registro de Usuario con Código --------------------//
app.post('/registro', async (req, res) => {
  const { nombre, password, confirmPassword } = req.body;
  const email = req.body.email.trim().toLowerCase();

  // Validaciones básicas
  if (!nombre || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Por favor completa todos los campos.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  try {
    // Validar si ya existe el usuario
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo.' });
    }

    const existeNombre = await Usuario.findOne({ where: { nombre } });
    if (existeNombre) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese nombre.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Crear usuario sin verificar aún
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'estudiante',
      verificationCode,
      verified: false
    });

    // Enviar correo con código
    const info = await transporter.sendMail({
      from: `"Quizorium" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Tu código de verificación',
      html:  `
<div style="
  background-color:#F2F6FA;
  padding:40px 0;
  font-family:Arial,Helvetica,sans-serif;
">
  <div style="
    max-width:600px;
    margin:auto;
    background:#FFFFFF;
    border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.1);
    overflow:hidden;
  ">

    <div style="
      background-color:#003DA5;
      color:#FFFFFF;
      padding:24px;
      text-align:center;
    ">
      <h1 style="margin:0;font-size:26px;">
        🔐 Verifica tu cuenta
      </h1>
    </div>

    <div style="padding:30px;color:#212529;text-align:center;">
      <p style="font-size:16px;">
        Estás a un paso de activar tu cuenta en <strong>Quizorium</strong>
      </p>

      <p style="font-size:15px;margin-top:20px;">
        Tu código de verificación es:
      </p>

      <div style="
        margin:25px auto;
        display:inline-block;
        background-color:#F2F6FA;
        border:2px dashed #003DA5;
        border-radius:8px;
        padding:15px 30px;
        font-size:28px;
        font-weight:bold;
        color:#003DA5;
        letter-spacing:4px;
      ">
        ${verificationCode}
      </div>

      <p style="font-size:14px;line-height:1.6;margin-top:20px;">
        Ingresa este código en la página para completar tu registro.
      </p>

      <p style="font-size:13px;color:#6C757D;margin-top:30px;">
        Si no solicitaste este registro, puedes ignorar este correo con tranquilidad.
      </p>
    </div>

    <div style="
      background-color:#F2F6FA;
      text-align:center;
      padding:15px;
      font-size:12px;
      color:#6C757D;
    ">
      © ${new Date().getFullYear()} Quizorium · Aprende jugando
    </div>

  </div>
</div>
`
    });
    console.log('EMAIL RESULTADO:', info);

    const info = await transporter.sendMail({
      from: `"Quizorium" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bienvenido a Quizorium',
      html: `
  <div style="
    background-color: #F2F6FA;
    padding: 40px 0;
    font-family: Arial, Helvetica, sans-serif;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    ">
      <div style="
        background-color: #003DA5;
        color: #FFFFFF;
        padding: 24px;
        text-align: center;
      ">
        <h1 style="margin: 0; font-size: 26px;">🎉 Bienvenido a Quizorium</h1>
      </div>

      <div style="padding: 30px; color: #212529;">
        <p style="font-size: 16px;">
          Hola <strong>${nombre}</strong>,
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Gracias por registrarte en <strong>Quizorium</strong>.  
          Estamos felices de tenerte aquí.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Quizorium es un espacio donde aprender, evaluar y crecer se vuelve
          interactivo y divertido. Ya diste el primer paso.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000"
            style="
              background-color: #f6ca48;
              color: #212529;
              padding: 12px 22px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            ">
            Ir a Quizorium
          </a>
        </div>

        <p style="font-size: 13px; color: #6C757D;">
          Si no fuiste tú quien se registró, puedes ignorar este correo.
        </p>
      </div>

      <div style="
        background-color: #F2F6FA;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #6C757D;
      ">
        © ${new Date().getFullYear()} Quizorium · Aprende jugando
      </div>
    </div>
  </div>
`})

    return res.json({
      success: true,
      message: 'Te enviamos un código de verificación.',
      email
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
  }

});
console.log('EMAIL RESULTADO:', info);

//-------------------- Verificación del Código Enviado por Correo --------------------//
app.post('/verificar-codigo', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Correo y código requeridos.' });
  }

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(400).json({ error: 'Usuario no encontrado.' });
  }

  if (usuario.verificationCode !== code) {
    return res.status(400).json({ error: 'Código incorrecto.' });
  }

  await usuario.update({
    verified: true,
    verificationCode: null
  });

  // 🔥 crear sesión
  req.session.usuarioId = usuario.id;
  req.session.rol = usuario.rol;

  // 🚀 decidir a dónde va
  const redirectTo =
    usuario.rol === 'profesor' ? '/admin' : '/estudiante';

  return res.json({
    success: true,
    redirectTo
  });
});


//-------------------- Crear Cuestionario --------------------//
app.post(
  '/crear-cuestionario',
  requiereRol('profesor'),
  upload.any(),                // <— acepta todos los campos file
  async (req, res) => {
    try {
      // 1) Extraemos campos normales
      const { titulo, descripcion, texto, tipo } = req.body;
      const respuestasObj = req.body.respuesta || {};
      const opcionesObj   = req.body.opciones   || {};
      const textosArr     = Array.isArray(texto) ? texto : [texto];
      const tiposArr      = Array.isArray(tipo)  ? tipo  : [tipo];

      // 2) Mapear archivos por índice extrayendo de fieldname "imagen[<idx>]"
      const archivosMap = {};
      (req.files || []).forEach(file => {
        const m = file.fieldname.match(/^imagen\[(\d+)\]$/);
        if (m) archivosMap[+m[1]] = file;
      });

      // 3) Crear el cuestionario
      const nuevo = await Cuestionario.create({ titulo, descripcion });

      // 4) Crear cada pregunta con su imagen correspondiente
      for (let i = 0; i < textosArr.length; i++) {
        const opcionesArr    = opcionesObj[i]
          ? (Array.isArray(opcionesObj[i]) 
             ? opcionesObj[i] 
             : [opcionesObj[i]])
          : null;
        const valorRespuesta = respuestasObj[i];
        const file          = archivosMap[i];
        const imgPath       = file ? `/uploads/${file.filename}` : null;

        await Pregunta.create({
          texto:          textosArr[i],
          tipo:           tiposArr[i],
          opciones:       opcionesArr,
          respuesta:      valorRespuesta,
          imagen:         imgPath,
          cuestionarioId: nuevo.id
        });
      }

      // 5) Redirigir
      return res.redirect('/docente');
    } catch (error) {
      console.error('Error al crear cuestionario:', error);
      return res.status(500).send('Error interno del servidor.');
    }
  }
);


//-------------------- Obtener Cuestionarios --------------------//
app.get('/cuestionarios', async (_, res) => {
  try {
    const lista = await Cuestionario.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener cuestionarios:', error);
    res.status(500).json({ error: 'Error al obtener los cuestionarios' });
  }
});

//-------------------- Obtener sesión actual --------------------//
app.get('/api/sesion', async (req, res) => {
  if (!req.session.usuarioId) {
    return res.json({ autenticado: false });
  }

  const usuario = await Usuario.findByPk(req.session.usuarioId);

  res.json({
    autenticado: true,
    usuarioId: usuario.id,
    rol: usuario.rol,
    email: usuario.email,
    nombre: usuario.nombre
  });
});

//-------------------- Guardar información de leucemia --------------------//
app.post('/leucemia', requiereRol('profesor'), async (req, res) => {
  const { tipo, subtipo, descripcion, imagen } = req.body;
  try {
    const [tipoLeucemia] = await TipoLeucemia.findOrCreate({ where: { nombre: tipo } });

    const [subtipoLeucemia] = await SubtipoLeucemia.findOrCreate({
      where: { nombre: subtipo, tipoLeucemiaId: tipoLeucemia.id }
    });

    await leucemiaEspecifica.create({
      descripcion,
      imagen,
      subtipoLeucemiaId: subtipoLeucemia.id
    });

    res.send("Información guardada correctamente.");
  } catch (error) {
    console.error("Error al guardar info:", error);
    res.status(500).send("Error al guardar la información.");
  }
});

//-------------------- Obtener contenido por ID --------------------//
app.get('/api/contenido/:id', async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) return res.status(404).send('Contenido no encontrado');
    res.json(contenido);
  } catch (err) {
    console.error('Error al obtener contenido por ID:', err);
    res.status(500).send('Error al obtener el contenido');
  }
});

//-------------------- Editar contenido existente --------------------//
app.put('/api/contenido/:id', requiereRol('profesor'), async (req, res) => {
  const { titulo, subtitulo, descripcion, alt } = req.body;
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) return res.status(404).send('Contenido no encontrado');

    await contenido.update({ titulo, subtitulo, descripcion, alt });

    res.send('Contenido actualizado exitosamente');
  } catch (err) {
    console.error('Error al actualizar contenido:', err);
    res.status(500).send('Error al actualizar el contenido');
  }
});
/*
//-------------------- Inicio sesión con Google --------------------//
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//-------------------- Callback de Google --------------------//
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/iniciar-sesion' }),
  (req, res) => {
    req.session.usuarioId = req.user.id;
    req.session.rol = req.user.rol;
    res.redirect('/estudiante');
  }
);
*/
//-------------------- Manejo de rutas no encontradas (404) --------------------//
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'html', '404.html'));
});

//-------------------- Inicializar Servidor y DB --------------------//
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');

    (async () => {
      const adminExists = await Usuario.findOne({ where: { email: 'admin@quizorium.com' } });

      if (!adminExists) {
        const hashed = await bcrypt.hash('Delgado@2023', 10);
        await Usuario.create({
          nombre: 'Admin',
          email: 'admin@quizorium.com',
          password: hashed,
          rol: 'profesor'
        });
        console.log('Usuario admin creado: admin@quizorium.com / Delgado@2023');
      } else {
        console.log('El usuario admin ya existe.');
      }
    })();

    app.listen(PORT, () => {
      console.log(`QuizOrium corriendo en: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
