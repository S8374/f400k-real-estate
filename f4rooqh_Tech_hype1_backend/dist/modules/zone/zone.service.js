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
exports.ZoneService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
let ZoneService = class ZoneService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.zone.create({ data });
    }
    async findAll(onlyActive = true) {
        const where = onlyActive ? { isActive: true } : {};
        return this.prisma.zone.findMany({
            where,
            include: {
                children: { where },
                _count: { select: { properties: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        const zone = await this.prisma.zone.findUnique({ where: { id } });
        if (!zone) {
            throw new common_1.NotFoundException(`Zone with ID ${id} not found`);
        }
        return zone;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.zone.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.zone.delete({ where: { id } });
    }
};
exports.ZoneService = ZoneService;
exports.ZoneService = ZoneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ZoneService);
//# sourceMappingURL=zone.service.js.map