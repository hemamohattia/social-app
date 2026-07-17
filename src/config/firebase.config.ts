import admin from 'firebase-admin';
import fs from 'fs';
import { resolve } from 'path';

let initialized = false;

export const initFirebase = () => {
    if (initialized) return;
    const serviceAccount = JSON.parse(
        fs.readFileSync(resolve('./src/config/firebase-admin-key.json')) as unknown as string
    );
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
};

export const sendNotificationToToken = async ({ token, data }: { token: string, data: { title: string, body: string } }) => {
    return await admin.messaging().send({ token, data });
};