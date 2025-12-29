import { Groq } from 'groq-sdk';
import type { AIService, ChatMessage } from '../types';

export const groqFactory = {
  isEnabled: () => !!process.env.GROQ_API_KEY,
  create: (): AIService => {
    const groq = new Groq();
    return {
      name: 'Groq',
      async chat(messages: ChatMessage[]) {
        const chatCompletion = await groq.chat.completions.create({
          messages,
          model: "moonshotai/kimi-k2-instruct-0905",
          temperature: 0.6,
          max_completion_tokens: 4096,
          top_p: 1,
          stream: true,
          stop: null
        });

        return (async function* () {
          for await (const chunk of chatCompletion) {
            yield chunk.choices[0]?.delta?.content || ''
          }
        })()
      }
    }
  }
}

