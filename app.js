async function cargarDatos() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderizarWebQuest(data);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    mostrarError();
  }
}

function renderizarWebQuest(data) {
  renderizarIntroduccion(data.introduccion);
  renderizarTarea(data.tarea);
  renderizarProceso(data.proceso);
  renderizarRecursos(data.recursos);
  renderizarEvaluacion(data.evaluacion);
  renderizarConclusion(data.conclusion);
  renderizarCreditos(data.creditos);
}

function renderizarIntroduccion(intro) {
  document.getElementById('intro-text').innerHTML = intro.texto.replace(/\n/g, '<br><br>');
  document.getElementById('intro-objetivo').textContent = intro.objetivo;
}

function renderizarTarea(tarea) {
  document.getElementById('tarea-descripcion').textContent = tarea.descripcion;

  const requisitosUl = document.getElementById('tarea-requisitos');
  tarea.requisitos.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req;
    requisitosUl.appendChild(li);
  });
}

function renderizarProceso(proceso) {
  const contenedorFases = document.getElementById('proceso-fases');

  proceso.fases.forEach(fase => {
    const faseDiv = document.createElement('div');
    faseDiv.className = 'fase';

    const titulo = document.createElement('h4');
    titulo.textContent = fase.titulo;
    faseDiv.appendChild(titulo);

    const contenido = document.createElement('div');
    contenido.className = 'fase-content';

    fase.actividades.forEach(actividad => {
      const actividadDiv = document.createElement('div');
      actividadDiv.style.marginBottom = '1.5rem';

      const nombreP = document.createElement('p');
      nombreP.innerHTML = `<strong>${actividad.nombre}:</strong>`;
      actividadDiv.appendChild(nombreP);

      const descripcionP = document.createElement('p');
      descripcionP.textContent = actividad.descripcion;
      descripcionP.style.marginLeft = '1rem';
      actividadDiv.appendChild(descripcionP);

      // Si hay subtareas
      if (actividad.subtareas && actividad.subtareas.length > 0) {
        const subtareasUl = document.createElement('ul');
        subtareasUl.className = 'subfase';
        actividad.subtareas.forEach(subtarea => {
          const li = document.createElement('li');
          li.textContent = subtarea;
          subtareasUl.appendChild(li);
        });
        actividadDiv.appendChild(subtareasUl);
      }

      contenido.appendChild(actividadDiv);
    });

    faseDiv.appendChild(contenido);
    contenedorFases.appendChild(faseDiv);
  });
}

function renderizarRecursos(recursos) {
  const contenedorRecursos = document.getElementById('recursos-lista');

  recursos.forEach(recurso => {
    const card = document.createElement('div');
    card.className = 'recurso-card';

    const titulo = document.createElement('h4');
    titulo.textContent = recurso.titulo;
    card.appendChild(titulo);

    const descripcion = document.createElement('p');
    descripcion.textContent = recurso.descripcion;
    card.appendChild(descripcion);

    if (recurso.placeholder || !recurso.url) {
      const placeholder = document.createElement('p');
      placeholder.className = 'recurso-placeholder';
      placeholder.textContent = '[Alex del futuro: Acá va el enlace aquí]';
      card.appendChild(placeholder);
    } else {
      const link = document.createElement('a');
      link.href = recurso.url;
      link.target = '_blank';
      link.className = 'recurso-link';
      link.textContent = 'Visitar recurso →';
      card.appendChild(link);
    }

    contenedorRecursos.appendChild(card);
  });
}

function renderizarEvaluacion(evaluacion) {
  const tbody = document.getElementById('evaluacion-tbody');

  evaluacion.criterios.forEach(criterio => {
    const tr = document.createElement('tr');

    const tdCriterio = document.createElement('td');
    tdCriterio.textContent = criterio.criterio;
    tr.appendChild(tdCriterio);

    const tdDescripcion = document.createElement('td');
    tdDescripcion.textContent = criterio.descripcion;
    tr.appendChild(tdDescripcion);

    const tdPuntaje = document.createElement('td');
    tdPuntaje.textContent = `____ / ${criterio.puntajeMaximo}`;
    tr.appendChild(tdPuntaje);

    tbody.appendChild(tr);
  });

  document.getElementById('evaluacion-total').textContent = `____ / ${evaluacion.totalMaximo}`;
}

function renderizarConclusion(conclusion) {
  document.getElementById('conclusion-text').innerHTML = conclusion.texto.replace(/\n/g, '<br><br>');
}

function renderizarCreditos(creditos) {
  const contenedor = document.getElementById('creditos-contenido');

  const autor = document.createElement('p');
  autor.innerHTML = `<strong>${creditos.autor}</strong>`;
  contenedor.appendChild(autor);

  const fecha = document.createElement('p');
  fecha.innerHTML = `<strong>${creditos.fecha}</strong>`;
  contenedor.appendChild(fecha);

  const agradecimientos = document.createElement('p');
  agradecimientos.style.marginTop = '1rem';
  agradecimientos.textContent = creditos.agradecimientos;
  contenedor.appendChild(agradecimientos);
}

function mostrarError() {
  document.querySelector('main').innerHTML = `
        <div class="section">
            <h2>Error</h2>
            <div class="content-box">
                <p>No se pudieron cargar los datos de la WebQuest. Por favor, Alex del futuro, verifica que el archivo data.json esté en el mismo directorio.</p>
            </div>
        </div>
    `;
}

function configurarNavegacion() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  configurarNavegacion();
  lucide.createIcons();
});
