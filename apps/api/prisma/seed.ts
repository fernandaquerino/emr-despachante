// Seed idempotente para ambiente local (FND-005). Todo dado é fictício:
// prefixo "TESTE", e-mails em @example.com (domínio reservado IANA), e valores de
// hash/criptografia marcados como fake — nunca parecendo dado real ou sensível.
import {
  PrismaClient,
  Role,
  UserStatus,
  VehicleOverallStatus,
  FineStatus,
  LicensingStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "teste.proprietario@example.com" },
    update: {},
    create: {
      name: "TESTE Proprietário Um",
      email: "teste.proprietario@example.com",
      passwordHash: "seed-only-not-a-real-hash",
      role: Role.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: "teste.despachante@example.com" },
    update: {},
    create: {
      name: "TESTE Despachante Admin",
      email: "teste.despachante@example.com",
      passwordHash: "seed-only-not-a-real-hash",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const vehicle = await prisma.vehicle.upsert({
    where: { plateNormalized: "TST0A00" },
    update: {},
    create: {
      ownerId: owner.id,
      dispatcherId: dispatcher.id,
      plateNormalized: "TST0A00",
      renavamEncrypted: "seed-only-fake-encrypted-value",
      make: "TESTE Fabricante",
      model: "TESTE Modelo",
      year: 2020,
      overallStatus: VehicleOverallStatus.ATTENTION,
    },
  });

  await prisma.fine.upsert({
    where: {
      vehicleId_externalReference: {
        vehicleId: vehicle.id,
        externalReference: "TESTE-MULTA-0001",
      },
    },
    update: {},
    create: {
      vehicleId: vehicle.id,
      externalReference: "TESTE-MULTA-0001",
      amount: 195.23,
      dueDate: new Date("2026-10-15"),
      agency: "TESTE-DETRAN-SP",
      status: FineStatus.OPEN,
    },
  });

  await prisma.licensing.upsert({
    where: {
      vehicleId_year: { vehicleId: vehicle.id, year: 2026 },
    },
    update: {},
    create: {
      vehicleId: vehicle.id,
      year: 2026,
      amount: 214.8,
      dueDate: new Date("2026-12-31"),
      status: LicensingStatus.ELIGIBLE,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
