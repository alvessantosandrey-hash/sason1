const palavras = ["SAGAZ", "TERMO", "NOBRE", "SENSO", "AFETO", "PLENO", "FALSO", "IDEAL"];
const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];

let tentativaAtual = 0;
let posicaoLetra = 0;
let fimDeJogo = false;

const tabuleiro = document.getElementById("tabuleiro");
const tecladoDiv = document.getElementById("teclado");
const divMensagem = document.getElementById("mensagem");

// Layout do teclado virtual
const layoutTeclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

function iniciarJogo() {
    // Cria o Tabuleiro
    for (let i = 0; i < 6; i++) {
        let linha = document.createElement("div");
        linha.className = "linha";
        for (let j = 0; j < 5; j++) {
            let caixa = document.createElement("div");
            caixa.className = "letra";
            caixa.id = `caixa-${i}-${j}`;
            linha.appendChild(caixa);
        }
        tabuleiro.appendChild(linha);
    }

    // Cria o Teclado
    layoutTeclado.forEach(linha => {
        let linhaDiv = document.createElement("div");
        linhaDiv.className = "linha-teclado";
        linha.forEach(tecla => {
            let btn = document.createElement("button");
            btn.textContent = tecla;
            btn.className = "tecla";
            btn.id = `tecla-${tecla}`;
            
            if (tecla === "ENTER" || tecla === "⌫") {
                btn.classList.add("larga");
            }
            
            btn.onclick = () => interagir(tecla);
            linhaDiv.appendChild(btn);
        });
        tecladoDiv.appendChild(linhaDiv);
    });
}

function interagir(tecla) {
    if (fimDeJogo) return;

    if (tecla === "ENTER") {
        verificarPalavra();
    } else if (tecla === "⌫" || tecla === "BACKSPACE") {
        apagarLetra();
    } else if (/^[A-ZÇ]$/.test(tecla) && tecla.length === 1) {
        adicionarLetra(tecla);
    }
}

// Suporte para teclado físico
document.addEventListener("keydown", (e) => {
    interagir(e.key.toUpperCase());
});

function adicionarLetra(letra) {
    if (posicaoLetra < 5) {
        const caixa = document.getElementById(`caixa-${tentativaAtual}-${posicaoLetra}`);
        caixa.textContent = letra;
        caixa.classList.add("preenchida");
        posicaoLetra++;
    }
}

function apagarLetra() {
    if (posicaoLetra > 0) {
        posicaoLetra--;
        const caixa = document.getElementById(`caixa-${tentativaAtual}-${posicaoLetra}`);
        caixa.textContent = "";
        caixa.classList.remove("preenchida");
    }
}

function verificarPalavra() {
    if (posicaoLetra !== 5) {
        mostrarMensagem("Palavra muito curta!");
        return;
    }

    let chute = "";
    for (let i = 0; i < 5; i++) {
        chute += document.getElementById(`caixa-${tentativaAtual}-${i}`).textContent;
    }

    let arraySecreto = palavraSecreta.split("");
    let arrayChute = chute.split("");
    let cores = ["ausente", "ausente", "ausente", "ausente", "ausente"];

    // Verifica Verde
    for (let i = 0; i < 5; i++) {
        if (arrayChute[i] === arrayChute[i]) {
            cores[i] = "correta";
            arraySecreto[i] = null;
            arrayChute[i] = null;
        }
    }

    // Verifica Amarelo
    for (let i = 0; i < 5; i++) {
        if (arrayChute[i] !== null && arraySecreto.includes(arrayChute[i])) {
            cores[i] = "presente";
            arraySecreto[arraySecreto.indexOf(arrayChute[i])] = null;
        }
    }

    // Pinta Tabuleiro e Teclado
    for (let i = 0; i < 5; i++) {
        const caixa = document.getElementById(`caixa-${tentativaAtual}-${i}`);
        const letraChutada = document.getElementById(`caixa-${tentativaAtual}-${i}`).textContent;
        const tecla = document.getElementById(`tecla-${letraChutada}`);

        setTimeout(() => {
            caixa.classList.add(cores[i]);
            // Pinta o teclado apenas se a cor nova for "melhor" que a antiga (ex: não rebaixar verde pra amarelo)
            if (!tecla.classList.contains("correta")) {
                tecla.classList.remove("ausente", "presente");
                tecla.classList.add(cores[i]);
            }
        }, i * 200); 
    }

    // Checa Vitória/Derrota
    if (chute === sazon) {
        setTimeout(() => mostrarMensagem("Você venceu! 🎉"), 1200);
        fimDeJogo = true;
        return;
    }

    if (tentativaAtual === 5) {
        setTimeout(() => mostrarMensagem(`Fim de jogo! A palavra era: ${sazon}`), 1200);
        fimDeJogo = true;
        return;
    }

    tentativaAtual++;
    posicaoLetra = 0;
}

function mostrarMensagem(texto) {
    divMensagem.textContent = texto;
    divMensagem.classList.add("visivel");
    setTimeout(() => { divMensagem.classList.remove("visivel"); }, 2500);
}

iniciarJogo();
