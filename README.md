# 🦀 Mangue Run

Um jogo de plataforma 2D com rolagem lateral rodando no navegador, construído com **React 19** e um **motor de jogo personalizado em Canvas** escrito do zero em JavaScript puro. Inspirado na cultura mangue beat e no povo de Pernambuco.

Pule sobre buracos, pise nos inimigos e chegue à bandeira no fim da fase.

---

## 📸 Preview

> Execute o projeto localmente e abra o navegador para ver em ação.

---

## 🕹️ Gameplay

- **Mova-se** para a esquerda e direita por um mundo de 6000px com câmera rolante
- **Pule** entre plataformas e evite cair nos buracos
- **Pise nos inimigos** pulando sobre suas cabeças para eliminá-los
- **Chegue à bandeira** no final da fase para vencer
- Você tem **3 vidas** — encostar em um inimigo de lado te reposiciona e custa uma vida
- Ao perder todas as vidas, a tela de **Game Over** aparece com opção de tentar novamente
- Uma janela de **invencibilidade** (1,5 segundos) te protege logo após levar dano
- **3 fases** — cada uma desbloqueada ao concluir a anterior; progresso salvo no `localStorage`

---

## 🎮 Controles

### Teclado

| Ação           | Teclas                       |
|----------------|------------------------------|
| Mover Esquerda | Seta `←` / `A`               |
| Mover Direita  | Seta `→` / `D`               |
| Pular          | Seta `↑` / `W` / `Espaço`   |

### Mobile / Touch

Um **D-Pad virtual** é exibido na parte inferior da tela:

- `◀` / `▶` — mover para esquerda / direita
- `▲` — pular

---

## 🛠️ Tecnologias

| Camada              | Tecnologia                           |
|---------------------|--------------------------------------|
| Framework de UI     | React 19                             |
| Renderização        | HTML5 Canvas API                     |
| Build               | Vite 8                               |
| Linguagem           | JavaScript (ESM)                     |
| Estilização         | Estilos inline / CSS-in-JS           |
| Física              | Motor AABB personalizado (do zero)   |
| Áudio               | Web Audio API (sons procedurais, sem arquivos) |

Nenhuma biblioteca de jogo externa é utilizada. Todo o motor foi escrito à mão.

---

## 📁 Estrutura do Projeto

```
src/
├── App.jsx                        # Componente raiz — conecta o jogo, HUD e D-Pad
├── main.jsx                       # Ponto de entrada do React
│
├── components/
│   ├── GameCanvas.jsx             # Monta o canvas e gerencia o ciclo de vida do Game
│   ├── DPad.jsx                   # Overlay do direcional virtual para touch/mobile
│   └── HUD.jsx                    # Exibição de vidas, telas de Game Over e Vitória
│
├── screens/
│   └── MenuScreen.jsx             # Menu principal com seleção de fase e créditos
│
├── hooks/
│   ├── useGameState.js            # Estado React: vidas, status do jogo, transições
│   └── useLayout.js               # Layout responsivo e gerenciamento de orientação
│
└── game/                          # Motor de jogo em JS puro (zero dependências React)
    ├── Game.js                    # Classe principal — setup do mundo, loop update/render
    ├── LevelManager.js            # Carregador de fases e construtor de entidades
    │
    ├── engine/
    │   ├── GameLoop.js            # Loop com requestAnimationFrame e delta-time
    │   ├── Camera.js              # Câmera com lerp suave, shake e limitação pelo mundo
    │   ├── InputManager.js        # Mapeamento de teclado + press/release programático
    │   ├── ParticleSystem.js      # Partículas de pó, explosão e flash de dano
    │   └── AudioManager.js        # Sons 8-bit procedurais via Web Audio API
    │
    ├── entities/
    │   ├── Player.js              # Movimento, resolução de colisão e renderização do jogador
    │   ├── Enemy.js               # IA de patrulha, detecção de pisada e renderização animada
    │   ├── Platform.js            # Plataforma estática com bounds e renderização no canvas
    │   └── AnimationController.js # Máquina de estados: idle / run / jump / fall
    │
    ├── levels/
    │   ├── level1.js              # Praia do Pina — fase introdutória na praia
    │   ├── level2.js              # Capibaribe — fase no rio de mangue
    │   └── level3.js              # Olinda Alta — fase nas ladeiras históricas
    │
    ├── parallax/
    │   ├── parallaxBeach.js       # Camadas parallax da praia (nuvens, mar, ondas)
    │   ├── parallaxMangrove.js    # Camadas parallax do mangue (névoa, árvores, rio)
    │   └── parallaxOlinda.js      # Camadas parallax de Olinda (céu laranja, casarões)
    │
    └── physics/
        ├── PhysicsBody.js         # Velocidade, integração de gravidade, bounds AABB
        └── AABB.js                # Resolvedor de colisão por caixa delimitadora alinhada ao eixo
```

---

## ⚙️ Arquitetura

### Desacoplamento do Motor

O motor é totalmente desacoplado do React. `Game.js` é uma classe JavaScript pura instanciada dentro de um `useEffect` em `GameCanvas.jsx`. O React gerencia apenas o estado de UI (vidas, status do jogo) por meio de callbacks passadas na construção.

```
React (estado de UI)
    └── GameCanvas.jsx
            └── Game.js ──► GameLoop (rAF)
                                ├── update(delta)
                                │       ├── Player.update()
                                │       ├── Enemy.update()
                                │       ├── Camera.follow()
                                │       ├── ParticleSystem.update()
                                │       └── verificações de colisão
                                └── render()
                                        ├── gradiente de céu
                                        ├── _renderParallax()
                                        ├── Camera.begin()
                                        ├── Platform.render()
                                        ├── _renderFlag()
                                        ├── Enemy.render()
                                        ├── Player.render()
                                        ├── ParticleSystem.render()
                                        ├── Camera.end()
                                        └── _renderLevelName()
```

### Física

A detecção de colisão usa **AABB (Axis-Aligned Bounding Box)** com resolução pelo menor overlap. O motor identifica qual eixo tem menor penetração e resolve por ele, distinguindo corretamente colisões pelo topo/base e pelos lados.

### Câmera

A câmera usa **interpolação linear (lerp)** para seguir o jogador com suavidade. É limitada pelas bordas do mundo para que o fundo nunca apareça além dos limites do mapa. Um sistema de screen-shake com magnitude e duração configuráveis adiciona impacto visual às colisões.

### Animação

`AnimationController` é uma máquina de estados leve que controla o squash-and-stretch de escala e a animação procedural do balanço das pernas, com base na velocidade e no estado de contato com o chão.

### Áudio

Todos os sons são gerados em tempo real pela **Web Audio API** — nenhum arquivo de áudio é empacotado no build. O `AudioManager` inicializa o `AudioContext` de forma lazy no primeiro gesto do usuário, respeitando a política de autoplay dos navegadores.

---

## 🔬 Referência Completa de API

---

### `Game` — `src/game/Game.js`

Classe principal do jogo. Possui todos os subsistemas e conduz o loop de update/render.

#### `constructor(canvas, callbacks, levelId = 1)`

| Parâmetro   | Tipo       | Descrição                                               |
|-------------|------------|---------------------------------------------------------|
| `canvas`    | `HTMLCanvasElement` | O elemento canvas alvo                         |
| `callbacks` | `{ onLoseLife: Function, onWin: Function }` | Callbacks para o estado React |
| `levelId`   | `number`   | Fase a carregar na instanciação (padrão: `1`)            |

Cria todos os subsistemas: `InputManager`, `ParticleSystem`, `AudioManager`, `LevelManager`, `GameLoop` e `Camera`. Chama `_applyLevel()` internamente.

#### `_applyLevel()`

Lê os dados do `LevelManager` e popula as propriedades de trabalho do jogo: `platforms`, `enemies`, `flagX`, `theme`, `parallax`, `WORLD_WIDTH`, `WORLD_HEIGHT`. Cria um novo `Player`, reseta o timer de `invincible`, cria uma nova `Camera` e limpa o `ParticleSystem`.

#### `reset(callbacks, levelId?)`

Reseta o estado do jogo, opcionalmente trocando de fase. Substitui `callbacks`, chama `LevelManager.load()` se um novo `levelId` for fornecido, e re-executa `_applyLevel()`.

#### `start()`

Inicia o `GameLoop` (começa o loop `requestAnimationFrame`).

#### `stop()`

Para o `GameLoop` sem destruir a instância do jogo.

#### `destroy()`

Para o loop, destrói os listeners de teclado do `InputManager` e fecha o `AudioContext`.

#### `update(delta)`

Tick principal de atualização chamado todo frame. Responsabilidades:
- Dispara partículas de pó ao pular (saída do chão) e ao aterrissar.
- Atualiza `Player`, `Camera`, `ParticleSystem` e todos os `Enemy`.
- Decrementa o timer de `invincible`.
- Chama `_checkEnemyCollisions()`, `_checkFall()`, `_checkWin()`.

#### `_checkEnemyCollisions()`

Ignorado se `invincible > 0`. Itera todos os inimigos vivos e executa `resolveAABB` contra o jogador. Se o eixo for `y` e a direção `bottom` com `vy > 0` → pisada (inimigo morre, jogador quica, partículas, câmera treme). Caso contrário → jogador toma dano (invencibilidade concedida, flash de dano, câmera treme, jogador reposicionado no spawn, `onLoseLife` chamado).

#### `_checkFall()`

Se `player.body.y > WORLD_HEIGHT + 100`, o jogador caiu num buraco. Reposiciona no spawn, dispara câmera shake e som de dano, chama `onLoseLife`.

#### `_checkWin()`

Se `player.body.x >= flagX`, a fase foi concluída. Toca o som de vitória e chama `onWin(levelId)`.

#### `render()`

Pipeline completo de renderização por frame:
1. Limpa o canvas.
2. Desenha gradiente de céu usando `theme.sky` / `theme.skyBottom` / `theme.ground`.
3. Chama `_renderParallax()`.
4. Desenha faixa de água na base do canvas (se `theme.water` definido).
5. `Camera.begin()` — aplica transform da câmera.
6. Renderiza todas as instâncias de `Platform`.
7. Chama `_renderFlag()`.
8. Renderiza todos os `Enemy` (os mortos se ignoram internamente).
9. Renderiza o `Player` (com piscar de invencibilidade a 8Hz).
10. Renderiza o `ParticleSystem`.
11. `Camera.end()` — restaura o transform.
12. Chama `_renderLevelName()`.

#### `_renderParallax(ctx)`

Itera as camadas `this.parallax`. Para cada camada, calcula o offset horizontal com base em `camera.x * layer.speed`, faz tiling da camada pela viewport, e aplica `layer.alpha` via `globalAlpha`.

#### `_renderFlag(ctx)`

Desenha a bandeira de fim de fase: um poste cinza em `flagX` + um triângulo usando a cor `theme.flag`.

#### `_renderLevelName(ctx)`

Renderiza o nome da fase (`LevelManager.data.name`) no canto superior direito com fonte monoespaçada semi-transparente.

---

### `LevelManager` — `src/game/LevelManager.js`

Carrega dados de fase e constrói entidades do jogo a partir de objetos de configuração.

#### `constructor(levelId = 1)`

Chama `load(levelId)` imediatamente.

#### `load(levelId, viewWidth = 800)`

Resolve o objeto de dados da fase no registro `LEVELS` (chaves 1–3). Popula:
- `data`, `theme`, `worldWidth`, `worldHeight`, `flagX`, `playerStart`
- `platforms` — array de instâncias `Platform` construídas a partir de `data.platforms`
- `enemies` — array de instâncias `Enemy` construídas a partir de `data.enemies` (respeita `speed` por inimigo se presente)
- `parallax` — chama a função factory de parallax correspondente

---

### `GameLoop` — `src/game/engine/GameLoop.js`

Gerencia o loop `requestAnimationFrame` com delta-time consistente.

#### `constructor(updateFn, renderFn)`

Armazena referências às funções `update` e `render`.

#### `start()`

Define `running = true` e inicia o loop rAF.

#### `stop()`

Define `running = false` e cancela o rAF pendente via `cancelAnimationFrame`.

#### `loop(timestamp)`

Callback interno do rAF. Calcula `delta` em segundos (`max(dt / 1000, 0.05)` para evitar o espiral da morte ao restaurar aba). Chama `update(delta)` e depois `render()`.

---

### `Camera` — `src/game/engine/Camera.js`

Câmera de seguimento suave com limitação pelo mundo e screen shake.

#### `constructor(worldWidth, worldHeight, viewWidth, viewHeight)`

Inicializa posição da câmera em `(0, 0)` e armazena dimensões do mundo e da viewport. Inicializa o estado de shake.

#### `shake(magnitude = 6, duration = 0.3)`

Dispara um efeito de screen-shake. `magnitude` em pixels; `duration` em segundos.

#### `follow(target, delta)`

Calcula a posição ideal para centralizar `target` na viewport. Aplica lerp com `speed = 8`. Clampeia o resultado nos limites do mundo. Atualiza o offset de shake: decai linearmente ao longo de `_shakeTimer`, aplica offset aleatório dentro da magnitude atual.

#### `begin(ctx)`

Salva o estado do canvas e aplica `ctx.translate(-x + shakeOffsetX, -y + shakeOffsetY)` para deslocar o mundo para a visão.

#### `end(ctx)`

Restaura o estado do canvas para desfazer o transform da câmera.

---

### `InputManager` — `src/game/engine/InputManager.js`

Gerencia entrada de teclado e expõe uma API de press/release programático para o D-Pad.

#### `constructor()`

Inicializa `keys = { left, right, jump }` todos `false`. Chama `_bindKeyboard()`.

#### `_bindKeyboard()`

Adiciona listeners `keydown` / `keyup` no `window`. Mapeia `ArrowLeft`, `KeyA` → `left`; `ArrowRight`, `KeyD` → `right`; `ArrowUp`, `KeyW`, `Space` → `jump`.

#### `destroy()`

Remove os listeners `keydown` e `keyup` do `window`.

#### `press(key)`

Define `keys[key] = true`. Chamado pelo `onPointerDown` dos botões do D-Pad.

#### `release(key)`

Define `keys[key] = false`. Chamado pelo `onPointerUp` e `onPointerLeave` dos botões do D-Pad.

---

### `ParticleSystem` — `src/game/engine/ParticleSystem.js`

Gerencia todos os efeitos de partículas. As partículas são objetos simples em um array flat.

#### `constructor()`

Inicializa `this.particles = []`.

#### `spawnDust(x, y, color)`

Gera 6 partículas quadradas pequenas para pó de aterrissagem/decolagem. Cada uma tem velocidade aleatória (dispersão horizontal, burst vertical), vida `0.35–0.55s` e tamanho `3–7px`.

#### `spawnEnemyPop(x, y, color)`

Gera 10 partículas em padrão de burst radial (ângulos igualmente espaçados). Cada uma voa para fora a `120–220px/s` com viés vertical negativo, vida `0.4–0.6s`, tamanho `4–9px`.

#### `spawnDamageFlash(x, y)`

Gera uma única partícula de círculo flash expansivo centralizado no jogador. Raio inicial 20, expande à medida que o `alpha` diminui, vida `0.25s`.

#### `update(delta)`

Decrementa `life` em todas as partículas. Integra `vx` / `vy` com `delta`. Aplica gravidade leve (`200 px/s²`) às partículas de pó e pop. Remove partículas mortas (`life <= 0`).

#### `render(ctx)`

Itera todas as partículas. Aplica `globalAlpha = life / maxLife`. Tipo flash: desenha círculo expansivo. Tipos dust/pop: desenha quadrado escalonado por `size * alpha`.

#### `clear()`

Esvazia o array de partículas. Chamado no reset da fase.

---

### `AudioManager` — `src/game/engine/AudioManager.js`

Gera todos os sons do jogo de forma procedural usando a Web Audio API. Nenhum arquivo de áudio necessário.

#### `constructor()`

Define `this._ctx = null`. O contexto é inicializado de forma lazy na primeira chamada de som.

#### `_getCtx()`

Retorna (e retoma se suspenso) o `AudioContext` compartilhado. Cria um na primeira chamada. Lida com a política de autoplay do navegador chamando `resume()` quando o estado é `"suspended"`.

#### `jump()`

Duas notas square ascendentes: `220→440 Hz` (60ms) depois `440→660 Hz` (70ms). Simula o som clássico de pulo 8-bit.

#### `damage()`

Burst de ruído branco com filtro bandpass (centro em 180 Hz) + oscilador sawtooth varrendo `200→60 Hz`. Transmite impacto e desorientação.

#### `enemyDie()`

Som em três partes: sino descendente `600→200 Hz` (thud principal), squish square `800→400 Hz` (com delay), notinha ascendente `300→500 Hz` (bounce). Cria um satisfatório "pop de pisada."

#### `win()`

Melodia ascendente Dó–Mi–Sol–Dó usando osciladores square + harmonia seno nas duas últimas notas. Fanfarra 8-bit clássica.

#### `destroy()`

Fecha e anula o `AudioContext` para liberar recursos do navegador.

---

### `PhysicsBody` — `src/game/physics/PhysicsBody.js`

Representa um retângulo móvel alinhado aos eixos com velocidade e gravidade.

#### `constructor(x, y, width, height)`

Inicializa posição, dimensões, `vx = 0`, `vy = 0`, `onGround = false`.

#### `update(delta)`

Aplica gravidade (`1800 px/s²`) a `vy` quando `!onGround`. Integra velocidade: `x += vx * delta`, `y += vy * delta`.

#### `get bounds`

Retorna `{ left, right, top, bottom }` a partir da posição e dimensões atuais. Usado por `resolveAABB`.

---

### `resolveAABB(moving, static_)` — `src/game/physics/AABB.js`

Função pura. Detecta e classifica uma colisão entre dois objetos que expõem um getter `bounds`.

**Parâmetros:** `moving` (PhysicsBody), `static_` (PhysicsBody ou Platform)

**Retorna:** `null` se não há colisão, ou `{ axis: "x"|"y", direction: "left"|"right"|"top"|"bottom", overlap: number }`.

**Algoritmo:**
1. Early-out com teste de eixo separador.
2. Calcula `overlapX` e `overlapY`.
3. Resolve pelo eixo de menor penetração (vetor de translação mínima).
4. Classifica a direção pelo lado de menor penetração.

---

### `Player` — `src/game/entities/Player.js`

O personagem jogador. Possui um `PhysicsBody` e um `AnimationController`.

#### `constructor(x, y)`

Cria `PhysicsBody(x, y, 40, 50)`, define `facing = 1`, cria `AnimationController`.

#### `update(delta, input, platforms, worldWidth)`

- Lê `input.keys` para definir `body.vx` (±280 px/s) e atualizar `facing`.
- Aplica força de pulo (`-850 px/s`) se `keys.jump && body.onGround`.
- Chama `body.update(delta)`.
- Reseta `onGround = false`.
- Itera `platforms`, chama `resolveAABB`, resolve a posição em colisão:
  - Y-bottom: pousa no topo, zera `vy`, define `onGround = true`.
  - Y-top: bateu na cabeça, zera `vy`, empurra para baixo.
  - X: empurra para o lado, zera `vx`.
- Limita `body.x` aos limites do mundo.
- Chama `anim.update(delta, body)`.

#### `render(ctx)`

Desenha o jogador usando primitivos 2D do canvas (sem sprites):
- Translada ao centro dos pés, aplica escala horizontal `facing` e escala vertical `squash`.
- Desenha duas pernas procedurais com `_drawLeg()`, rotacionadas por `±legAngle`.
- Desenha retângulo do corpo (cor muda quando no ar).
- Desenha retângulo da cabeça com olho e pupila.

#### `_drawLeg(ctx, offsetX, offsetY, angle, height)`

Desenha um segmento de perna. Translada à posição do quadril, rotaciona por `angle`, desenha um retângulo 8×(height×0.42).

---

### `Enemy` — `src/game/entities/Enemy.js`

Inimigo com IA de patrulha simples, física e renderização animada.

#### `constructor(x, y, patrolLeft, patrolRight, speed = 100, theme = {})`

Cria `PhysicsBody(x, y, 36, 36)`. Define limites de patrulha, velocidade, `facing = 1`, `alive = true`. Lê `theme.enemy` e `theme.enemyHead` para cores.

#### `update(delta, platforms)`

Retorna imediatamente se `!alive`. Incrementa `timer`, atualiza `legAngle` via onda senoidal. Define `body.vx = facing * speed`. Chama `body.update(delta)`. Resolve colisões de plataforma (pousa no topo, inverte em colisão X). Inverte `facing` nos limites de patrulha.

#### `render(ctx)`

Ignora se `!alive`. Translada ao centro dos pés, aplica escala `facing`. Desenha duas pernas via `_drawLeg()`. Desenha corpo, cabeça, olhos brancos, pupilas escuras e sobrancelhas bravas.

#### `_drawLeg(ctx, offsetX, offsetY, angle, height)`

Estruturalmente idêntico ao método de desenho de perna do Player.

---

### `Platform` — `src/game/entities/Platform.js`

Retângulo estático e imóvel que serve como chão ou superfície flutuante.

#### `constructor(x, y, width, height, theme = {})`

Armazena posição e dimensões. Lê `theme.platform` e `theme.platformTop` para cores do corpo e da faixa superior.

#### `get bounds`

Retorna `{ left, right, top, bottom }`. Interface necessária para `resolveAABB`.

#### `render(ctx)`

Desenha o retângulo do corpo com `colorBody`, depois uma faixa superior de 6px com `colorTop` para ilusão de profundidade.

---

### `AnimationController` — `src/game/entities/AnimationController.js`

Máquina de estados leve para animação visual do jogador.

#### `constructor()`

Inicializa `state = "idle"`, `timer = 0`, `legAngle = 0`, `squash = 1`.

#### `update(delta, body)`

Incrementa `timer`. Determina o estado a partir da física:
- `!onGround && vy < 0` → `"jump"`
- `!onGround && vy >= 0` → `"fall"`
- `onGround && |vx| > 10` → `"run"`
- padrão → `"idle"`

Atualiza `legAngle`:
- Run: `sin(timer × 16) × 0.7`
- Jump: `0.35` (pernas abertas)
- Fall: `-0.2` (pernas recolhidas)
- Idle: `0`

Atualiza `squash` via lerp:
- Jump: alvo `0.85` (squash na decolagem)
- Fall: alvo `1.1` (stretch)
- Chão: alvo `1.0`

---

### Formato dos Dados de Fase — `src/game/levels/`

Cada fase é um módulo ES que exporta um objeto com a seguinte forma:

| Campo         | Tipo       | Descrição                                                  |
|---------------|------------|------------------------------------------------------------|
| `id`          | `number`   | Identificador da fase (1–3)                               |
| `name`        | `string`   | Nome exibido no HUD                                       |
| `worldWidth`  | `number`   | Extensão horizontal total em pixels                       |
| `worldHeight` | `number`   | Extensão vertical total em pixels                         |
| `theme`       | `object`   | Paleta de cores (ver Campos do Tema abaixo)               |
| `platforms`   | `Array<{x,y,w,h}>` | Descritores crus de plataformas                 |
| `enemies`     | `Array<{x,y,left,right,speed?}>` | Descritores crus de inimigos      |
| `playerStart` | `{x, y}`   | Posição de spawn do jogador                               |
| `flagX`       | `number`   | Posição X da bandeira de chegada                          |

#### Campos do Tema

| Chave          | Usado por                    | Descrição                          |
|----------------|------------------------------|------------------------------------|
| `sky`          | `Game.render()`              | Cor superior do gradiente de céu   |
| `skyBottom`    | `Game.render()`              | Cor inferior do gradiente de céu   |
| `ground`       | `Game.render()`              | Cor base do gradiente de céu       |
| `platform`     | `Platform`                   | Cor do corpo da plataforma         |
| `platformTop`  | `Platform`, `ParticleSystem` | Cor da faixa superior + pó         |
| `water`        | `Game.render()`              | Faixa de água na base do canvas    |
| `waterSheen`   | `Game.render()`              | Faixa de reflexo da água           |
| `enemy`        | `Enemy`                      | Cor do corpo do inimigo + partículas pop |
| `enemyHead`    | `Enemy`                      | Cor da cabeça do inimigo           |
| `flag`         | `Game._renderFlag()`         | Cor do triângulo da bandeira        |

---

### Camadas de Parallax — `src/game/parallax/`

Cada módulo de parallax exporta uma função factory `(viewWidth) => Layer[]`.

Cada objeto `Layer`:

| Campo    | Tipo       | Descrição                                                   |
|----------|------------|-------------------------------------------------------------|
| `speed`  | `number`   | Multiplicador de scroll relativo ao camera X (0 = estático, 1 = junto com a câmera) |
| `alpha`  | `number`   | Opacidade global da camada                                  |
| `draw`   | `(ctx, tx, H) => void` | Função de desenho chamada por tile. `tx` é o offset X após o cálculo de parallax; `H` é a altura do canvas. |

`Game._renderParallax()` faz tiling de cada camada três vezes (`-1`, `0`, `+1` larguras de viewport) para garantir loop contínuo sem falhas.

---

## 🪝 Referência dos React Hooks

### `useGameState` — `src/hooks/useGameState.js`

Gerencia todo o estado de alto nível do jogo no React.

| Valor de Retorno | Tipo       | Descrição                                               |
|------------------|------------|---------------------------------------------------------|
| `lives`          | `number`   | Contagem atual de vidas (0–3)                           |
| `gameStatus`     | `string`   | `"menu"` \| `"playing"` \| `"dead"` \| `"win"`          |
| `currentLevel`   | `number`   | ID da fase ativa                                        |
| `maxUnlocked`    | `number`   | Maior fase desbloqueada (persistido no `localStorage`)  |
| `hasNext`        | `boolean`  | Se existe próxima fase além de `currentLevel`           |
| `loseLife()`     | `Function` | Decrementa vidas; define status `"dead"` ao chegar em 0 |
| `win(levelId)`   | `Function` | Desbloqueia próxima fase, salva no `localStorage`, define `"win"` |
| `play(levelId)`  | `Function` | Define fase, reseta vidas para 3, define `"playing"`    |
| `restart()`      | `Function` | Reseta vidas para 3, define `"playing"` na mesma fase   |
| `goToMenu()`     | `Function` | Reseta vidas, define `"menu"`                           |

O progresso é persistido usando a chave `"manguerun_unlocked"` no `localStorage`.

---

### `useLayout` — `src/hooks/useLayout.js`

Calcula dimensões responsivas do canvas e gerencia preferência de orientação.

| Valor de Retorno  | Tipo       | Descrição                                            |
|-------------------|------------|------------------------------------------------------|
| `mobile`          | `boolean`  | Detectado via user-agent + viewport width ≤900px     |
| `orientation`     | `string`   | `"vertical"` ou `"horizontal"` (persistido)          |
| `setOrientation`  | `Function` | Atualiza orientação e salva no `localStorage`        |
| `isLandscape`     | `boolean`  | `true` se desktop ou mobile em modo landscape        |
| `canvas`          | `object`   | `{ logicalW, logicalH, displayW, displayH, offsetX, offsetY }` |

A resolução lógica do canvas é sempre **800×560**. O tamanho de exibição se adapta:
- **Desktop**: letterbox 16:9, centralizado na viewport.
- **Mobile landscape**: dimensões completas da janela.
- **Mobile portrait**: largura total da janela, altura proporcional ao aspect ratio.

---

## 🧩 Referência dos Componentes React

### `App` — `src/App.jsx`

Componente raiz. Possui `gameRef` (ref para a instância do `Game`) e orquestra as transições de estado entre menu, gameplay e overlays. Passa callbacks `onLoseLife` e `onWin` para o `GameCanvas`. Renderiza `MenuScreen` quando `gameStatus === "menu"`.

### `GameCanvas` — `src/components/GameCanvas.jsx`

Monta um elemento `<canvas>` e gerencia o ciclo de vida da instância `Game`. Re-cria o `Game` sempre que `levelId` mudar (via dependência do `useEffect`). Chama `game.stop()` / `game.start()` quando a prop `paused` muda.

### `HUD` — `src/components/HUD.jsx`

Componente de overlay condicional:
- **Playing**: renderiza 3 ícones de coração (opacos se perdidos) e botão de menu.
- **Dead**: renderiza tela de Game Over com botões `MENU` e `REINICIAR`.
- **Win**: renderiza tela de fase concluída com `MENU`, `REINICIAR` e opcionalmente `PRÓXIMA ▸`.

### `DPad` — `src/components/DPad.jsx`

Direcional virtual para touch/mobile. Cada botão chama `gameRef.current.input.press(key)` no `pointerdown` e `input.release(key)` no `pointerup` / `pointerleave`. O layout muda entre retrato (barra centralizada embaixo) e paisagem (cluster à esquerda + botão de pulo à direita).

### `MenuScreen` — `src/screens/MenuScreen.jsx`

Menu em tela cheia animado. Funcionalidades:
- Campo de estrelas animadas com CSS `@keyframes twinkle`.
- Decorações de coqueiros pixel-art (JSX procedural).
- Seletor de fase com estados bloqueado/desbloqueado.
- Toggle de orientação para mobile (retrato / paisagem).
- Botão `JOGAR` piscante.
- Overlay de créditos.

---

## 🗺️ Design das Fases

Os três mundos têm **6000px de largura × 560px de altura**.

| Fase | Nome          | Tema                           | Dificuldade   |
|------|---------------|--------------------------------|---------------|
| 1    | Praia do Pina | Praia, oceano, areia           | Introdutória  |
| 2    | Capibaribe    | Rio de mangue, barro, noite    | Média         |
| 3    | Olinda Alta   | Ladeira histórica, entardecer  | Difícil       |

Cada fase possui:
- Várias seções de chão separadas por buracos
- Plataformas flutuantes em alturas variadas
- Inimigos com zonas de patrulha únicas
- Fundo com parallax temático em 2–3 camadas de profundidade

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm

### Instalação

```bash
git clone <url-do-seu-repositório>
cd <pasta-do-projeto>
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

## 🤝 Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro.

1. Faça um fork do repositório
2. Crie uma branch de feature: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'Adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é open source.