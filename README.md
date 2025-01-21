# Sistema Solar - Three.js

Este projeto é uma visualização interativa de um sistema solar em um navegador web, utilizando Three.js para a disciplina de Computação Gráfica 2024.2.
## Teste você mesmo
[Link](https://sistema-solar-three-js.vercel.app/)

## Desenvolvedores

* Alisson
* [Artur Jardel](https://github.com/arturj9)
* [Jonathan](https://github.com/Jonathan-Fernandes-Costa)
* Wesley

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Jonathan-Fernandes-Costa/SistemaSolar-Three.js.git
3. Navegue para o diretório do projeto:
   ```bash
   cd SistemaSolar-Three.js
5. Abra o arquivo `index.html` com um servidor.

## Texturas

As texturas utilizadas no projeto foram obtidas do site [https://www.solarsystemscope.com/textures/](https://www.solarsystemscope.com/textures/).

## Dependências

* [dat.gui](https://github.com/dataarts/dat.gui): Biblioteca para criação de interfaces gráficas dinâmicas.

## Controles de Interface do Usuário

Esta seção descreve os controles interativos disponíveis na interface gráfica, projetados para personalizar o comportamento e a aparência do sistema:

1. **Velocidade:**
   Permite ajustar a velocidade de execução de elementos dinâmicos, com um intervalo configurável.
2. **Exibição da Equipe:**
   Alterna entre dois sistemas visuais principais: o sistema solar e a equipe, permitindo alternância em tempo real.
3. **Exibição de Nomes:**
   Ativa ou desativa a visibilidade dos rótulos nos elementos visuais.
4. **Fundo Personalizado:**
   Oferece uma seleção de fundos visuais (ex.: Via Láctea, estrelas, ou nenhum), permitindo mudanças instantâneas na ambientação.
5. **Qualidade Visual:**
   Permite escolher entre diferentes resoluções de textura (ex.: 2K ou 8K) para equilibrar desempenho e qualidade gráfica.

## Estrutura de Arquivos

```plaintext
.
├── assets
│   ├── favicon.png
│   ├── fotos
│   │   ├── alisson.jpg
│   │   ├── ialis.jpg
│   │   ├── jardel.jpg
│   │   ├── jhon.jpg
│   │   └── wesley.jpg
│   └── texturas
│       ├── 2k
│       │   ├── estrelas
│       │   │   └── sun.jpg
│       │   ├── fundos
│       │   │   ├── stars.jpg
│       │   │   └── stars_milky_way.jpg
│       │   ├── luas
│       │   │   └── moon.jpg
│       │   └── planetas
│       │       ├── earth_daymap.jpg
│       │       ├── jupiter.jpg
│       │       ├── mars.jpg
│       │       ├── mercury.jpg
│       │       ├── neptune.jpg
│       │       ├── saturn.jpg
│       │       ├── uranus.jpg
│       │       └── venus_surface.jpg
│       ├── 8k
│       │   ├── estrelas
│       │   │   └── sun.jpg
│       │   ├── fundos
│       │   │   ├── stars.jpg
│       │   │   └── stars_milky_way.jpg
│       │   ├── luas
│       │   │   └── moon.jpg
│       │   └── planetas
│       │       ├── earth_daymap.jpg
│       │       ├── jupiter.jpg
│       │       ├── mars.jpg
│       │       ├── mercury.jpg
│       │       ├── neptune.jpg
│       │       ├── saturn.jpg
│       │       ├── uranus.jpg
│       │       └── venus_surface.jpg
│       └── aneis
│           ├── saturn_ring.png
│           └── uranus_ring.png
├── CNAME
├── index.html
├── js
├── README.md
└── src
    ├── main.js
    ├── min.js
    │   └── dat.gui.min.js
    └── solarSystem.js
```
