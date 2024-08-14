import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {

        const { username, password } = credentials;

        try {
          // เปรียบเทียบข้อมูล username และ password กับค่าจาก .env
          if (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD) {
            return { id: 1, name: username };
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }

      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  page: {
    signIn: "/login"
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };