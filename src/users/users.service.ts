import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  hashPassword(password: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(User.name) private readonly model:Model<UserDocument>) {}
  findByEmail(email: string) {
    return this.model.findOne({ email }).lean();
  }
  create(email: string, passwordHash: string, roles:string[] = ['user']) {
    return this.model.create({ email, passwordHash, roles });
  }

}
