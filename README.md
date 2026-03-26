# [🇺🇸 Read in English](README.en.md)

# 🎮 Platformer Game

Um jogo de plataforma 2D com rolagem lateral rodando no navegador, construído com **React** e um **motor de jogo personalizado em Canvas** escrito do zero em JavaScript puro. Pule sobre buracos, pise nos inimigos e chegue à bandeira no fim da fase.

---

## 📸 Preview

> Execute o projeto localmente e abra o navegador para ver em ação.

---

## 🕹️ Gameplay

- **Mova-se** para a esquerda e direita por um mundo de 3000px com câmera rolante
- **Pule** entre plataformas e evite cair nos buracos
- **Pise nos inimigos** pulando sobre suas cabeças para eliminá-los
- **Chegue à bandeira** no final da fase para vencer
- Você tem **3 vidas** — encostar em um inimigo de lado te reposiciona e custa uma vida
- Ao perder todas as vidas, a tela de **Game Over** aparece com opção de tentar novamente
- Uma janela de **invencibilidade** (1,5 segundos) te protege logo após levar dano

---

## 🎮 Controles

### Teclado

| Ação          | Teclas                        |
|---------------|-------------------------------|
| Mover Esquerda| Seta `←` / `A`                |
| Mover Direita | Seta `→` / `D`                |
| Pular         | Seta `↑` / `W` / `Espaço`    |

### Mobile / Touch

Um **D-Pad virtual** é exibido na parte inferior da tela:

- `◀` / `▶` — mover para esquerda / direita
- `▲` — pular

---

## 🛠️ Tecnologias

| Camada            | Tecnologia                        |
|-------------------|-----------------------------------|
| Framework de UI   | React 19                          |
| Renderização      | HTML5 Canvas API                  |
| Build             | Vite 8                            |
| Linguagem         | JavaScript (ESM)                  |
| Estilização       | Estilos inline / CSS-in-JS        |
| Física            | Motor AABB personalizado (do zero)|

Nenhuma biblioteca de jogo externa é utilizada. Todo o motor foi escrito à mão.

---

## 📁 Estrutura do Projeto

```
src/
├── App.jsx                  # Componente raiz — conecta o jogo, HUD e D-Pad
├── main.jsx                 # Ponto de entrada do React
│
├── components/
│   ├── GameCanvas.jsx       # Monta o canvas e gerencia o ciclo de vida do Game
│   ├── DPad.jsx             # Overlay do direcional virtual para touch/mobile
│   └── HUD.jsx              # Exibição de vidas, telas de Game Over e Vitória
│
├── hooks/
│   └── useGameState.js      # Estado React: vidas, status do jogo, transições
│
└── game/                    # Motor de jogo em JS puro (sem React)
    ├── Game.js              # Classe principal — setup do mundo, loop update/render
    │
    ├── engine/
    │   ├── GameLoop.js      # Loop com requestAnimationFrame e delta-time
    │   ├── Camera.js        # Câmera com lerp suave e limitação pelas bordas do mundo
    │   └── InputManager.js  # Mapeamento de teclado + press/release programático
    │
    ├── entities/
    │   ├── Player.js        # Movimento, resolução de colisão e renderização do jogador
    │   ├── Enemy.js         # IA de patrulha, detecção de pisada e renderização animada
    │   ├── Platform.js      # Plataforma estática com bounds e renderização no canvas
    │   └── AnimationController.js  # Máquina de estados: idle / run / jump / fall
    │
    └── physics/
        ├── PhysicsBody.js   # Velocidade, integração de gravidade, bounds AABB
        └── AABB.js          # Resolvedor de colisão por caixa delimitadora alinhada ao eixo
```

---

## ⚙️ Arquitetura

### Motor de Jogo

O motor é totalmente desacoplado do React. `Game.js` é uma classe JavaScript pura instanciada dentro de um `useEffect` em `GameCanvas.jsx`. O React gerencia apenas o estado de UI (vidas, status do jogo) por meio de callbacks passadas na construção.

```
React (estado de UI)
    └── GameCanvas.jsx
            └── Game.js  ──► GameLoop (rAF)
                                 ├── update(delta)
                                 │       ├── Player.update()
                                 │       ├── Enemy.update()
                                 │       ├── Camera.follow()
                                 │       └── verificações de colisão
                                 └── render()
                                         ├── Camera.begin()
                                         ├── Platform.render()
                                         ├── Enemy.render()
                                         ├── Player.render()
                                         └── Camera.end()
```

### Física

A detecção de colisão usa **AABB (Axis-Aligned Bounding Box)** com resolução pelo menor overlap. O motor identifica qual eixo tem menor penetração e resolve por ele, distinguindo corretamente colisões pelo topo/base e pelos lados.

### Câmera

A câmera usa **interpolação linear (lerp)** para seguir o jogador com suavidade. É limitada pelas bordas do mundo para que o fundo nunca apareça além dos limites do mapa.

### Animação

`AnimationController` é uma máquina de estados leve que controla o squash-and-stretch de escala e a animação procedural do balanço das pernas, com base na velocidade e no estado de contato com o chão do jogador.

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm

### Instalação

```bash
# Clone o repositório
git clone <url-do-seu-repositório>
cd <pasta-do-projeto>

# Instale as dependências
npm install
```

### Rodando Localmente

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### Build de Produção

```bash
npm run build
```

O resultado estará na pasta `dist/`, pronto para ser servido de forma estática.

### Preview do Build de Produção

```bash
npm run preview
```

---

## 🗺️ Design da Fase

O mundo tem **3000px de largura** com altura fixa de **560px**. A fase conta com:

- **5 seções de chão** separadas por buracos que exigem saltos
- **16 plataformas flutuantes** em alturas variadas criando caminhos em múltiplos níveis
- **6 inimigos** com zonas de patrulha definidas ao longo da fase
- Uma **bandeira** em x=2900 marcando a linha de chegada

---

## 🤝 Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro para discutir o que você gostaria de alterar.

1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona minha feature'`)
4. Envie para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é open source.