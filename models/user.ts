import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password?: string;
	role: "employer";
	companyId?: string;
	provider?: string;
	image?: string;
	emailVerified?: Date;
}

const UserSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String }, // Optional for social login
		role: { type: String, default: "employer", required: true },
		companyId: { type: String }, // Reference to Sanity company document
		provider: { type: String }, // 'credentials', 'google', 'linkedin'
		image: { type: String },
		emailVerified: { type: Date },
	},
	{
		timestamps: true,
	},
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
