import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { initSocketServer } from '@/lib/server/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.io déjà initialisé');
    res.end();
    return;
  }

  console.log('🚀 Initialisation de Socket.io...');

  const io = initSocketServer(res.socket.server);
  res.socket.server.io = io;

  res.end();
}
