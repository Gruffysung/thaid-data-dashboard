import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET(request) {
    try {
        await connectMongoDB();
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page")) || 1;
        const limit = parseInt(url.searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;
        
        const [users, total] = await Promise.all([
            User.find({}).skip(skip).limit(limit).exec(),
            User.countDocuments({})
        ]);
        
        return new Response(JSON.stringify({ users, total }), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
    }
}

// POST - สร้างผู้ใช้ใหม่
export async function POST(request) {
    try {
        await connectMongoDB();
        const data = await request.json();
        const newUser = new User(data);
        const savedUser = await newUser.save();
        return new Response(JSON.stringify(savedUser), { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
    }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(request) {
    try {
        await connectMongoDB();
        const data = await request.json();
        const { id, ...updateData } = data;
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
}

// DELETE - ลบผู้ใช้
export async function DELETE(request) {
    try {
        await connectMongoDB();
        const { id } = await request.json();
        await User.findByIdAndDelete(id);
        return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
    }
}
