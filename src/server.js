import Fastify from 'fastify'; // Import Fastify framework

// Create a Fastify instance with logging enabled
const fastify = Fastify({ logger: true });

/**
 * Defines a GET route at the root ('/') that responds with a JSON message.
 * @route GET /
 * @returns {Object} JSON response with a message.
 */
fastify.get('/', async (request, reply) => {
    return { message: 'Hello World' };
});

/**
 * Starts the Fastify server.
 * Reads the port and host from environment variables or uses default values.
 * Handles errors during server startup.
 */
const start = async () => {
    const PORT = process.env.APP_PORT || 3000; // Server port (default: 3000)
    const HOST = process.env.APP_HOST || '0.0.0.0'; // Server host (default: 0.0.0.0)

    try {
        // Start the server on the specified host and port
        await fastify.listen({ port: PORT, host: HOST });
        fastify.log.info(`Server listening on http://${HOST}:${PORT}`);
    } catch (err) {
        // Log the error and exit the process if a problem occurs
        fastify.log.error(err);
        process.exit(1);
    }
};

// Call the function to start the server
start();
