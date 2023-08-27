export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      resolve(base64String as string);
    };
    reader.onerror = error => {
      reject(error);
    };
  });
}
