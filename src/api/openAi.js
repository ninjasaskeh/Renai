import {apiKey} from '../constants';
import axios from 'axios';

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `${prompt} is that prompt ask you to generate an image? , simplified yes or no'`,
        },
      ],
    });
    // console.log(prompt);
    // console.log('data :', res.data.choices[0].message);
    let isArt = res.data?.choices[0]?.message?.content;
    if (isArt.toLowerCase().includes('yes')) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages || []);
    } else {
      console.log('chat gpt api call');
      return chatGptApiCall(prompt, messages || []);
    }
  } catch (error) {
    console.log('error: ', error);
    return Promise.resolve({success: false, msg: error.messages});
  }
};

const chatGptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages,
    });
    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    return Promise.resolve({success: true, data: messages});
  } catch (e) {
    console.log('error: ', error);
    return Promise.resolve({success: false, msg: error.messages});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleEndpoint, {
      prompt,
      n: 1,
      size: '512x512',
    });
    let url = res?.data.data[0]?.url;
    console.log('the url is: ', url);
    messages.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: messages});
  } catch (error) {
    console.log('error: ', error);
    return Promise.resolve({success: false, msg: error.messages});
  }
};
