const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const regiserUser = async (email , password) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("이미 존재하는 이메일");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    })

    return user;
}

module.exports = {
    registerUser,
};