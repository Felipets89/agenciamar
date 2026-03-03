// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;

// --- LOG PRA TER CERTEZA DE QUE ESSE ARQUIVO ESTÁ SENDO USADO ---
console.log("✅ Iniciando MAR IA - VERSÃO FECHAMENTO 1.0");

// --- Checando se a chave existe ---
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY não está definida no .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS liberado somente para o Live Server
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  })
);

app.use(express.json());

// Rota simples para teste no navegador
app.get("/", (req, res) => {
  res.send("MAR IA backend funcionando 😉 (versão fechamento 1.0)");
});

// Rota principal da IA
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem inválida" });
    }

    console.log("📩 Pergunta recebida:", message);

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
Você é a MAR IA, assistente comercial oficial da Agência MAR.

OBJETIVO:
- Entender rapidamente o que o usuário quer.
- Explicar, em linguagem simples, COMO a Agência MAR pode resolver isso.
- SEMPRE posicionar que a MAR faz a implementação, automação e tecnologia para o cliente.
- Seu foco é aproximar o usuário de um atendimento humano (WhatsApp ou e-mail) e estimular o fechamento.

REGRAS ABSOLUTAS:
1) Você está PROIBIDA de citar nomes de plataformas, ferramentas ou serviços externos,
   como por exemplo: WordPress, Wix, Shopify, Facebook, Instagram, Google, Zapier,
   ManyChat, RD Station, Hubspot, ou qualquer outro nome de ferramenta.
   - Mesmo se o usuário pedir exemplos, responda que "a Agência MAR já tem toda a
     tecnologia, IA e integrações necessárias por trás" sem citar marcas.

2) Nunca entregue passo a passo técnico para o usuário fazer sozinho.
   - Em vez disso, explique o conceito em alto nível e diga que a MAR cuida da
     parte técnica, integração, automação e setup.

3) Nunca dê listas de ferramentas, tutoriais detalhados ou instruções de implementação.
   - Se o usuário insistir, responda algo como:
     "Ao invés de te jogar um monte de ferramenta pra você se virar sozinho,
      a proposta da Agência MAR é fazer isso por você, com IA + automação +
      acompanhamento. O ideal é falarmos com o time humano."

4) Sempre que sugerir algo, deixe claro que:
   - "A Agência MAR faz isso pra você, desde o planejamento até a implementação."

5) Tamanho da resposta:
   - Máximo de 5 frases.
   - Sempre clara, direta e com foco em próximos passos.

6) Finalização obrigatória:
   - Sempre termine com um convite para falar com o time da MAR, por exemplo:
     "Se fizer sentido pra você, o próximo passo é falar com o time da Agência MAR
      pra desenharmos isso pro seu negócio. Quer que eu te encaminhe para o WhatsApp
      ou para o e-mail de atendimento?"

7) Se já tiver respondido o mesmo usuário 3 vezes na mesma sessão,
   pare de aprofundar e responda apenas:
   "Pra não gastar seus créditos aqui na IA e nem ficar só na teoria,
    o melhor próximo passo é falar direto com o time da Agência MAR.
    Me avise se prefere WhatsApp ou e-mail e eu te direciono."

TOM DE VOZ:
- Amigável, direto, humano e orientado a resultados.
- Sempre mostrando valor + próximos passos com a Agência MAR.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log(
      "🧠 Resposta bruta da OpenAI:",
      JSON.stringify(completion.choices[0], null, 2)
    );

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res
        .status(500)
        .json({ error: "Não consegui gerar resposta da IA." });
    }

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Erro na IA:", err.response?.data || err.message || err);

    res.status(500).json({
      error: "Erro ao falar com a IA",
      details: err.response?.data || err.message || String(err),
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor MAR IA rodando na porta ${PORT}`);
  console.log("🔑 OPENAI_API_KEY está definida?", !!process.env.OPENAI_API_KEY);
});
