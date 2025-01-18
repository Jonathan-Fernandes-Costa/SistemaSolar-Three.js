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
const bgTexture = textureLoader.load("./image/fundo-vialactea.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
const moonTexture = textureLoader.load("./image/moon.jpg");

// Carregamento das texturas para o sistema da equipe
const teamTextures = {
  member1: textureLoader.load("./image/ialis.jpg"),
  member2: textureLoader.load("./image/jardel.jpg"),
  member3: textureLoader.load("./image/wesley.jpg"),
  member4: textureLoader.load("./image/alisson.jpg"),
  member5: textureLoader.load("./image/jhon.jpg"),
  halo: textureLoader.load("./image/saturn_ring.png"),
};
//////////////////////////////////////

//////////////////////////////////////
// Criação da cena principal onde todos os objetos serão adicionados
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
// Definição da textura de fundo da cena
scene.background = bgTexture;
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
  mostrarNomes: false
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
