import bcrypt from 'bcryptjs';

export const hashPassword = async (userPassword: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(userPassword, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

export const comparePasswords = async (plainPassword: string, hash: string): Promise<boolean> => {
    try {
        return bcrypt.compareSync(plainPassword, hash);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};
