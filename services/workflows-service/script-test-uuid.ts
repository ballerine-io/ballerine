import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testStrings = [
    'null',
    '"null"',
    'undefined',
    '"undefined"',
    'nullnull',
    ' u',
    '  u',
    'xuxxx',
    '%22null%22',
    '%null%',
  ];

  for (const s of testStrings) {
    try {
      await prisma.workflowRuntimeDataToken.findFirst({
        where: { token: s },
      });
      console.log(`[PASS] ${s}`);
    } catch (e: any) {
      const msg = e.message || String(e);
      if (msg.includes('found')) {
        const errorLine =
          msg.split('\n').find((l: string) => l.includes('Inconsistent column data')) ||
          msg.split('\n').find((l: string) => l.includes('Error creating UUID')) ||
          msg;
        console.log(`[FAIL] ${s} -> ${errorLine.trim()}`);
      } else {
        console.log(`[FAIL-OTHER] ${s} -> ${msg.split('\n')[0]}`);
      }
    }
  }

  try {
    await prisma.workflowRuntimeDataToken.findFirst({ where: { token: 'xxu' } });
    console.log(`[PASS] xxu`);
  } catch (e: any) {
    const msg = e.message || String(e);
    const errorLine = msg.split('\n').find((l: string) => l.includes('Error creating UUID')) || msg;
    console.log(`[FAIL] xxu -> ${errorLine.trim()}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
