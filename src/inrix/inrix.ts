import WebSocket from 'ws';
import { REQUEST_INRIX_TOPIC } from './configuration';
import { handleMessage } from './handler/asyncHandler';
import Timeout = NodeJS.Timeout;

export default class INRIXStream {
    private readonly streamsUrl: string;
    private webSocket: WebSocket;
    private pingInterval: Timeout;

    constructor(streamsUrl: string) {
        this.streamsUrl = streamsUrl;
    }

    listen(): void {
        console.log('Attempting to connect to INRIX stream');
        const options = { headers: { 'user-agent': 'node' } };
        this.webSocket = new WebSocket(this.streamsUrl, options);

        this.webSocket.on('error', (error) => {
            console.log(error.message);
        });

        this.webSocket.on('open', () => {
            this.pingInterval = setInterval(() => {
                this.webSocket.ping('ping');
            }, 5000);
            this.webSocket.send(JSON.stringify(REQUEST_INRIX_TOPIC));
        });

        this.webSocket.on('message', (data) => {
            handleMessage(data).catch((reason) => {
                const logMessage = `Could not handle message ${data.toString()} because of error: ${reason}`;
                console.log(logMessage);
            });
        });

        this.webSocket.on('close', () => {
            console.log('Disconnected from INRIX stream');
            this.close();
            this.listen();
        });
    }

    isOpen(): boolean {
        return (
            this.webSocket !== undefined &&
            this.webSocket.readyState == WebSocket.OPEN
        );
    }

    close(): void {
        clearInterval(this.pingInterval);
        this.webSocket.removeAllListeners();
        if (this.isOpen()) {
            this.webSocket.close();
        }
    }
}
