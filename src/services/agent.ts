import OpenIA from 'openai';
import { createPrompt } from './prompt';

class Agent {
  openai;
  GPT_MODEL = 'gpt-4o';
  conversationHistory: Array<OpenIA.ChatCompletionMessageParam> = [];

  constructor(config: { apiKey: string | undefined }) {
    this.openai = new OpenIA(config);
  }

  addToConversation(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({ role, content });

    if (this.conversationHistory.length > 10) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Asks a question to the OpenAI chat model and returns the response.
   * @param question - The question to ask the chat model.
   * @returns A Promise that resolves to the response from the chat model.
   */
  async ask(question: string): Promise<string> {
    console.log('Question:', question);

    this.addToConversation('user', question);

    const response = await this.openai.chat.completions.create({
      messages: createPrompt(this.conversationHistory),
      model: this.GPT_MODEL,
      max_tokens: 150,
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content || '';
    console.log(`Model: ${response.model}, Usage: ${JSON.stringify(response.usage)}`);

    this.addToConversation('assistant', answer);

    return answer;
  }
}

export default Agent;
