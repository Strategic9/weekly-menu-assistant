import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider  from 'next-auth/providers/credentials'
import { api, HTTPHandler } from '../../../services/api'
import { SubmitHandler } from 'react-hook-form'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "e-post" },
        password: { label: "Password", type: "password", placeholder: "lösenord" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        console.log(req);
        const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
          await api
            .post('users/login', {
              ...values
            })
            .then((res) => {
              onLoginSucess(res)
            })
            .catch(() => {
              alert.error('Vänligen kontrollera angiven information')
            })
        }
         const res = async (values)=> await HTTPHandler.post("/users/login", {
          ...values
        }).then()
        const user = await res.name
        console.log(credentials.password)
        console.log(credentials.username)
        
        // If no error and we have user data, return it
        if (credentials && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    }
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt'
  }
})
