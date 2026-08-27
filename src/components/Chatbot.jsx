import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

// Chatbot "Campus Concierge" — responde dúvidas frequentes com base em respostas pré-definidas
const KNOWLEDGE = [
  {
    keys: ["matricula", "matrícula", "inscri", "como entrar", "vaga"],
    answer:
      "As matrículas para o próximo ano letivo estão abertas até 15 de dezembro. Acesse a página de Contato e preencha o formulário ou ligue para (11) 4000-1822.",
    links: [{ label: "Ir para Contato", to: "/contato" }],
  },
  {
    keys: ["calendario", "calendário", "feriado", "recesso", "letivo"],
    answer:
      "O calendário escolar completo está disponível na página de Calendário, com provas, eventos, feriados e reuniões.",
    links: [{ label: "Ver Calendário", to: "/calendario" }],
  },
  {
    keys: ["biblioteca", "livro", "acervo", "ebook", "e-book", "material"],
    answer:
      "Nossa biblioteca digital possui mais de 50.000 títulos. Acesse a seção Biblioteca Digital para baixar livros, apostilas e materiais de apoio.",
    links: [{ label: "Biblioteca Digital", to: "/biblioteca" }],
  },
  {
    keys: ["prova", "simulado", "avaliação", "nota"],
    answer:
      "O calendário de provas e os simulados estão no Calendário Escolar. Consulte também o mural de avisos para comunicados de última hora.",
    links: [{ label: "Calendário de Provas", to: "/calendario" }],
  },
  {
    keys: ["horario", "horário", "aula", "expediente"],
    answer: "O expediente escolar é de segunda a sexta, das 7h30 às 17h30. Os horários por turma estão disponíveis no portal do aluno.",
  },
  {
    keys: ["contato", "telefone", "email", "e-mail", "endereco", "endereço"],
    answer: "Telefone: (11) 4000-1822 · E-mail: contato@cetisebastiaosoribeiro.edu.br · Endereço: Av. do Conhecimento, 1822 — Centro.",
    links: [{ label: "Fale Conosco", to: "/contato" }],
  },
  {
    keys: ["curso", "turma", "ensino", "modalidade"],
    answer:
      "Oferecemos Ensino Fundamental I e II e Ensino Médio, com cursos complementares de robótica, idiomas e preparatório vestibular.",
    links: [{ label: "Ver Cursos", to: "/cursos" }],
  },
  {
    keys: ["olá", "ola", "oi", "bom dia", "boa tarde", "boa noite", "ajuda"],
    answer:
      "Olá! Sou o assistente virtual do CETI. Posso ajudar com matrículas, calendário, biblioteca, provas e mais. Sobre o que você gostaria de saber?",
  },
];

function findAnswer(text) {
  const lower = text.toLowerCase();
  const match = KNOWLEDGE.find((k) => k.keys.some((key) => lower.includes(key)));
  if (match) return match.answer + (match.links ? "" : "");
  return "Desculpe, não encontrei uma resposta exata. Tente perguntar sobre matrículas, calendário, biblioteca, provas ou contato. Você também pode usar a página de Contato para falar com a secretaria.";
}

const initialMessage = {
  from: "bot",
  text: "Olá! 👋 Sou o Concierge CETI, seu assistente virtual. Como posso ajudar hoje?",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  const send = (override) => {
    const text = (override ?? input).trim();
    if (!text) return;
    const answer = findAnswer(text);
    setMessages((m) => [...m, { from: "user", text }, { from: "bot", text: answer }]);
    setInput("");
  };

  const suggestions = ["Como faço matrícula?", "Calendário de provas", "Biblioteca digital"];

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[440px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Concierge CETI</p>
                <p className="text-[11px] opacity-80">Online agora</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fechar chat" className="rounded-full p-1 transition hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensagens */}
          <div ref={bodyRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-background/40 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <p
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </p>
                {m.from === "user" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <User className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-card p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua dúvida..."
              className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm outline-none ring-primary transition focus:ring-2"
            />
            <button
              onClick={send}
              aria-label="Enviar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir assistente"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/40 transition-transform hover:scale-110 hover:rotate-3"
      >
        {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}