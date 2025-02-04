import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
}

const UserSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
