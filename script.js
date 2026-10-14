// Base de respostas prontas locais (Fallback rápido)
const respostasProntas = [
    {
        keywords: ["nba", "basquete", "campeão", "maior"],
        resposta: "Os maiores campeões da história da NBA são o Boston Celtics e o Los Angeles Lakers, ambos empatados com 17 títulos de campeonatos conquistados cada.",
        noticia: "https://news.google.com/search?q=maior+campeao+nba"
    },
    {
        keywords: ["copa", "futebol", "brasil", "titulos", "mundo"],
        resposta: "A Seleção Brasileira de Futebol é a maior vencedora da história da Copa do Mundo FIFA, com 5 títulos conquistados (1958, 1962, 1970, 1994 e 2002).",
        noticia: "https://news.google.com/search?q=titulos+selecao+brasileira+copa+do+mundo"
    },
    {
        keywords: ["volei", "vôlei", "olimpicos", "medalhas", "olimpiadas"],
        resposta: "O vôlei brasileiro possui uma rica história olímpica, contabilizando 6 medalhas de ouro (3 na quadra masculina, 1 na quadra feminina e 2 na praia).",
        noticia: "https://news.google.com/search?q=medalhas+volei+brasil+olimpiadas"
    }
];

// Elementos da DOM
const perguntaInput = document.getElementById("perguntaInput");
const btnPerguntar = document.getElementById("btnPerguntar");
const respostaContainer = document.getElementById("respostaContainer");
const textoResposta = document.getElementById("textoResposta");
const linkNoticia = document.getElementById("linkNoticia");
const btnVoz = document.getElementById("btnVoz");
const tags = document.querySelectorAll(".tag");

// Event Listener do Botão Perguntar
btnPerguntar.addEventListener("click", processarPergunta);

// Permitir pressionar ENTER no Input
perguntaInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") processarPergunta();
});

// Clique nas tags prontas
tags.forEach(tag => {
    tag.addEventListener("click", () => {
        perguntaInput.value = tag.getAttribute("data-question");
        processarPergunta();
    });
});

// Função principal de processamento
function processarPergunta() {
    const pergunta = perguntaInput.value.trim().toLowerCase();
    
    if (!pergunta) {
        alert("Por favor, digite uma pergunta sobre esportes!");
        return;
    }

    // Parar leitura de voz anterior, se houver
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    // Procura por correspondência nas respostas locais
    let respostaAchada = respostasProntas.find(item => 
        item.keywords.some(kw => pergunta.includes(kw))
    );

    if (respostaAchada) {
        exibirResposta(respostaAchada.resposta, respostaAchada.noticia);
    } else {
        // Resposta genérica formatada se a pergunta for inédita
        const respostaGenerica = `Sobre "${perguntaInput.value}": Os dados e estatísticas recentes do mundo dos esportes mostram atualizações constantes nas principais ligas nacionais e internacionais.`;
        const linkBusca = `https://news.google.com/search?q=${encodeURIComponent(perguntaInput.value)}`;
        
        exibirResposta(respostaGenerica, linkBusca);
    }
}

// Exibir Resultado na Tela
function exibirResposta(texto, urlNoticia) {
    textoResposta.textContent = texto;
    linkNoticia.href = urlNoticia;
    respostaContainer.classList.remove("hidden");
}

// Leitura por Voz via IA / Web Speech API
btnVoz.addEventListener("click", () => {
    if (!('speechSynthesis' in window)) {
        alert("Seu navegador não suporta leitura por voz.");
        return;
    }

    // Se já estiver lendo, cancela
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btnVoz.querySelector("span").textContent = "Ouvir Voz";
        return;
    }

    const mensagem = new SpeechSynthesisUtterance(textoResposta.textContent);
    mensagem.lang = 'pt-BR';
    mensagem.rate = 1.0;

    mensagem.onstart = () => {
        btnVoz.querySelector("span").textContent = "Parar Voz";
    };

    mensagem.onend = () => {
        btnVoz.querySelector("span").textContent = "Ouvir Voz";
    };

    window.speechSynthesis.speak(mensagem);
});