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
exports.PropertyAttributeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const client_1 = require("@prisma/client");
let PropertyAttributeService = class PropertyAttributeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPropertyAttributeDto) {
        const { propertyId, ...attributeData } = createPropertyAttributeDto;
        if (!propertyId) {
            throw new common_1.ConflictException('propertyId is required');
        }
        await this.validateProperty(propertyId);
        try {
            const attribute = await this.prisma.propertyAttribute.create({
                data: {
                    propertyId: propertyId,
                    key: attributeData.key,
                    value: attributeData.value,
                },
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });
            return {
                success: true,
                message: 'Property attribute created successfully',
                data: attribute
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException(`Attribute with key '${attributeData.key}' already exists for this property`);
                }
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
                }
            }
            throw error;
        }
    }
    async findAll() {
        const attributes = await this.prisma.propertyAttribute.findMany({
            include: {
                property: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: [
                { propertyId: 'asc' },
                { key: 'asc' }
            ]
        });
        return {
            success: true,
            data: attributes,
            count: attributes.length
        };
    }
    async findOne(id) {
        const attribute = await this.prisma.propertyAttribute.findUnique({
            where: { id },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true
                    }
                }
            }
        });
        if (!attribute) {
            throw new common_1.NotFoundException(`Property attribute with ID ${id} not found`);
        }
        return {
            success: true,
            data: attribute
        };
    }
    async findByProperty(propertyId) {
        await this.validateProperty(propertyId);
        const attributes = await this.prisma.propertyAttribute.findMany({
            where: { propertyId },
            orderBy: { key: 'asc' }
        });
        return {
            success: true,
            data: attributes,
            count: attributes.length,
            propertyId
        };
    }
    async update(id, updatePropertyAttributeDto) {
        await this.findOne(id);
        const { propertyId, ...updateData } = updatePropertyAttributeDto;
        try {
            const updatePayload = { ...updateData };
            if (propertyId) {
                await this.validateProperty(propertyId);
                updatePayload.propertyId = propertyId;
            }
            const updatedAttribute = await this.prisma.propertyAttribute.update({
                where: { id },
                data: updatePayload,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });
            return {
                success: true,
                message: 'Property attribute updated successfully',
                data: updatedAttribute
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException(`Attribute with this key already exists for this property`);
                }
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
                }
            }
            throw error;
        }
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.propertyAttribute.delete({
            where: { id }
        });
        return {
            success: true,
            message: 'Property attribute deleted successfully'
        };
    }
    async upsert(propertyId, key, value, valueType) {
        await this.validateProperty(propertyId);
        try {
            const attribute = await this.prisma.propertyAttribute.upsert({
                where: {
                    propertyId_key: {
                        propertyId,
                        key
                    }
                },
                update: {
                    value
                },
                create: {
                    propertyId,
                    key,
                    value
                }
            });
            return {
                success: true,
                message: 'Attribute upserted successfully',
                data: attribute
            };
        }
        catch (error) {
            throw error;
        }
    }
    async validateProperty(propertyId) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId }
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        return property;
    }
};
exports.PropertyAttributeService = PropertyAttributeService;
exports.PropertyAttributeService = PropertyAttributeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyAttributeService);
//# sourceMappingURL=property-attribute.service.js.map