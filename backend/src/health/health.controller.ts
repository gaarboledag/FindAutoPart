import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            cors: 'enabled-all-origins', // This confirms which code is running
        };
    }

    @Get('cors-test')
    corsTest() {
        return {
            message: 'If you can see this from the browser, CORS is working',
            origin: 'all-origins-allowed',
            timestamp: new Date().toISOString(),
        };
    }
}
