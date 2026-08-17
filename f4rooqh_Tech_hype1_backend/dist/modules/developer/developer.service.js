"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let DeveloperService = class DeveloperService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDeveloperDto) {
        try {
            const developer = await this.prisma.developer.create({
                data: createDeveloperDto,
            });
            return {
                success: true,
                message: 'Developer created successfully',
                data: developer,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Developer with this name already exists');
                }
            }
            throw error;
        }
    }
    async findAll(includeProjects = false) {
        const developers = await this.prisma.developer.findMany({
            include: {
                property: includeProjects,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return {
            success: true,
            data: developers,
            count: developers.length,
        };
    }
    async findOne(id, includeProjects = false) {
        const developer = await this.prisma.developer.findUnique({
            where: { id },
            include: {
                property: includeProjects ? {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        listingPurpose: true,
                        images: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                } : false,
            },
        });
        if (!developer) {
            throw new common_1.NotFoundException(`Developer with ID ${id} not found`);
        }
        return {
            success: true,
            data: developer,
        };
    }
    async update(id, updateDeveloperDto) {
        await this.findOne(id);
        try {
            const updatedDeveloper = await this.prisma.developer.update({
                where: { id },
                data: updateDeveloperDto,
            });
            return {
                success: true,
                message: 'Developer updated successfully',
                data: updatedDeveloper,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Developer with this name already exists');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        await this.findOne(id);
        const propertiesCount = await this.prisma.property.count({
            where: { developerId: id },
        });
        if (propertiesCount > 0) {
            throw new common_1.ConflictException(`Cannot delete developer because they have ${propertiesCount} associated properties. Please reassign or delete those properties first.`);
        }
        await this.prisma.developer.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Developer deleted successfully',
        };
    }
    async searchByName(name) {
        const developers = await this.prisma.developer.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            take: 10,
            orderBy: {
                name: 'asc',
            },
        });
        return {
            success: true,
            data: developers,
            count: developers.length,
        };
    }
};
exports.DeveloperService = DeveloperService;
exports.DeveloperService = DeveloperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeveloperService);
//# sourceMappingURL=developer.service.js.map