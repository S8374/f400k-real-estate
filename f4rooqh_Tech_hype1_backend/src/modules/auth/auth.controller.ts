import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LogInAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateUserProfileDto } from './dto/UpdateUserProfileDto';
import { UserRole } from '../milestone-payment/dto/mark-as-read.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Public()
  @ResponseMessage('OTP sent to your email')
  async register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  // Account Activation and update
  @Post('verify-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Account verified successfully')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(verifyOtpDto, res);
  }

  @Post('resend-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('OTP resent successfully')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful')
  async login(
    @Body() loginDto: LogInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }
  
  @Post('admin-login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Admin login successful')
  async adminLogin(
    @Body() loginDto: LogInAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminLogin(loginDto, res);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logout successful')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password changed successfully')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  // --- Password Reset Flow ---

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Reset OTP sent')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-reset-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('OTP verified')
  async verifyResetOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyResetOtp(verifyOtpDto, res);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset successfully')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(resetPasswordDto, req, res);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    console.log('AuthController - getCurrentUser - user:', user);

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.userId) {
      console.log('AuthController - userId missing from user:', user);
      throw new UnauthorizedException('Invalid user payload');
    }

    return this.authService.getCurrentUser(user.userId);
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.authService.updateProfile(user.userId, dto);
  }

}