// Envolva tudo em uma IIFE para evitar poluição do escopo global
(() => {
  // --- 1. CONFIGURAÇÃO DE TRADUÇÃO (I18N) ---
  const TEXTS = {
    pt: {
      lang: "pt-br",
      models: {
        writee: "Máquina de Escrever",
        tabuladora: "Máquina de Tabulação",
        uploaded: "Seu Modelo",
      },
      carouselTitle: "Modelos",
      btnPrevious: "Anterior",
      btnNext: "Próximo",
      loading: "Carregando",
      loadingError:
        "Erro ao carregar o modelo. O arquivo pode estar corrompido ou em formato incompatível.",
      fileError: "Por favor, selecione um arquivo GLB ou GLTF.",
      controls: {
        fullscreen: "Tela Cheia",
        exitFullscreen: "Sair da Tela Cheia",
        fixedView: "Vista Fixa",
        freeView: "Vista Livre",
        modeFixed: "Modo: Vista Fixa",
        modeFree: "Modo: Vista Livre",
      },
      annotations: {
        title: "Escreva aqui",
        close: "Fechar",
        placeholder: "Digite aqui...",
        save: "Salvar",
        edit: "Editar",
        clear: "Limpar",
        savedMsg: "Anotação salva!",
        clearedMsg: "Anotação limpa!",
        errorMsg: "Digite uma anotação antes de salvar.",
      },
      instructions: {
        title: "Como usar:",
        list: [
          "Selecione um modelo do carrossel para visualizá-lo",
          "Use as setas para navegar pelo carrossel de modelos",
          "Use o botão ⛶ no canto superior direito para visualizar em tela cheia",
          "Na <strong>vista fixa</strong>, um painel de anotações aparecerá no canto superior esquerdo",
          "Arraste com o botão esquerdo para rotacionar o modelo",
          "Use a roda do mouse para zoom in/out",
          "Arraste com o botão do meio para mover o modelo",
        ],
      },
      sphereKeys: {
        fixed: "Fixo",
        free: "Livre",
      },
    },
    en: {
      lang: "en",
      models: {
        writee: "Typewriter",
        tabuladora: "Tabulating Machine",
        uploaded: "Your Model",
      },
      carouselTitle: "Models",
      btnPrevious: "Previous",
      btnNext: "Next",
      loading: "Loading",
      loadingError:
        "Error loading model. The file may be corrupt or in an incompatible format.",
      fileError: "Please select a GLB or GLTF file.",
      controls: {
        fullscreen: "Fullscreen",
        exitFullscreen: "Exit Fullscreen",
        fixedView: "Fixed View",
        freeView: "Free View",
        modeFixed: "Mode: Fixed View",
        modeFree: "Mode: Free View",
      },
      annotations: {
        title: "Write here",
        close: "Close",
        placeholder: "Type here...",
        save: "Save",
        edit: "Edit",
        clear: "Clear",
        savedMsg: "Annotation saved!",
        clearedMsg: "Annotation cleared!",
        errorMsg: "Type an annotation before saving.",
      },
      instructions: {
        title: "How to use:",
        list: [
          "Select a model from the carousel to view it",
          "Use the arrows to navigate through the model carousel",
          "Use the ⛶ button in the top right corner to view in fullscreen",
          "In <strong>fixed view</strong>, an annotations panel will appear in the top left corner",
          "Drag with left button to rotate the model",
          "Use mouse wheel for zoom in/out",
          "Drag with middle button to move the model",
        ],
      },
      sphereKeys: {
        fixed: "Fixed",
        free: "Free",
      },
    },
  }; // Detecta o idioma da página e define os textos

  const pageLang = document.documentElement.lang.startsWith("en") ? "en" : "pt";
  const currentTexts = TEXTS[pageLang]; // --- 2. VARIÁVEIS GLOBAIS E ELEMENTOS DO DOM ---

  let scene, camera, renderer, controls, model;
  const viewerContainer = document.getElementById("model-viewer");
  const loadingIndicator = document.getElementById("loading");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const cameraControl = document.getElementById("camera-control");
  const cameraModeIndicator = document.getElementById("camera-mode-indicator");
  const carousel = document.getElementById("model-carousel");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("file-input");
  const annotationPanel = document.getElementById("annotation-panel");
  const annotationTextarea = document.getElementById("annotation-textarea");
  const annotationDisplay = document.getElementById("annotation-display");
  const annotationSave = document.getElementById("annotation-save");
  const annotationEdit = document.getElementById("annotation-edit");
  const annotationClear = document.getElementById("annotation-clear");
  const annotationClose = document.getElementById("annotation-close"); // Elementos para tradução

  const carouselTitleEl = document.getElementById("carousel-title");
  const annotationTitleEl = document.getElementById("annotation-title-text");
  const instructionsTitleEl = document.getElementById("instructions-title");
  const instructionsListEl = document.getElementById("instructions-list");

  let isFullscreen = false;
  let isCameraFixed = false;
  let originalCameraPosition = new THREE.Vector3(5, 5, 5);
  let originalControlsTarget = new THREE.Vector3(0, 0, 0);
  let currentModelIndex = 0;
  let currentAnnotation = "";
  let keySpheres = [];
  let keySphereGroup = new THREE.Group();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // Lista de modelos (o JS é o mesmo para PT e EN)

  let modelList = [
    {
      id: "writee", // ID para buscar o nome traduzido
      type: "preloaded",
      url: "writee.glb", // Caminho relativo à pasta /pags/modelos/
      thumbnail:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%234CAF50'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3Ewritee%3C/text%3E%3C/svg%3E",
    },
    {
      id: "tabuladora",
      type: "preloaded",
      url: "tabuladora.glb",
      thumbnail:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23C6862C'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3Etabuladora%3C/text%3E%3C/svg%3E",
    },
  ]; // --- 3. FUNÇÕES PRINCIPAIS ---

  function initScene() {
    // Aplica as traduções aos elementos estáticos
    applyStaticTranslations();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    camera = new THREE.PerspectiveCamera(
      45,
      viewerContainer.clientWidth / viewerContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.copy(originalCameraPosition);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    viewerContainer.innerHTML = "";
    viewerContainer.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(originalControlsTarget);
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    createKeySpheres();
    function animate() {
      requestAnimationFrame(animate);
      if (!isCameraFixed) {
        controls.update();
      }
      renderer.render(scene, camera);
    }
    animate();
    window.addEventListener("resize", resizeRendererToDisplaySize);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        resizeRendererToDisplaySize();
      });
      ro.observe(viewerContainer);
    }
    resizeRendererToDisplaySize();
    initCarousel();
    setupKeyboardEvents();
    loadModel(modelList[0]);
    setupUpload();
    setupAnnotationPanel();
  }

  function applyStaticTranslations() {
    // Títulos
    if (carouselTitleEl)
      carouselTitleEl.textContent = currentTexts.carouselTitle;
    if (annotationTitleEl)
      annotationTitleEl.textContent = currentTexts.annotations.title;
    if (instructionsTitleEl)
      instructionsTitleEl.textContent = currentTexts.instructions.title; // Botões

    if (prevBtn) prevBtn.title = currentTexts.btnPrevious;
    if (nextBtn) nextBtn.title = currentTexts.btnNext;
    if (fullscreenBtn) fullscreenBtn.title = currentTexts.controls.fullscreen;
    if (cameraControl) cameraControl.title = currentTexts.controls.fixedView;
    if (annotationClose) annotationClose.title = currentTexts.annotations.close;
    if (annotationSave)
      annotationSave.textContent = currentTexts.annotations.save;
    if (annotationEdit)
      annotationEdit.textContent = currentTexts.annotations.edit;
    if (annotationClear)
      annotationClear.textContent = currentTexts.annotations.clear; // Placeholders e indicadores

    if (annotationTextarea)
      annotationTextarea.placeholder = currentTexts.annotations.placeholder;
    if (cameraModeIndicator)
      cameraModeIndicator.textContent = currentTexts.controls.modeFixed;

    // Define o conteúdo do pseudo-elemento ::before via variável CSS
    // Nota: O CSS precisa ser ajustado para USAR esta variável
    if (cameraControl) {
      cameraControl.style.setProperty(
        "--content-fixed",
        `'${currentTexts.sphereKeys.fixed}'`
      );
      cameraControl.style.setProperty(
        "--content-free",
        `'${currentTexts.sphereKeys.free}'`
      );
      // Define o valor inicial
      cameraControl.style.setProperty(
        "--content-before",
        `'${currentTexts.sphereKeys.fixed}'`
      );
    } // Lista de Instruções

    if (instructionsListEl) {
      instructionsListEl.innerHTML = "";
      currentTexts.instructions.list.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = item;
        instructionsListEl.appendChild(li);
      });
    }
  }

  function resizeRendererToDisplaySize() {
    if (!renderer || !camera) return;
    const width = viewerContainer.clientWidth || viewerContainer.offsetWidth;
    const height = viewerContainer.clientHeight || viewerContainer.offsetHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
  }

  function createKeySpheres() {
    keySphereGroup = new THREE.Group();
    keySpheres = [];
    const spherePositions = [
      [-0.17, 1.33, 0.13, 0.013],
      [-0.16, 1.35, 0.09, 0.013],
      [-0.12, 1.35, 0.09, 0.013],
      [-0.08, 1.35, 0.09, 0.013],
      [-0.04, 1.35, 0.09, 0.013],
      [-0.0, 1.35, 0.09, 0.013],
      [0.04, 1.35, 0.09, 0.013],
      [0.08, 1.35, 0.09, 0.013],
      [0.12, 1.35, 0.09, 0.013],
      [0.16, 1.35, 0.09, 0.013],
      [-0.2, 1.35, 0.09, 0.013],
      [0.15, 1.33, 0.13, 0.013],
      [-0.09, 1.33, 0.13, 0.013],
      [-0.05, 1.33, 0.13, 0.013],
      [-0.01, 1.33, 0.13, 0.013],
      [0.03, 1.33, 0.13, 0.013],
      [0.07, 1.33, 0.13, 0.013],
      [0.11, 1.33, 0.13, 0.013],
      [-0.13, 1.33, 0.13, 0.013],
      [-0.14, 1.31, 0.17, 0.013],
      [-0.1, 1.31, 0.17, 0.013],
      [-0.06, 1.31, 0.17, 0.013],
      [-0.02, 1.31, 0.17, 0.013],
      [0.02, 1.31, 0.17, 0.013],
      [0.06, 1.31, 0.17, 0.013],
      [0.1, 1.31, 0.17, 0.013],
    ];
    const whiteMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      shininess: 30,
    });
    const grayMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.9,
      shininess: 30,
    });
    for (let i = 0; i < 26; i++) {
      const geometry = new THREE.SphereGeometry(
        spherePositions[i] ? spherePositions[i][3] : 0.2,
        16,
        16
      );
      const sphere = new THREE.Mesh(geometry, whiteMaterial.clone());
      if (spherePositions[i]) {
        sphere.position.set(
          spherePositions[i][0],
          spherePositions[i][1],
          spherePositions[i][2]
        );
      } else {
        sphere.position.set((i % 9) - 4, Math.floor(i / 9), 0);
      }
      const sphereData = {
        mesh: sphere,
        whiteMaterial: whiteMaterial.clone(),
        grayMaterial: grayMaterial.clone(),
        key: alphabet[i] || "?",
        isActive: false,
      };
      keySphereGroup.add(sphere);
      keySpheres.push(sphereData);
    }
    scene.add(keySphereGroup);

    // Define o conteúdo do pseudo-elemento ::before
    const beforeContent = isCameraFixed
      ? currentTexts.sphereKeys.free
      : currentTexts.sphereKeys.fixed;
    if (cameraControl)
      cameraControl.style.setProperty("--content-before", `'${beforeContent}'`);
  }
  function setupKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toUpperCase();
      const sphereIndex = alphabet.indexOf(key);
      if (sphereIndex !== -1 && sphereIndex < keySpheres.length) {
        activateSphere(sphereIndex);
      }
    });
    document.addEventListener("keyup", (e) => {
      const key = e.key.toUpperCase();
      const sphereIndex = alphabet.indexOf(key);
      if (sphereIndex !== -1 && sphereIndex < keySpheres.length) {
        deactivateSphere(sphereIndex);
      }
    });
  }
  function activateSphere(index) {
    if (!keySpheres || !keySpheres.length) return;
    const sphereData = keySpheres[index];
    if (!sphereData || sphereData.isActive) return;
    sphereData.mesh.material = sphereData.grayMaterial;
    sphereData.isActive = true;
    sphereData.mesh.scale.set(1.2, 1.2, 1.2);
  }
  function deactivateSphere(index) {
    if (!keySpheres || !keySpheres.length) return;
    const sphereData = keySpheres[index];
    if (!sphereData || !sphereData.isActive) return;
    sphereData.mesh.material = sphereData.whiteMaterial;
    sphereData.isActive = false;
    sphereData.mesh.scale.set(1, 1, 1);
  }
  function setupUpload() {
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
          addUploadedModel(file);
        } else {
          alert(currentTexts.fileError);
        }
      }
    });
  }
  function setupAnnotationPanel() {
    annotationSave.addEventListener("click", () => {
      currentAnnotation = annotationTextarea.value.trim();
      if (currentAnnotation) {
        annotationDisplay.textContent = currentAnnotation;
        annotationTextarea.style.display = "none";
        annotationDisplay.style.display = "block";
        annotationSave.style.display = "none";
        annotationEdit.style.display = "inline-block";
        showTempMessage(currentTexts.annotations.savedMsg, "success");
      } else {
        showTempMessage(currentTexts.annotations.errorMsg, "error");
      }
    });
    annotationEdit.addEventListener("click", () => {
      annotationTextarea.value = currentAnnotation;
      annotationTextarea.style.display = "block";
      annotationDisplay.style.display = "none";
      annotationSave.style.display = "inline-block";
      annotationEdit.style.display = "none";
      annotationTextarea.focus();
    });
    annotationClear.addEventListener("click", () => {
      annotationTextarea.value = "";
      currentAnnotation = "";
      annotationDisplay.textContent = "";
      annotationTextarea.style.display = "block";
      annotationDisplay.style.display = "none";
      annotationSave.style.display = "inline-block";
      annotationEdit.style.display = "none";
      showTempMessage(currentTexts.annotations.clearedMsg, "success");
    });
    annotationClose.addEventListener("click", () => {
      annotationPanel.classList.remove("visible");
    });
  }
  function showTempMessage(message, type) {
    const messageEl = document.createElement("div");
    messageEl.textContent = message;
    messageEl.style.cssText = `position: fixed;top: 20px;right: 20px;background: ${
      type === "success" ? "#4CAF50" : "#f44336"
    };color: white;padding: 10px 15px;border-radius: 5px;z-index: 1000;font-size: 0.9rem;box-shadow: 0 4px 12px rgba(0,0,0,0.3)`;
    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }
  function addUploadedModel(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const objectUrl = URL.createObjectURL(file);
      const newModel = {
        id: "uploaded", // ID para tradução
        name: file.name.replace(/\.[^/.]+$/, ""), // Nome original como fallback
        type: "uploaded",
        file: file,
        objectUrl: objectUrl,
        thumbnail:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23673ab7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3E" +
          file.name.replace(/\.[^/.]+$/, "").substring(0, 12) +
          "%3C/text%3E%3C/svg%3E",
      };
      modelList.push(newModel);
      initCarousel();
      currentModelIndex = modelList.length - 1;
      document.querySelectorAll(".carousel-item").forEach((item, index) => {
        item.classList.toggle("active", index === currentModelIndex);
      });
      loadModel(newModel);
    };
    reader.readAsArrayBuffer(file); // Alterado para ArrayBuffer
  }
  function initCarousel() {
    carousel.innerHTML = "";
    modelList.forEach((modelData, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.className = "carousel-item";
      if (index === currentModelIndex) carouselItem.classList.add("active");
      const img = document.createElement("img");
      img.src = modelData.thumbnail;
      img.alt = modelData.name;
      const modelName = document.createElement("div");
      modelName.className = "model-name";
      // Usa o nome traduzido
      modelName.textContent =
        currentTexts.models[modelData.id] || modelData.name;
      carouselItem.appendChild(img);
      carouselItem.appendChild(modelName);
      carouselItem.addEventListener("click", () => {
        document.querySelectorAll(".carousel-item").forEach((item) => {
          item.classList.remove("active");
        });
        carouselItem.classList.add("active");
        currentModelIndex = index;
        loadModel(modelData);
      });
      carousel.appendChild(carouselItem);
    });
    prevBtn.addEventListener("click", () => {
      navigateCarousel(-1);
    });
    nextBtn.addEventListener("click", () => {
      navigateCarousel(1);
    });
  }
  function navigateCarousel(direction) {
    let newIndex = currentModelIndex + direction;
    if (newIndex < 0) {
      newIndex = modelList.length - 1;
    } else if (newIndex >= modelList.length) {
      newIndex = 0;
    }
    document.querySelectorAll(".carousel-item").forEach((item, index) => {
      item.classList.toggle("active", index === newIndex);
    });
    const activeItem = document.querySelectorAll(".carousel-item")[newIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    currentModelIndex = newIndex;
    loadModel(modelList[newIndex]);
  }
  function loadModel(modelData) {
    loadingIndicator.style.display = "block";
    const modelName = currentTexts.models[modelData.id] || modelData.name;
    loadingIndicator.textContent = `${currentTexts.loading} ${modelName}...`;
    if (model) {
      scene.remove(model);
    }
    if (modelData.type === "preloaded") {
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelData.url,
        (gltf) => {
          model = gltf.scene;

          // Position correction: move model up so its bbox.min.y sits at y=0
          try {
            const bbox = new THREE.Box3().setFromObject(model);
            const minY = bbox.min.y || 0;
            if (minY !== 0) {
              model.position.y -= minY;
            }
          } catch (e) {
            // ignore bbox errors
          }

          scene.add(model);

          // Manage key spheres and UI depending on model id
          // Remove existing key spheres first
          if (keySphereGroup && keySphereGroup.parent) {
            try {
              scene.remove(keySphereGroup);
            } catch (e) {}
            keySpheres = [];
          }

          // If the loaded model is the writee (typewriter), recreate key spheres
          if (modelData.id === "writee") {
            createKeySpheres();
          }

          // For tabuladora, rotate so it faces the camera and disable fixed-view/annotations
          if (modelData.id === "tabuladora") {
            try {
              // apply a Y rotation so the front points toward the camera
              model.rotation.set(0, -Math.PI / 2, 0);
            } catch (e) {}
            if (cameraControl) cameraControl.style.display = "none";
            if (cameraModeIndicator) cameraModeIndicator.style.display = "none";
            if (annotationPanel) annotationPanel.style.display = "none";
          } else {
            if (cameraControl) cameraControl.style.display = "";
            if (cameraModeIndicator) cameraModeIndicator.style.display = "";
            if (annotationPanel) annotationPanel.style.display = "";
          }

          adjustCamera();
          loadingIndicator.style.display = "none";
        },
        (xhr) => {
          loadingIndicator.textContent = `${
            currentTexts.loading
          } ${modelName}... ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
        },
        (error) => {
          loadingIndicator.style.display = "none";
          alert(currentTexts.loadingError);
        }
      );
    } else if (modelData.type === "uploaded") {
      const loader = new THREE.GLTFLoader();
      const reader = new FileReader();
      reader.onload = function (e) {
        loader.parse(
          e.target.result,
          "",
          (gltf) => {
            model = gltf.scene;

            // position correction
            try {
              const bbox = new THREE.Box3().setFromObject(model);
              const minY = bbox.min.y || 0;
              if (minY !== 0) model.position.y -= minY;
            } catch (e) {}

            scene.add(model);

            // Remove key spheres for uploaded models by default
            if (keySphereGroup && keySphereGroup.parent) {
              try {
                scene.remove(keySphereGroup);
              } catch (e) {}
              keySpheres = [];
            }

            // uploaded models: hide fixed view/annotation UI
            if (cameraControl) cameraControl.style.display = "none";
            if (cameraModeIndicator) cameraModeIndicator.style.display = "none";
            if (annotationPanel) annotationPanel.style.display = "none";

            adjustCamera();
            loadingIndicator.style.display = "none";
          },
          (error) => {
            loadingIndicator.style.display = "none";
            alert(currentTexts.loadingError);
            console.error(error);
          }
        );
      };
      reader.readAsArrayBuffer(modelData.file);
    }
  }
  function adjustCamera() {
    if (!model) return;
    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    cameraZ *= 1.5;
    camera.position.copy(center);
    camera.position.z += cameraZ;
    camera.lookAt(center);
    controls.target.copy(center);
    controls.update();
    originalCameraPosition.copy(camera.position);
    originalControlsTarget.copy(controls.target);
    if (isCameraFixed) {
      toggleCameraView();
    }
  }
  function toggleCameraView() {
    if (!model) return;
    // disable fixed view toggle for tabuladora model
    if (
      modelList[currentModelIndex] &&
      modelList[currentModelIndex].id === "tabuladora"
    )
      return;
    isCameraFixed = !isCameraFixed;
    if (isCameraFixed) {
      const bbox = new THREE.Box3().setFromObject(model);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
      const fixedPosition = new THREE.Vector3(
        center.x,
        center.y + 0.4,
        center.z - 0.27 + cameraZ * 1.5
      );
      controls.enabled = false;
      animateCameraToPosition(fixedPosition, center);
      cameraControl.classList.add("fixed");
      cameraControl.setAttribute("title", currentTexts.controls.freeView);
      if (cameraControl)
        cameraControl.style.setProperty(
          "--content-before",
          `'${currentTexts.sphereKeys.free}'`
        );
      cameraModeIndicator.textContent = currentTexts.controls.modeFixed;
      cameraModeIndicator.classList.add("visible");
      annotationPanel.classList.add("visible");
    } else {
      controls.enabled = true;
      animateCameraToPosition(originalCameraPosition, originalControlsTarget);
      cameraControl.classList.remove("fixed");
      cameraControl.setAttribute("title", currentTexts.controls.fixedView);
      if (cameraControl)
        cameraControl.style.setProperty(
          "--content-before",
          `'${currentTexts.sphereKeys.fixed}'`
        );
      cameraModeIndicator.textContent = currentTexts.controls.modeFree;
      annotationPanel.classList.remove("visible");
      setTimeout(() => {
        cameraModeIndicator.classList.remove("visible");
      }, 3000);
    }
  }
  function animateCameraToPosition(position, target) {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 1000;
    const startTime = Date.now();
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
      if (progress < 1) {
        camera.position.lerpVectors(startPosition, position, ease(progress));
        controls.target.lerpVectors(startTarget, target, ease(progress));
        camera.lookAt(controls.target);
        requestAnimationFrame(update);
      } else {
        camera.position.copy(position);
        controls.target.copy(target);
        camera.lookAt(controls.target);
      }
    }
    update();
  }
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
      document.body.classList.add("fullscreen");
      fullscreenBtn.innerHTML = "✕";
      fullscreenBtn.setAttribute("title", currentTexts.controls.exitFullscreen);
    } else {
      document.body.classList.remove("fullscreen");
      fullscreenBtn.innerHTML = "⛶";
      fullscreenBtn.setAttribute("title", currentTexts.controls.fullscreen);
    }
    setTimeout(() => {
      if (!camera || !renderer || !viewerContainer) return;
      camera.aspect =
        viewerContainer.clientWidth / Math.max(viewerContainer.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(
        viewerContainer.clientWidth,
        viewerContainer.clientHeight,
        false
      );
    }, 50);
  }
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  cameraControl.addEventListener("click", toggleCameraView);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isFullscreen) {
      toggleFullscreen();
    }
    if (e.key === "Escape" && isCameraFixed) {
      toggleCameraView();
    }
    if (e.key === "ArrowLeft") {
      navigateCarousel(-1);
    } else if (e.key === "ArrowRight") {
      navigateCarousel(1);
    }
  });
  window.onload = initScene;
})();
