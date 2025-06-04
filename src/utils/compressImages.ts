import imageCompression from 'browser-image-compression';

const normalizeFileName = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9.]/g, '-');
};

export const compressImages = async (files: File[]): Promise<File[]> => {
  const compressedFiles: File[] = [];

  for (const file of files) {
    const isWebP = file.type === 'image/webp';

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      ...(isWebP ? {} : { fileType: 'image/webp' }),
      initialQuality: 0.9,
    };

    try {
      const compressed = await imageCompression(file, options);
      const baseName = file.name.replace(/\.\w+$/, '.webp');
      const cleanName = normalizeFileName(baseName);

      const newFile = new File([compressed], cleanName, {
        type: 'image/webp',
        lastModified: Date.now(),
      });

      compressedFiles.push(newFile);
    } catch (error) {
      console.warn('Error al comprimir imagen:', error);
      compressedFiles.push(file);
    }
  }

  return compressedFiles;
};
