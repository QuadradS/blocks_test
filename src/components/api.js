const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getChain = async () => {
  await sleep(300);
  return 'Mainnet';
};

export const getTokenMetadata = async () => {
  await sleep(300);
  return ({
    name: 'USDT',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    website: 'https://qwerty.com/',
    docs: 'http://asdfgh.com/',
  });
};

export const getTokenInfo = async (id) => {
  await sleep(600);
  return ({
    id,
    contract: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF',
  });
};