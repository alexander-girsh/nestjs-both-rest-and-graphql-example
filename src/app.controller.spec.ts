import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('/ endpoint should redirect', async () => {
    expect(appController.getHealthz()).toEqual('OK');
  });

  it('/healthz endpoint should be defined', () => {
    expect(appController.getIndex()).toEqual('REDIRECTING...');
  });
});
