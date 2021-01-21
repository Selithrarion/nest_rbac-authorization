import {
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseIntPipe,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../auth/jwt/jwt-auth.guard';
import UserEntity from './user.entity';
import { Roles } from './decorator/roles.decorator';
import UserRoles from './enum/roles.enum';
import RolesGuard from '../auth/guard/roles.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(JwtAuthenticationGuard, RolesGuard)
	@Roles(UserRoles.ADMIN)
	getAllUsers(): Promise<UserEntity[]> {
		return this.usersService.getAllUsers();
	}

	@Get(':id')
	@UseGuards(JwtAuthenticationGuard)
	getById(
		@Param(
			'id',
			new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
		)
		id: number
	): Promise<UserEntity> {
		return this.usersService.getById(id);
	}
}
