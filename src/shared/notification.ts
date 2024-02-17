import admin from 'firebase-admin';
import { Message } from 'firebase-admin/messaging';

/** Send a notification to a device based on FCM token. */
export async function sendNotificationToDevice(token: string, title: string, body: string) {

    const message: Message = {
        notification: {
            title, body,
        },
        // topic: "connect_topic",
        android: {
            priority: "high"
        },
        token,
    };


    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message: ", response);
    } catch (err) {
        console.error("Error sending message: ", err);
    }
}