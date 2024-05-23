import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "@/http/api"
import { LoaderCircle } from "lucide-react"
function RegisterPage() {
  const navigate=useNavigate()
  const nameRef=useRef<HTMLInputElement>(null)
  const emailRef=useRef<HTMLInputElement>(null);
  const passwordRef=useRef<HTMLInputElement>(null);
  // Mutations
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
     console.log("Relisted successful");
     navigate('/auth/login');
    },

  })

  const handleRegisterSubmit=() => {
    const name = nameRef.current?.value
    const email=emailRef?.current?.value;
    const password=passwordRef?.current?.value;
 console.log("Data", email, password);
 
    //Make server call
    if(!name || !email || !password){
      return alert("Please enter your email and password");
    }
    mutation.mutate({name,email, password});
  };
  return (
 <section className="flex justify-center items-center h-screen">
     <Card  className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="w-full max-w-sm">
            <div className="grid gap-2">
              <Label htmlFor="name">Name*</Label>
              <Input ref={nameRef}  id="name" placeholder="Name" required />
            </div>
            
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password*</Label>
            <Input ref={passwordRef} id="password" type="password" />
          </div>
          <Button onClick={handleRegisterSubmit} type="submit" className="w-full" disabled={mutation.isPending}>
          {
              mutation.isPending && <LoaderCircle className="animate-spin" />
            }
          
            <span className="ml-2">Create an account</span>
            
          </Button>
          
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to={'/auth/login'} className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
 </section>
  )
}

export default RegisterPage