ALTER TABLE milestone_payments ALTER COLUMN "proofUrls" SET DEFAULT '{}';
ALTER TABLE milestone_payments ALTER COLUMN "agentDocumentUrls" SET DEFAULT '{}';
ALTER TYPE "UnitStatus" ADD VALUE 'SELL';
