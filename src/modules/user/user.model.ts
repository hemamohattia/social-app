import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    profileImage: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const bcrypt = await import("bcrypt");
        this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS) || 10);
    }
});

userSchema.pre(/^find/, function (this: any) {
    this.where({ isDeleted: false });
});

export const UserModel = model("User", userSchema);