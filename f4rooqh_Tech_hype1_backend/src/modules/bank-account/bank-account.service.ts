import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { FilterBankAccountDto } from './dto/filter-bank-account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BankAccountService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDto: CreateBankAccountDto) {
    const { propertyId, userId, ...accountData } = createDto;

    // Validate property exists
    await this.validateProperty(propertyId);

    // Validate user exists
    await this.validateUser(userId);

    // Check if property already has a bank account (unique constraint)
    const existing = await this.prisma.bankAccountDetails.findUnique({
      where: { propertyId },
    });

    if (existing) {
      throw new ConflictException('This property already has a bank account');
    }

    // Check if IBAN already exists (optional - for security)
    const existingIban = await this.prisma.bankAccountDetails.findFirst({
      where: { iban: accountData.iban },
    });

    if (existingIban) {
      throw new ConflictException('This IBAN is already registered');
    }

    try {
      const bankAccount = await this.prisma.bankAccountDetails.create({
        data: {
          propertyId,
          userId,
          ...accountData,
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Bank account created successfully',
        data: bankAccount,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Bank account already exists for this property');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Property or User not found');
        }
      }
      throw error;
    }
  }

  async findAll(filterDto: FilterBankAccountDto) {
    const {
      propertyId,
      userId,
      bankName,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.BankAccountDetailsWhereInput = {};

    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (bankName) {
      where.bankName = {
        contains: bankName,
        mode: 'insensitive',
      };
    }

    const [bankAccounts, total] = await Promise.all([
      this.prisma.bankAccountDetails.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.bankAccountDetails.count({ where }),
    ]);

    return {
      success: true,
      data: bankAccounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const bankAccount = await this.prisma.bankAccountDetails.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!bankAccount) {
      throw new NotFoundException(`Bank account with ID ${id} not found`);
    }

    // Mask sensitive data for security
    const maskedAccount = {
      ...bankAccount,
      // accountNumber: this.maskAccountNumber(bankAccount.accountNumber),
      // iban: this.maskIban(bankAccount.iban),
      accountNumber: this.maskAccountNumber(bankAccount.accountNumber),
      iban: this.maskIban(bankAccount.iban),
    };

    return {
      success: true,
      data: maskedAccount,
    };
  }



  async findByProperty(propertyId: string, filterDto: FilterBankAccountDto) {
    await this.validateProperty(propertyId);
    return this.findAll({ ...filterDto, propertyId });
  }

  async findByUser(userId: string, filterDto: FilterBankAccountDto) {
    await this.validateUser(userId);
    return this.findAll({ ...filterDto, userId });
  }





  async update(id: string, updateDto: UpdateBankAccountDto) {
    await this.findOne(id);

    const { propertyId, userId, ...updateData } = updateDto;

    if (propertyId) {
      await this.validateProperty(propertyId);

      // Check if new property already has a bank account
      if (propertyId) {
        const existing = await this.prisma.bankAccountDetails.findUnique({
          where: { propertyId },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException('Target property already has a bank account');
        }
      }
    }

    if (userId) {
      await this.validateUser(userId);
    }

    // Check IBAN uniqueness if updating
    if (updateData.iban) {
      const existingIban = await this.prisma.bankAccountDetails.findFirst({
        where: {
          iban: updateData.iban,
          id: { not: id },
        },
      });
      if (existingIban) {
        throw new ConflictException('This IBAN is already registered');
      }
    }

    const updated = await this.prisma.bankAccountDetails.update({
      where: { id },
      data: {
        ...updateData,
        ...(propertyId && { propertyId }),
        ...(userId && { userId }),
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Bank account updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.bankAccountDetails.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Bank account deleted successfully',
    };
  }




  //Helper methods for data masking
  private maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length <= 4) return '****';
    const lastFour = accountNumber.slice(-4);
    return `****${lastFour}`;
  }

  private maskIban(iban: string): string {
    if (iban.length <= 8) return '****';
    const firstFour = iban.slice(0, 4);
    const lastFour = iban.slice(-4);
    return `${firstFour}****${lastFour}`;
  }

  private async validateProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}