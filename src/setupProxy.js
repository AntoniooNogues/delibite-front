import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const setupProxy = (app: Application): void => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
        })
    );
};

export default setupProxy;