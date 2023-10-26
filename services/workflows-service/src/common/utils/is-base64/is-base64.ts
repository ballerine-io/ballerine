export const isBase64 = (str: string) => {
  // Check if the string starts with a Base64 prefix and, if so, remove it
  const base64PrefixRegex = /^data:.*?;base64,/;
  const content = str?.replace(base64PrefixRegex, '') || str;

  // Regular expression to check if the content is valid Base64
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  return base64Regex.test(content);
};
