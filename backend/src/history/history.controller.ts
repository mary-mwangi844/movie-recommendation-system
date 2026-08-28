import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AddHistoryDto } from './dto/add-history.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Post(':movieId')
  async add(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddHistoryDto,
  ) {
    return this.historyService.add(movieId, userId, dto);
  }

  @Get()
  async getHistory(@CurrentUser('id') userId: string) {
    return this.historyService.getHistory(userId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.historyService.delete(id, userId);
  }
}
