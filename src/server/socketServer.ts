import WebSocket, { WebSocketServer } from 'ws';
import { filterInitialAlerts } from './retrieveInitialAlerts';
let wsServer: WebSocketServer;

const NORMAL_CLOSE = 1000;

export function startSocketServer(port: number): WebSocketServer {
    wsServer = new WebSocketServer({ port: port });
    wsServer.on('connection', (socket: WebSocket) => {
        filterInitialAlerts().then((alertArray) => {
            alertArray.forEach((alert) => {
                socket.send(JSON.stringify(alert));
            });
        });
    });
    wsServer.on('error', (error) => {
        console.log(error.message);
    });
    return wsServer;
}

export function stopSocketServer(): void {
    wsServer.clients.forEach((client: WebSocket) => {
        client.close(NORMAL_CLOSE);
    });
    wsServer.close();
}

export function publish(message: string): void {
    wsServer.clients.forEach((client: WebSocket) => {
        client.send(message);
    });
}
