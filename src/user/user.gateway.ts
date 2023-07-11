/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8001, { cors: '*:*' })
export class UserGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('user')
    handleUpdateUser(user: any) {
        this.server.emit('updatedUser', user);
    }


}