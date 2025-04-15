export function getInfoFile(file: string) {
    const matches = file.match(/^data:(.+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        throw new Error('Format de base64 invalide');
    }

    const type = matches[1]; // "image/jpeg"
    const base64Data = matches[2]; // contenu base64 pur

    // 1. Obtenir l’extension à partir du type MIME
    const extension = type.split('/')[1]; // "jpeg"

    // 2. Calculer la taille en bytes
    const size = Math.ceil((base64Data.length * 3) / 4 - (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0));

    return {
        type,
        extension,
        size,
        base64Data,
    };
}