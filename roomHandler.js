import {v4 as uuidV4} from 'uuid'

const rooms={}

export const roomHandler= (socket)=>{
    const createRoom =()=>{
        const roomId = uuidV4()
        rooms[roomId] = []
        socket.emit('room-created',{roomId})
        console.log('user created room')
    }
    const joinRoom =({roomId,peerId})=>{
        if(rooms[roomId]){
            console.log('user joined room',roomId,peerId)
            rooms[roomId].push(peerId)
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', {peerId})
            socket.emit('get-users',{
                roomId,
                participants:rooms[roomId]
            })
        }
       socket.on('disconnect',()=>{
        console.log('user left the room',peerId)
        leaveRoom({roomId, peerId})
       })
    }
    const leaveRoom = ({ peerId, roomId }) => {
        if (rooms[roomId]) { // Check if the room exists
            rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
            socket.to(roomId).emit('user-disconnected', peerId);
        } else {
            console.log(`Room ${roomId} does not exist.`);
        }
    };
    socket.on('create-room',createRoom)
    socket.on("join-room", joinRoom)
}