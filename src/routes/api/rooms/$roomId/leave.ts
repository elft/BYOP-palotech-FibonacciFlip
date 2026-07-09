import { createFileRoute } from '@tanstack/react-router'
import { updateRoom } from '#/features/rooms/server/room-store'
import { publishRoomEvent } from '#/features/rooms/server/room-event-bus'

export const Route = createFileRoute('/api/rooms/$roomId/leave')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const roomId = params.roomId;
                const body = await request.json();
                const userName = body.participantName;

                const updatedRoom = updateRoom(roomId, (existingRoom) => ({
                    ...existingRoom,
                    participants: existingRoom.participants.filter((participant) => participant.name !== userName),
                }));

                if (!updatedRoom) {
                    return Response.json({ error: 'Room not found.' }, { status: 404 });
                }

                publishRoomEvent({
                    type: 'room.updated',
                    roomId: roomId,
                    room: updatedRoom,
                });

                return Response.json({ room: updatedRoom });
            }
        },
    },
});