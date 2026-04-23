import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(token, onConnect, onDisconnect) {
        if (this.client && this.client.connected) return;

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                console.log('STOMP Connected');
                if (onConnect) onConnect();
            },
            onDisconnect: () => {
                console.log('STOMP Disconnected');
                if (onDisconnect) onDisconnect();
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
            },
            debug: (str) => {
                // console.log(str);
            }
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.subscriptions.clear();
        }
    }

    subscribe(topic, callback) {
        if (!this.client || !this.client.connected) return;
        
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).unsubscribe();
        }

        const subscription = this.client.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
        });
        
        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    sendMessage(destination, body) {
        if (!this.client || !this.client.connected) return;
        this.client.publish({
            destination,
            body: JSON.stringify(body)
        });
    }

    isConnected() {
        return this.client && this.client.connected;
    }
}

const websocketService = new WebSocketService();
export default websocketService;
