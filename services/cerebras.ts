import type { AIService, ChatMessage } from '../types';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

export const cerebrasFactory = {
  isEnabled: () => !!process.env.CEREBRAS_API_KEY,
  create: (): AIService => {
    const client = new Cerebras();

    return {
      name: 'Cerebras',
      async chat(messages: ChatMessage[]) {
        const stream = await client.chat.completions.create({
          messages: messages as any,
          model: 'llama3.1-8b',
          stream: true,
          max_completion_tokens: 40960,
          temperature: 0.6,
          top_p: 0.95
        });

        return (async function* () {
          for await (const chunk of stream) {
            yield (chunk as any).choices[0]?.delta?.content || ''
          }
        })()
      }
    }
  }
}