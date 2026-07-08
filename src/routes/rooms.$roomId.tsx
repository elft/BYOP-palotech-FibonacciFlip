import { createFileRoute } from '@tanstack/react-router'
import { RoomDashboard } from '#/features/rooms/components/RoomDashboard'

export const Route = createFileRoute('/rooms/$roomId')({
  component: RoomRoute,
})

function RoomRoute() {
  const { roomId } = Route.useParams()

  return <RoomDashboard roomId={roomId} />
}
