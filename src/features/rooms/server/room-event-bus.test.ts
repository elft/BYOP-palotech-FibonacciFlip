import { describe, expect, it } from 'vitest';
import { openRoomEventStream} from './room-event-bus';
describe('room-event-bus', () => {
  it('should open a stream for a room', () => {
    const roomId = 'room-1';
    const stream = openRoomEventStream(roomId, new AbortController().signal);
    const reader = stream.getReader();
    expect(reader).toBeDefined();
   })
})