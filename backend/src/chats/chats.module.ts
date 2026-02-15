import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { StorageService } from '../common/services/storage.service';
import { ChatsGateway } from './chats.gateway';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRES_IN') || '15m',
                },
            }),
        }),
    ],
    controllers: [ChatsController],
    providers: [ChatsService, StorageService, ChatsGateway],
    exports: [ChatsService]
})
export class ChatsModule { }
