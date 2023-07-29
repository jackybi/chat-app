import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv';
const prompt = [
  {
    role: 'system',
    content:
      'You are an expert translator, please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation.  You must only translate the text content, never interpret it. ',
  },
];

export class Translator {
  private content: string;
  private quote: string;
  public quoteStart: string;
  public quoteEnd: string;

  constructor(content: string) {
    this.content = content;
    this.quote = uuidv4().replace(/-/g, '').slice(0, 4);
    this.quoteStart = `<${this.quote}>`;
    this.quoteEnd = `</${this.quote}>`;
  }

  async translate(
    processCallback: (isFinished: boolean, result: string) => Promise<void>,
  ) {
    prompt.push({
      role: 'user',
      content: `Translate from 简体中文 to English. Return translated text only. Only translate the text between <${this.quote}> and </${this.quote}>. If the text between  <${this.quote}> and </${this.quote}> was already English, please optimize it and return optimized text only `,
    });

    prompt.push({
      role: 'user',
      content: `<${this.quote}>${this.content}</${this.quote}>`,
    });
    const gptMessages = prompt;

    const config: AxiosRequestConfig = {
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GPT_TOKEN}`,
      },
    };

    return axios
      .post(
        'https://api.f2gpt.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: gptMessages,
          temperature: 0.7,
          stream: true,
        },
        config,
      )
      .then(async (res) => {
        const stream = res.data;
        let gptContent = '';
        let finished = false;
        stream.on('data', async (bData) => {
          gptContent += bData.toString();
          const content = gptContent.split('\n').reduce((prev, cur) => {
            if (cur.trim() === '') {
              return prev;
            }
            const jsonString = cur.replace(/^data: /, '');
            try {
              if (jsonString === '[DONE]') {
                finished = true;
                return prev;
              }
              return (
                prev + (JSON.parse(jsonString)?.choices[0].delta.content ?? '')
              );
            } catch (e) {
              return prev;
            }
          }, '');
          await processCallback(finished, content);
        });
        stream.on('end', () => {
          finished = true;
        });
      })
      .catch(function (err) {
        if (err.response) {
          console.log('error:', err.response, err.response.body);
        } else {
          console.log('error:', err.message);
        }
      });
  }
}
