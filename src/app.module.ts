import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configurations from './configurations';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { User } from './modules/users/models/user.models';
import { UsersModule } from './modules/users/users.module';
import { Watchlist } from './modules/watchlist/models/watchlist.model';
import { WatchlistModule } from './modules/watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        synchronize: true,
        autoLoadModels: true,
        models: [User, Watchlist],
      }),
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    WatchlistModule,
  ],
})
export class AppModule {}
