import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async register(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (user) {
      throw new ConflictException('email already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await this.users.create(email, passwordHash);
    return this.sign(u._id.toString(), email, u.roles);
  }
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
    return this.sign(user._id.toString(), user.email, user.roles);
  }
  private sign(sub: string, email: string, roles: string[]) {
    const access_token = this.jwt.sign({ sub, email, roles });
    return {
      access_token,
      token_type: 'Bearer',
      expires_in: Number(process.env.JWT_EXPIRES_IN),
    };
  }
}
