import { UserModel } from './user.model.js';
import { uploadFile } from '../../utils/s3.utils.js';
import { hashPassword, comparePassword } from '../../utils/hash.utils.js';

export class UserService {
    public findUserById = async (id: string) => {
        return await UserModel.findById(id).select('-password');
    };

    public updateProfile = async (id: string, data: any, file?: Express.Multer.File) => {
        if (file) data.profileImage = await uploadFile(file, 'profiles');
        return await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
    };

    public updatePassword = async (id: string, oldPassword: string, newPassword: string) => {
        const user = await UserModel.findById(id);
        if (!user) throw new Error('User not found');
        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) throw new Error('Old password is incorrect');
        const hashed = await hashPassword(newPassword);
        await UserModel.findByIdAndUpdate(id, { password: hashed });
    };

    public softDelete = async (id: string) => {
        return await UserModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
    };
}

export default new UserService();