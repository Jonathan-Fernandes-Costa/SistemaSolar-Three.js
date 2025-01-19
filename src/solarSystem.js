//===========================================================
// IMPORTAÇÕES E CONFIGURAÇÃO BÁSICA
//===========================================================
// Importação das três bibliotecas principais:
// - THREE.js: para renderização 3D
// - OrbitControls: para controle da câmera com mouse
// - CSS2DRenderer: para os textos que seguem os objetos
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from 'https://unpkg.com/three@0.127.0/examples/jsm/renderers/CSS2DRenderer.js';

export function initSolarSystem() {
  //////////////////////////////////////
  // Criação do renderizador WebGL que será responsável por exibir a cena
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Criação do renderizador de labels
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';  // Permite que os controles da câmera funcionem através dos labels
  document.body.appendChild(labelRenderer.domElement);

  //////////////////////////////////////
  // Criação do carregador de texturas que será usado para carregar todas as imagens
  const textureLoader = new THREE.TextureLoader();
  //////////////////////////////////////

  //////////////////////////////////////
  // Carregamento de todas as texturas necessárias para o sistema solar
  const caminhoTexturas = "../public/assets/texturas"

  const caminho2k = caminhoTexturas + "/2k"
  const caminho8k = caminhoTexturas + "/8k"
  const caminhoAneis = caminhoTexturas + "/aneis"

  const caminhoEstrelas2k = caminho2k + "/estrelas"
  const caminhoFundos2k = caminho2k + "/fundos"
  const caminhoLuas2k = caminho2k + "/luas"
  const caminhoPlanetas2k = caminho2k + "/planetas"

  const caminhoEstrelas8k = caminho8k + "/estrelas"
  const caminhoFundos8k = caminho8k + "/fundos"
  const caminhoLuas8k = caminho8k + "/luas"
  const caminhoPlanetas8k = caminho8k + "/planetas"

  let bgViaLactea = textureLoader.load(caminhoFundos2k + "/stars_milky_way.jpg");
  let bgEstrelas = textureLoader.load(caminhoFundos2k + "/stars.jpg");
  let sunTexture = textureLoader.load(caminhoEstrelas2k + "/sun.jpg");
  let mercuryTexture = textureLoader.load(caminhoPlanetas2k + "/mercury.jpg");
  let venusTexture = textureLoader.load(caminhoPlanetas2k + "/venus_surface.jpg");
  let earthTexture = textureLoader.load(caminhoPlanetas2k + "/earth_daymap.jpg");
  let marsTexture = textureLoader.load(caminhoPlanetas2k + "/mars.jpg");
  let jupiterTexture = textureLoader.load(caminhoPlanetas2k + "/jupiter.jpg");
  let saturnTexture = textureLoader.load(caminhoPlanetas2k + "/saturn.jpg");
  let uranusTexture = textureLoader.load(caminhoPlanetas2k + "/uranus.jpg");
  let neptuneTexture = textureLoader.load(caminhoPlanetas2k + "/neptune.jpg");
  let saturnRingTexture = textureLoader.load(caminhoAneis + "/saturn_ring.png");
  let uranusRingTexture = textureLoader.load(caminhoAneis + "/uranus_ring.png");
  let moonTexture = textureLoader.load(caminhoLuas2k + "/moon.jpg");

  // Carregamento das texturas para o sistema da equipe
  const teamTextures = {
    member1: textureLoader.load("../public/assets/fotos/ialis.jpg"),
    member2: textureLoader.load("../public/assets/fotos/jardel.jpg"),
    member3: textureLoader.load("../public/assets/fotos/wesley.jpg"),
    member4: textureLoader.load("../public/assets/fotos/alisson.jpg"),
    member5: textureLoader.load("../public/assets/fotos/jhon.jpg"),
    halo: textureLoader.load(caminhoAneis + "/saturn_ring.png"),
  };

  const texturePaths = {
    '2k': {
      estrelas: caminhoEstrelas2k,
      fundos: caminhoFundos2k,
      luas: caminhoLuas2k,
      planetas: caminhoPlanetas2k,
    },
    '8k': {
      estrelas: caminhoEstrelas8k,
      fundos: caminhoFundos8k,
      luas: caminhoLuas8k,
      planetas: caminhoPlanetas8k,
    },
  };
  //////////////////////////////////////

  //////////////////////////////////////
  // Criação da cena principal onde todos os objetos serão adicionados
  const scene = new THREE.Scene();
  //////////////////////////////////////

  //////////////////////////////////////
  // Definição da textura de fundo da cena
  let currentBg = 'via lactea';
  scene.background = bgViaLactea;
  //////////////////////////////////////

  //////////////////////////////////////
  // Configuração da câmera com perspectiva para visualização 3D
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-90, 140, 240);
  ////////////////////////////////////

  //////////////////////////////////////
  // Adição de controles orbitais para permitir navegação com mouse
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;  // Adiciona suavidade ao movimento da câmera
  //////////////////////////////////////

  //////////////////////////////////////
  // Criação do sol com geometria esférica e material básico
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(15, 50, 50),
    new THREE.MeshBasicMaterial({ map: sunTexture })
  );
  const sunLabel = createLabel('Sol');
  sunLabel.position.y = 20;
  sunLabel.visible = false;
  sun.add(sunLabel);
  scene.add(sun);

  //////////////////////////////////////
  // Adição de luz pontual emanando do sol para iluminar os planetas
  const sunLight = new THREE.PointLight(0xffffff, 4, 300);
  scene.add(sunLight);
  //////////////////////////////////////

  //////////////////////////////////////
  // Luz ambiente para iluminação geral da cena
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  //////////////////////////////////////

  /////////////////////////////////////
  // Função para gerar planetas com suas características (tamanho, textura, posição e anéis)
  const genratePlanet = (size, planetTexture, x, ring) => {
    const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const planetObj = new THREE.Object3D();
    planet.position.x = x;
    planetObj.add(planet);

    if (ring) {
      const ringGeometry = new THREE.RingGeometry(
        ring.innerRadius,
        ring.outerRadius,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ring.texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      planet.add(ringMesh);
    }

    return {
      planetObj,
      planet,
    };
  };

  // Antes dos planets, vamos criar o grupo Terra-Lua
  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  // Criar a Terra
  const earthObj = genratePlanet(6, earthTexture, 62);
  const earthLabel = createLabel('Terra');
  earthLabel.position.y = 10;
  earthLabel.visible = false;
  earthObj.planet.add(earthLabel);
  earthGroup.add(earthObj.planetObj);

  // Criar a Lua e seu objeto de órbita
  const moonObj = genratePlanet(1.5, moonTexture, 10);
  const moonLabel = createLabel('Lua');
  moonLabel.position.y = 3;
  moonLabel.visible = false;
  moonObj.planet.add(moonLabel);
  const moonOrbit = new THREE.Group();
  moonOrbit.position.x = 62; // Mesma distância da Terra ao Sol
  earthGroup.add(moonOrbit);
  moonOrbit.add(moonObj.planetObj);

  const planets = [
    {
      ...genratePlanet(3.2, mercuryTexture, 28),
      rotaing_speed_around_sun: 0.04,
      self_rotation_speed: 0.004,
      name: 'Mercúrio'
    },
    {
      ...genratePlanet(5.8, venusTexture, 44),
      rotaing_speed_around_sun: 0.015,
      self_rotation_speed: 0.002,
      name: 'Vênus'
    },
    {
      planetObj: earthGroup,
      planet: earthObj.planet,
      rotaing_speed_around_sun: 0.01,
      self_rotation_speed: 0.02,
      name: 'Terra'
    },
    {
      ...genratePlanet(6.1, marsTexture, 78),
      rotaing_speed_around_sun: 0.008,
      self_rotation_speed: 0.018,
      name: 'Marte'
    },
    {
      ...genratePlanet(12, jupiterTexture, 100),
      rotaing_speed_around_sun: 0.002,
      self_rotation_speed: 0.04,
      name: 'Júpiter'
    },
    {
      ...genratePlanet(10, saturnTexture, 138, {
        innerRadius: 12,
        outerRadius: 24,
        texture: saturnRingTexture
      }),
      rotaing_speed_around_sun: 0.0009,
      self_rotation_speed: 0.038,
      name: 'Saturno'
    },
    {
      ...genratePlanet(7, uranusTexture, 176, {
        innerRadius: 9,
        outerRadius: 15,
        texture: uranusRingTexture
      }),
      rotaing_speed_around_sun: 0.0004,
      self_rotation_speed: 0.03,
      name: 'Urano'
    },
    {
      ...genratePlanet(7, neptuneTexture, 200),
      rotaing_speed_around_sun: 0.0001,
      self_rotation_speed: 0.032,
      name: 'Netuno'
    },
  ];

  // Adicionar labels aos planetas
  planets.forEach(({ planet, name }) => {
    if (planet && name) {
      const label = createLabel(name);
      label.position.y = 10;
      label.visible = false;
      planet.add(label);
    }
  });

  // Função para gerar planeta sem iluminação para a equipe
  function generateTeamMember(size, texture, distance) {
    const orbit = new THREE.Object3D();
    const memberObj = new THREE.Object3D();
    memberObj.position.x = distance;
    const geometry = new THREE.SphereGeometry(size, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const member = new THREE.Mesh(geometry, material);
    memberObj.add(member);
    orbit.add(memberObj);
    return {
      planetObj: orbit,
      planet: member,
    };
  }

  // Função para criar label 2D
  function createLabel(name) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = name;
    div.style.color = 'white';
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    div.style.userSelect = 'none';
    return new CSS2DObject(div);
  }

  // Criar grupos para cada sistema
  const solarSystem = new THREE.Group();
  const teamSystem = new THREE.Group();
  scene.add(solarSystem);
  scene.add(teamSystem);

  // Mover todos os planetas do sistema solar para o grupo solarSystem
  solarSystem.add(sun);
  planets.forEach(({ planetObj }) => {
    solarSystem.add(planetObj);
  });

  // Criar o membro central (como o sol)
  const centralMemberGroup = new THREE.Group();
  const centralMember = new THREE.Mesh(
    new THREE.SphereGeometry(40, 50, 50),
    new THREE.MeshBasicMaterial({ map: teamTextures.member1 })
  );

  // Adicionar label ao membro central
  const centralLabel = createLabel('Ialis');
  centralLabel.position.y = 45;
  centralLabel.visible = false;  // Label começa oculto
  centralMember.add(centralLabel);

  // Criar a auréola
  const haloGeometry = new THREE.RingGeometry(45, 60, 32);
  const haloMaterial = new THREE.MeshBasicMaterial({
    map: teamTextures.halo,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.rotation.x = Math.PI / 2; // Rotaciona para ficar na horizontal
  halo.position.y = 40; // Posiciona acima da cabeça

  centralMemberGroup.add(centralMember);
  centralMemberGroup.add(halo);
  teamSystem.add(centralMemberGroup);

  // Criar planetas da equipe
  const teamPlanets = [
    {
      ...generateTeamMember(10, teamTextures.member2, 60),
      rotaing_speed_around_sun: 0.003,
      self_rotation_speed: 0.01,
      name: 'Jardel'
    },
    {
      ...generateTeamMember(10, teamTextures.member3, 90),
      rotaing_speed_around_sun: 0.004,
      self_rotation_speed: 0.01,
      name: 'Wesley'
    },
    {
      ...generateTeamMember(10, teamTextures.member4, 120),
      rotaing_speed_around_sun: 0.005,
      self_rotation_speed: 0.01,
      name: 'Alisson'
    },
    {
      ...generateTeamMember(10, teamTextures.member5, 150),
      rotaing_speed_around_sun: 0.004,
      self_rotation_speed: 0.01,
      name: 'Jonathan'
    },
  ];

  // Adicionar labels aos planetas da equipe
  teamPlanets.forEach(({ planet, name }) => {
    const label = createLabel(name);
    label.position.y = 15;
    label.visible = false;  // Labels começam ocultos
    planet.add(label);
  });

  // Adicionar planetas da equipe ao grupo teamSystem
  teamPlanets.forEach(({ planetObj }) => {
    teamSystem.add(planetObj);
  });

  // Inicialmente, mostrar apenas o sistema solar e ocultar labels
  teamSystem.visible = false;
  updateLabelsVisibility(false);  // Garante que todos os labels começam ocultos

  //////////////////////////////////////
  //NOTE - GUI options
  var GUI = dat.gui.GUI;
  const gui = new GUI();
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.left = '0px';
  gui.domElement.style.top = '0px';

  const options = {
    velocidade: 1,
    mostrarEquipe: false,
    mostrarNomes: false,
    fundo: 'via lactea',
    qualidade: '2k',
  };

  // Controles
  gui.add(options, "velocidade", 0, 5).name("Velocidade");

  gui.add(options, "mostrarEquipe").name("Mostrar Equipe").onChange((value) => {
    solarSystem.visible = !value;
    teamSystem.visible = value;
    updateLabelsVisibility(options.mostrarNomes);
  });

  gui.add(options, "mostrarNomes").name("Mostrar Nomes").onChange((value) => {
    updateLabelsVisibility(value);
  });

  gui.add(options, 'fundo', ['via lactea', 'estrelas', 'nenhum']).name("Fundo").onChange((value) => {
    currentBg = value;
    updateBg(value);
  })

  gui.add(options, 'qualidade', ['2k', '8k']).name("Qualidade").onChange((value) => {
    updateTextures(value);
    updateBg(currentBg, value);
  });
  //////////////////////////////////////

  //////////////////////////////////////
  // Função de animação que atualiza as posições e rotações dos objetos
  function animate(time) {
    // Atualiza os controles da câmera
    orbit.update();

    // Animar sistema solar
    if (solarSystem.visible) {
      sun.rotateY(options.velocidade * 0.004);
      moonOrbit.rotateY(options.velocidade * 0.02);
      moonObj.planet.rotateY(options.velocidade * 0.02);

      planets.forEach(
        ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
          planetObj.rotateY(options.velocidade * rotaing_speed_around_sun);
          if (planet) {
            planet.rotateY(options.velocidade * self_rotation_speed);
          }
        }
      );
    }

    // Animar sistema da equipe
    if (teamSystem.visible) {
      centralMemberGroup.rotateY(options.velocidade * 0.004);
      teamPlanets.forEach(
        ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
          planetObj.rotateY(options.velocidade * rotaing_speed_around_sun);
          if (planet) {
            planet.rotateY(options.velocidade * self_rotation_speed);
          }
        }
      );
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
  //////////////////////////////////////

  //////////////////////////////////////
  // Ajuste da visualização quando a janela é redimensionada
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  });
  //////////////////////////////////////

  function updateTextures(resolution) {
    const paths = texturePaths[resolution];

    if (!paths) {
      console.error('Paths not found for resolution:', resolution);
      return;
    }

    try {

      const newTextures = [
        textureLoader.load(paths.planetas + "/mercury.jpg"),
        textureLoader.load(paths.planetas + "/venus_surface.jpg"),
        textureLoader.load(paths.planetas + "/earth_daymap.jpg"),
        textureLoader.load(paths.planetas + "/mars.jpg"),
        textureLoader.load(paths.planetas + "/jupiter.jpg"),
        textureLoader.load(paths.planetas + "/saturn.jpg"),
      ]
      sun.material.map = textureLoader.load(paths.estrelas + "/sun.jpg");
      moonObj.planet.material.map = textureLoader.load(paths.luas + "/moon.jpg");
      // Atualiza materiais
      sun.needsUpdate = true;
      moonObj.needsUpdate = true;
      let cont = 0;
      planets.forEach(({ planet }) => {

        if (planet) {
          planet.material.map = newTextures[cont];
          planet.needsUpdate = true;
          cont = cont + 1;
        }

      });

    } catch (error) {
      console.error('Error loading textures:', error);
    }
  }



  function updateBg(bg, resolution = '8k') {
    const paths = texturePaths[resolution];

    switch (bg) {
      case 'via lactea':
        scene.background = textureLoader.load(paths.fundos + "/stars_milky_way.jpg");
        break;
      case 'estrelas':
        scene.background = textureLoader.load(paths.fundos + "/stars.jpg");
        break;
      case 'nenhum':
        scene.background = null;
        break;
      default:
        console.warn("Fundo não reconhecido:", bg);
    }
  }


  //////////////////////////////////////
  function updateLabelsVisibility(showLabels) {
    // Ocultar todos os labels primeiro
    // Labels do sistema solar
    if (sunLabel) sunLabel.visible = false;
    if (earthLabel) earthLabel.visible = false;
    if (moonLabel) moonLabel.visible = false;
    planets.forEach(({ planet }) => {
      if (planet) {
        const label = planet.children.find(child => child instanceof CSS2DObject);
        if (label) label.visible = false;
      }
    });

    // Labels da equipe
    if (centralLabel) centralLabel.visible = false;
    teamPlanets.forEach(({ planet }) => {
      const label = planet.children.find(child => child instanceof CSS2DObject);
      if (label) label.visible = false;
    });

    // Mostrar apenas os labels do sistema ativo
    if (teamSystem.visible && showLabels) {
      // Mostrar labels da equipe
      if (centralLabel) centralLabel.visible = true;
      teamPlanets.forEach(({ planet }) => {
        const label = planet.children.find(child => child instanceof CSS2DObject);
        if (label) label.visible = true;
      });
    } else if (solarSystem.visible && showLabels) {
      // Mostrar labels do sistema solar
      if (sunLabel) sunLabel.visible = true;
      if (earthLabel) earthLabel.visible = true;
      if (moonLabel) moonLabel.visible = true;
      planets.forEach(({ planet }) => {
        if (planet) {
          const label = planet.children.find(child => child instanceof CSS2DObject);
          if (label) label.visible = true;
        }
      });
    }
  }

}


