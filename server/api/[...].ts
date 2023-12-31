import { useBase, createRouter, defineEventHandler } from 'h3';
import { useSSE } from '@/server/utils/sse';
import { randomUUID } from 'node:crypto';

const router = createRouter();

const sse = useSSE();

router.post(
  '/sse',
  defineEventHandler(async (event) => {
    const body = await readBody(event);

    sse.broadcasts('trigger', body);

    return {
      success: true
    };
  })
);

router.get(
  '/sse',
  defineEventHandler((event) => {
    const client = {
      id: randomUUID(),
      event
    };
    sse.addClient(client);

    sse.broadcast(client, 'connected', { message: 'Connection established' });

    setInterval(() => sse.broadcast(client, 'update', { data: 'updated' }), 1000);

    event.node.res.on('close', () => sse.removeClient(client.id));

    event._handled = true;
  })
);

export default useBase('/api', router.handler);
