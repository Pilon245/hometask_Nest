import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/entities/nosql/users.entity';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/nosql/blogger.users.blogs.ban.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  BanBloggerUsersFactory,
  UsersFactory,
} from '../domain/dto/usersFactory';
import { Users } from '../domain/entities/sql/user.entity';
import { EmailConfirmation } from '../domain/entities/sql/email.confirmation.entity';
import { PasswordConfirmation } from '../domain/entities/sql/password.confirmation.entity';
import { UsersBanInfo } from '../domain/entities/sql/users.ban.info.entity';
import { randomUUID } from 'crypto';
import { BloggersUsersBlogsBan } from 'src/users/domain/entities/sql/bloggers.users.blogs.ban.entity';

@Injectable({ scope: Scope.DEFAULT })
export class UsersOrmRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmationRepository: Repository<EmailConfirmation>,
    @InjectRepository(PasswordConfirmation)
    private readonly passwordConfirmationRepository: Repository<PasswordConfirmation>,
    @InjectRepository(UsersBanInfo)
    private readonly usersBanInfoRepository: Repository<UsersBanInfo>,
    @InjectRepository(BloggersUsersBlogsBan)
    private bloggerUsersBanModel: Repository<BloggersUsersBlogsBan>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async findUsersById(id: string): Promise<any> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('id = :id', { id })
      .getRawOne();
    if (!users) return false;
    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailconfirmationCode,
        expirationDate: users.emailexpirationDate,
        isConfirmed: users.emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passconfirmationcode,
        expirationDate: users.passexpirationDate,
        isConfirmed: users.passisconfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async findLoginOrEmail(LoginOrEmailL: string) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('login = :LoginOrEmailL', { LoginOrEmailL })
      .orWhere('email = :LoginOrEmailL', { LoginOrEmailL })
      .getRawOne();

    if (!users) return false;
    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailconfirmationcode,
        expirationDate: users.emailexpirationdate,
        isConfirmed: users.emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passconfirmationcode,
        expirationDate: users.passexpirationdate,
        isConfirmed: users.passisconfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async findBanBloggerUsersDB(banUserId: string, blogId: string) {
    const banUser = await this.bloggerUsersBanModel.findOneBy({
      userId: banUserId,
      blogId: blogId,
    });
    if (!banUser) return false;
    return true;
  }

  async updateEmailConfirmation(id: string) {
    const result = await this.emailConfirmationRepository.findOneBy({
      userId: id,
    });
    result.isConfirmed = true;
    await this.emailConfirmationRepository.save(result);
    return result;
  }

  async updatePasswordConfirmation(id: string) {
    const result = await this.passwordConfirmationRepository.findOneBy({
      userId: id,
    });
    result.isConfirmed = true;
    await this.passwordConfirmationRepository.save(result);
    return result;
  }

  async updateEmailCode(id: string, code: any) {
    const result = await this.emailConfirmationRepository.findOneBy({
      userId: id,
    });
    result.confirmationCode = code;
    await this.emailConfirmationRepository.save(result);
    return result[0];
  }

  async updatePasswordCode(id: string, code: any) {
    const result = await this.passwordConfirmationRepository.findOneBy({
      userId: id,
    });
    result.confirmationCode = code;
    await this.passwordConfirmationRepository.save(result);
    return result[0];
  }

  async updatePasswordUsers(id: string, password: string) {
    const result = await this.dataSource.query(
      `UPDATE "Users"
	SET "passwordHash"='${password}'
	WHERE "id" = '${id}';`,
    );
    return result[0];
  }

  async findUserByConfirmationEmailCode(emailConfirmationCode: string) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('e."confirmationCode" = :emailConfirmationCode', {
        emailConfirmationCode,
      })
      .getRawOne();

    if (!users) return false;
    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailconfirmationCode,
        expirationDate: users.emailexpirationDate,
        isConfirmed: users.emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passconfirmationcode,
        expirationDate: users.passexpirationDate,
        isConfirmed: users.passisconfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async findUserByConfirmationPasswordCode(passwordConfirmation: string) {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(
        'u.*, b.*, e."confirmationCode" as emailConfirmationCode, e."expirationDate" as emailExpirationDate,' +
          ' e."isConfirmed" as emailIsConfirmed, p."confirmationCode" as passConfirmationCode,' +
          'p."expirationDate" as passExpirationDate,  p."isConfirmed" as passIsConfirmed,b."isBanned", b."banDate", b."banReason"',
      )
      .from('users', 'u')
      .leftJoin('users_ban_info', 'b', 'b.userId = u.id')
      .leftJoin('email_confirmation', 'e', 'e.userId = u.id')
      .leftJoin('password_confirmation', 'p', 'p.userId = u.id')
      .where('p."confirmationCode" = :passwordConfirmation', {
        passwordConfirmation,
      })
      .getRawOne();
    return {
      id: users.id,
      accountData: {
        login: users.login,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
      },
      emailConfirmation: {
        confirmationCode: users.emailconfirmationCode,
        expirationDate: users.emailexpirationDate,
        isConfirmed: users.emailisconfirmed,
      },
      passwordConfirmation: {
        confirmationCode: users.passconfirmationcode,
        expirationDate: users.passexpirationDate,
        isConfirmed: users.passisconfirmed,
      },
      banInfo: {
        isBanned: users.isBanned,
        banDate: users.banDate,
        banReason: users.banReason,
      },
    };
  }

  async createUsers(user: UsersFactory) {
    const newUser = new Users();
    newUser.id = user.id;
    newUser.login = user.accountData.login;
    newUser.email = user.accountData.email;
    newUser.passwordHash = user.accountData.passwordHash;
    newUser.createdAt = user.accountData.createdAt;
    await this.usersRepository.save(newUser);
    const newEmailConfirmation = new EmailConfirmation();
    newEmailConfirmation.userId = user.id;
    newEmailConfirmation.isConfirmed = user.emailConfirmation.isConfirmed;
    newEmailConfirmation.confirmationCode =
      user.emailConfirmation.confirmationCode;
    newEmailConfirmation.expirationDate =
      user.emailConfirmation.expirationDate.toString();
    await this.emailConfirmationRepository.save(newEmailConfirmation);
    const newPasswordConfirmation = new PasswordConfirmation();
    newPasswordConfirmation.userId = user.id;
    newPasswordConfirmation.isConfirmed = user.passwordConfirmation.isConfirmed;
    newPasswordConfirmation.confirmationCode =
      user.passwordConfirmation.confirmationCode;
    newPasswordConfirmation.expirationDate =
      user.passwordConfirmation.expirationDate.toString();
    await this.passwordConfirmationRepository.save(newPasswordConfirmation);
    const newBanInfo = new UsersBanInfo();
    newBanInfo.userId = user.id;
    newBanInfo.isBanned = user.banInfo.isBanned;
    newBanInfo.banDate = user.banInfo.banDate;
    newBanInfo.banReason = user.banInfo.banReason;
    await this.usersBanInfoRepository.save(newBanInfo);
    return;
  }

  async banBloggerUsers(user: BanBloggerUsersFactory) {
    if (user.banInfo.isBanned) {
      const newBloggersUsersBan = new BloggersUsersBlogsBan();
      newBloggersUsersBan.blogId = user.blogId;
      newBloggersUsersBan.userId = user.id;
      newBloggersUsersBan.isBanned = user.banInfo.isBanned;
      newBloggersUsersBan.banDate = user.banInfo.banDate;
      newBloggersUsersBan.banReason = user.banInfo.banReason;
      await this.usersBanInfoRepository.save(newBloggersUsersBan);
    } else {
      const newBloggersUsersBan = new BloggersUsersBlogsBan();
      newBloggersUsersBan.blogId = user.blogId;
      newBloggersUsersBan.userId = user.id;
      newBloggersUsersBan.isBanned = user.banInfo.isBanned;
      newBloggersUsersBan.banDate = null;
      newBloggersUsersBan.banReason = null;
      await this.usersBanInfoRepository.save(newBloggersUsersBan);
    }
    return true;
  }

  async updateUsers(model: any) {
    const user = await this.usersBanInfoRepository.findOneBy({
      userId: model.id,
    });
    user.banDate = model.banDate;
    user.banReason = model.banReason;
    user.isBanned = model.isBanned;
    return this.usersBanInfoRepository.save(user);
    //   if (model.isBanned) {
    //     await this.dataSource.query(
    //       `UPDATE "UsersBanInfo"
    // SET "isBanned"='${model.isBanned}', "banDate" = '${model.banDate}',
    //  "banReason" = '${model.banReason}'
    // WHERE "userId" = '${model.id}';`,
    //     );
    //   } else {
    //     await this.dataSource.query(
    //       `UPDATE "UsersBanInfo"
    //   SET "isBanned"='${model.isBanned}', "banDate" = ${model.banDate},
    //    "banReason" = ${model.banReason}
    //   WHERE "userId" = '${model.id}';`,
    //     );
    //   }
    return true;
  }

  async updateBanBloggerUsers(
    banUserId: string,
    bloggerId: string,
    blogId: string,
    isBanned: boolean,
    banDate: string,
    banReason: string,
  ) {
    // if (isBanned) {
    const user = await this.bloggerUsersBanModel.findOneBy([
      {
        userId: banUserId,
      },
      { blogId },
    ]);
    user.isBanned = isBanned;
    user.banDate = banDate;
    user.banReason = banReason;
    return this.bloggerUsersBanModel.save(user);

    // } else {
    //   await this.dataSource.query(
    //     `UPDATE "BloggerUsersBan"
    // SET "isBanned"='${isBanned}', "banDate" = null,
    //  "banReason" = null
    // WHERE "userId" = '${banUserId}' AND "blogId" = '${blogId}';`,
    //   );
    // }
    return true;
  }

  async deleteUsers(id: string) {
    const result = await this.usersRepository.delete({ id: id });
    // const result = await this.dataSource.query(
    //   `DELETE FROM "Users"
    //           WHERE "id" = '${id}';`,
    // );
    if (!result[1]) return false;
    return true;
  }

  async deleteAllUsers() {
    await this.dataSource.query(`DELETE FROM "bloggers_users_blogs_ban"`);
    return this.dataSource.query(`DELETE FROM "users"`);
  }
}
