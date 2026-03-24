const { PrismaClient } = require("@prisma/client");
// Prisma에서 제공하는 DB 클라이언트 가져옴
const prisma = new PrismaClient();
// 실제 DB랑 연결하는 객체 생성
module.exports = prisma;
//다른 파일에서 사용할 수 있도로 exports