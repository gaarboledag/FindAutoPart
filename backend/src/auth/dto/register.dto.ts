import { IsEmail, IsEnum, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({ example: 'taller@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'MiClave$Segura2026!' })
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)',
        },
    )
    password: string;

    @ApiProperty({ enum: Role, example: Role.TALLER })
    @IsEnum(Role)
    role: Role;
}
