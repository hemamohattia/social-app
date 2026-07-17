import QRCode from 'qrcode';

export const generateQR = async (text: string): Promise<string> => {
    return await QRCode.toDataURL(text);
};