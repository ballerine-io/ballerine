import axios from 'axios';

export const fetchCsvFromUrlAndConvertToBase64 = async (csvUrl: string) => {
  const response = await axios.get(csvUrl, {
    responseType: 'arraybuffer',
  });
  const buffer = response.data;
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = response.headers['content-type'];

  const base64Result = `data:${contentType};base64,${base64}`;

  return base64Result;
};
