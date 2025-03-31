# Evaluación de Factores de Riesgo Psicosocial - Frontend

Este proyecto corresponde a la parte **Frontend** de una aplicación diseñada para evaluar factores de riesgo psicosocial en entornos laborales. Proporciona una interfaz de usuario intuitiva y funcional para interactuar con los datos y realizar evaluaciones.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Un navegador web moderno (Google Chrome, Firefox, etc.)

---

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/evaluacion-riesgo-frontend.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd evaluacion-riesgo-frontend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   # o si usas Yarn
   yarn install
   ```

---

## Ejecución

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm start
# o si usas Yarn
yarn start
```

Esto abrirá la aplicación en tu navegador en la dirección `http://localhost:3000`.

---

## Estructura del Proyecto

```
evaluacion-riesgo-frontend/
├── public/               # Archivos estáticos
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── services/         # Lógica para consumir APIs
│   ├── App.js            # Componente principal
│   └── index.js          # Punto de entrada
├── package.json          # Configuración del proyecto
└── README.md             # Documentación
```

---

## Tecnologías Utilizadas

- **React.js**: Biblioteca principal para la construcción de la interfaz de usuario.
- **Axios**: Para realizar solicitudes HTTP.
- **React Router**: Para la navegación entre páginas.
- **CSS Modules**: Para estilos encapsulados.
- **ESLint y Prettier**: Para mantener un código limpio y consistente.

---

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Envía un pull request.

---

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
