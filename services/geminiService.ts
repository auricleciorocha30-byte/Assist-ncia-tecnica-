
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é um Engenheiro de Suporte Técnico Sênior especializado em informática e sistemas de segurança eletrônica (CFTV, Redes, Hardware, Windows/Linux).
Seu objetivo é ajudar técnicos em campo a resolver problemas complexos.
- Forneça diagnósticos passo a passo.
- Sugira ferramentas de teste.
- Se o problema for com câmeras, considere: cabeamento (BNC/RJ45), fonte de alimentação, configurações de rede, protocolos ONVIF/RTSP.
- Se for informática: hardware (RAM, HD/SSD), software (drivers, sistema operacional), rede (IP, gateway, DNS).
- Seja conciso e profissional em Português do Brasil.
`;

export const getTechnicalAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    // Fix: Access response.text as a property, which is already correct but ensured
    return response.text || "Desculpe, não consegui processar seu pedido agora.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o assistente inteligente.";
  }
};
