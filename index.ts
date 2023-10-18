import express from 'express';
import { createServer } from 'http';
import 'dotenv/config'
import { Server, Socket } from "socket.io";
import { ExtendedError } from 'socket.io/dist/namespace';
import cors from 'cors';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, PLCNotificationType, ENotificationReason} from './serverTypes'

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World")
})
const server = createServer(app);

const socketIO = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: true
    },
});

const middlewaresSockets = socketIO.of("/middlewares");
const clientsSockets = socketIO.of("/clients");

//middlewares
const authorizationMiddleware = (socket: Socket<ServerToClientEvents, ServerToClientEvents, InterServerEvents, SocketData>, next: (err?: ExtendedError | undefined) => void) => {
    if (socket.handshake.query["type"] === undefined)
        next(new Error("Client type not defined"));

    next()//verifica che il type sia definito nella query
}

socketIO.use(authorizationMiddleware);
middlewaresSockets.use(authorizationMiddleware)
clientsSockets.use(authorizationMiddleware)

middlewaresSockets.on('connection', (socket: Socket) => {
    console.log(socket.handshake.auth)

    socket.on("status", (payload: string) => {
        clientsSockets.emit("status", payload)
    })
    socket.on("notification", (payload: string) => {
        const notification: PLCNotificationType = JSON.parse(payload)
        console.log("notification received: ", notification)
        if(notification.reason === ENotificationReason.ENotificationReason_GenericMessage)
        {
            clientsSockets.emit("notification", payload)
        }
    })
    socket.on("disconnect", (reason, description) => {
        const logTxt = "CLIENT "+ socket.id + " disconnected => "+ reason
        console.log(logTxt)
    })

    console.log("CLIENT CONNECTED middlewares", socket.id)
})

clientsSockets.on('connection', (socket: Socket) => {
    socket.on("abort", () => {
        middlewaresSockets.emit("abort")
    })
    socket.on("disconnect", (reason, description) => {
        const logTxt = "CLIENT "+ socket.id + " disconnected => "+ reason
        console.log(logTxt)
    })
    console.log("CLIENT CONNECTED clients", socket.id)
})

const port = process.env.SERVER_LISTENING_PORT ? process.env.SERVER_LISTENING_PORT : "8080"
server.listen(port, () => { console.log("Listening on port", port) });
