import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    CitizenID: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    role: {type: String}

}, { timestamps: true });

let User;

try {
    // ถ้าโมเดล User ยังไม่ถูกสร้างแล้วใน Mongoose
    User = mongoose.model('User');
} catch (error) {
    // ถ้าโมเดลยังไม่ถูกสร้าง ให้สร้างใหม่
    User = mongoose.model('User', userSchema);
}

export default User;
