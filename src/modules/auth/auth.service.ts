import { UserModel } from '../user/user.model.js';
import { hashPassword, comparePassword } from '../../utils/hash.utils.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt.utils.js';
import { sendEmail } from '../../common/services/email.service.js';
import { redisClient } from '../../common/services/redis.service.js';

export class AuthenticationService {
    public register = async (input: any) => {
        const { userName, email, password, age, gender } = input;
        const exists = await UserModel.findOne({ email });
        if (exists) throw new Error('Email already exists');
        const user = await UserModel.create({ userName, email, password, age, gender });
        await sendEmail({
            to: email,
            subject: 'Welcome to Social App',
            html: `<h1>Welcome ${userName}!</h1><p>Your account has been created successfully.</p>`
        });
        const { password: _password, ...userObj } = user.toObject();
        return userObj;
    };

    public login = async (input: any) => {
        const { email, password } = input;
        const user = await UserModel.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) throw new Error('Invalid credentials');
        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });
        return { accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role } };
    };

    public logout = async (token: string) => {
        await redisClient.set(`revoked:${token}`, '1', { EX: 60 * 60 * 24 * 7 });
    };

    public refreshToken = async (refreshToken: string) => {
        const decoded: any = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
        const user = await UserModel.findById(decoded.id);
        if (!user) throw new Error('User not found');
        return { accessToken: generateAccessToken({ id: user._id, role: user.role }) };
    };

    public forgotPassword = async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('User not found');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 OTP for ${email}: ${otp}`); 
    await redisClient.set(`otp:${email}`, otp, { EX: 60 * 10 });
    await sendEmail({
        to: email,
        subject: 'Password Reset OTP',
        html: `<h2>Your OTP: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
        });
    };

    public resetPassword = async (email: string, otp: string, newPassword: string) => {
        const savedOtp = await redisClient.get(`otp:${email}`);
        if (!savedOtp || savedOtp !== otp) throw new Error('Invalid or expired OTP');
        const hashed = await hashPassword(newPassword);
        await UserModel.findOneAndUpdate({ email }, { password: hashed });
        await redisClient.del(`otp:${email}`);
    };
}

export default new AuthenticationService();