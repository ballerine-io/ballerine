export const svgToPng = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');

      resolve(dataUrl);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = imageUrl;
  });
};
