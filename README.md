# Site da Feira de Profissões — Engenharia Civil

Site de página única (one-page) em **HTML5, CSS3 e JavaScript puro**, sem frameworks, sem backend e sem banco de dados.
Idioma: português brasileiro. Conceito visual: *Editorial Arquitetônico* (concreto, grafite e laranja).

> Slogan: **“Projetar o futuro. Construir possibilidades.”**

## Como executar

**Opção 1 — mais simples:** dê dois cliques em `index.html` (abre no navegador).

**Opção 2 — servidor local** (recomendada para testar como se estivesse publicado). Na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

> As fontes (Fraunces, IBM Plex) vêm do Google Fonts e precisam de internet. Sem internet, o site usa fontes de reserva e continua funcionando.

## Estrutura

```text
engenharia-civil/
├── index.html          ← conteúdo das 8 seções
├── css/style.css       ← identidade visual (organizado por seção; cores e fontes em variáveis no topo)
├── js/main.js          ← menu, linha do tempo, cartões, galeria, voltar ao topo
├── assets/
│   ├── images/         ← coloque aqui as fotos (hero.jpg e fotos do stand)
│   ├── icons/          ← favicon.svg
│   └── videos/         ← vídeos do stand
└── README.md
```

## O que ainda precisa ser preenchido (nada disso foi inventado)

### 1. Créditos (seção 08)
Em `index.html`, procure `credits__list`. Substitua o texto de cada `<dd class="fill">[...]</dd>` pelos dados reais
(integrantes, turma, disciplina, professor(a), instituição, feira) e **remova a classe `fill`** de cada campo preenchido.

### 2. Galeria do stand (seção 07) — depois da feira
Hoje a seção mostra espaços reservados com a mensagem *“Registros da nossa participação serão adicionados em breve.”*
Para inserir um registro real, em `index.html`, dentro do cartão correspondente:

1. Copie a foto para `assets/images/` (ex.: `stand-01.jpg`, largura de uns 1200 px, até ~300 KB).
2. Troque a `<div class="slot__placeholder">…</div>` pelo modelo de foto que está no **comentário acima da galeria** (já traz botão acessível, `alt` e `loading="lazy"`).
3. Escreva o `alt` (descrição objetiva do que aparece) e a legenda no `<figcaption>`.
4. A ampliação (lightbox) funciona sozinha: abre ao clicar e fecha com **Esc**, com o botão **×** ou clicando fora.

Vídeos: copie para `assets/videos/` e use o modelo `<video>` do mesmo comentário.
Use **somente imagens e vídeos feitos pela equipe no stand** nessa seção.

Troque também o parágrafo “Relato da equipe” (`report__placeholder`) pelo texto escrito pela equipe.

### 3. Fotografia do hero (opcional)
O hero já traz um **desenho técnico criado para este projeto** (SVG). Para usar uma fotografia arquitetônica no lugar:

1. Salve a imagem como `assets/images/hero.jpg` (ideal: 1600×1000 px, até ~300 KB, paisagem).
2. Ela aparece automaticamente sobre o desenho. Se o arquivo não existir ou falhar, o desenho continua visível.
3. Ajuste o `alt` da imagem e o **crédito** (`hero__caption-photo`) em `index.html`.
4. Fontes sugeridas: Unsplash e Pexels. Confira a licença e dê o crédito ao autor. **Não use essa foto como se fosse o stand.**

## Como atualizar os dados do mercado de trabalho (seção 06)

Os números estão escritos direto no `index.html`, junto da fonte e do período.
As **barras dos gráficos** usam variáveis CSS inline; para recalcular uma posição:

| Gráfico | Escala (100%) | Fórmula |
| --- | --- | --- |
| Salários Brasil × Paraná | R$ 15.000 | `--from` = início ÷ 15.000 · `--width` = (fim − início) ÷ 15.000 · `--at` = mediana ÷ 15.000 |
| Saldo por segmento (Brasil) | 90.000 vagas | `--w` = valor ÷ 90.000 |
| Saldo por setor (Curitiba) | 16.000 vagas | `--w` = valor ÷ 16.000 |

(Multiplique por 100 para obter a porcentagem.) Se mudar o valor máximo da escala, atualize também o texto do eixo (`range-axis` / `bar-axis`).

### Regras que o conteúdo respeita
- Salário de **contratação CLT** (mediana) não é salário médio nem a remuneração de quem já está empregado, e não inclui autônomos, PJ ou servidores estatutários.
- Dados do **setor da construção civil** (CBIC e Prefeitura de Curitiba) não são dados exclusivos de engenheiros civis.
- Não há dados salariais municipais; o indicador de Curitiba é de **saldo de empregos do setor**.

## Fontes consultadas

A lista completa, com título, instituição e link, está no rodapé do site (seção 08). Dados de 2026 conferidos em 11/11/2026.
Antes de publicar, abra os links uma última vez: páginas de notícias e de órgãos públicos podem mudar de endereço.

## Funcionalidades implementadas

- Menu fixo com âncoras, indicação da seção ativa e menu móvel (fecha com Esc e ao escolher um item).
- Rolagem suave e animações discretas de entrada (desligadas com `prefers-reduced-motion`).
- Linha do tempo interativa com abas acessíveis (clique, setas, Home/End e botões Anterior/Próximo).
- Cartões de áreas de atuação com detalhes expansíveis.
- Gráficos de mercado feitos com HTML/CSS a partir de dados reais e identificados.
- Galeria pronta para fotos reais, com lightbox acessível.
- Botão de voltar ao topo; estados de foco visíveis; links externos com `rel="noopener noreferrer"`.
- Sem JavaScript, todo o conteúdo continua legível (linha do tempo empilhada, gráficos visíveis).

## Acessibilidade e desempenho

HTML semântico (`header`, `nav`, `main`, `section`, `article`, `footer`), hierarquia de títulos sem saltos, contraste revisado
(laranja mais escuro sobre fundos claros), navegação por teclado, textos alternativos e ilustrações em SVG leves (sem imagens pesadas).
