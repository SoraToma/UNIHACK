import { useState, useEffect } from "react";
import { supabase, useSupabase } from "@/providers/supabaseProvider";
import { Provider } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { TriangleAlert } from "lucide-react"
import gsap from "gsap";

export const Auth = () => {
	const { signInWithProvider } = useSupabase()

	const [authType, setAuthType] = useState<"signIn" | "signUp">("signIn")
	const [displayName, setDisplayName] = useState<string>("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [signInPending, setSignInPending] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const handlePasswordEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value)
		if (password !== e.target.value && e.target.value.length > 0) {
			setError("Passwords do not match")
		} else {
			setError(null)
		}
	}

	const handlePasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setSignInPending(true)
		const { data, error } = await supabase.auth.signInWithPassword({ email, password })
		console.log(error)

		if (error) {
			setError(error.message)
		} else if (data?.session) {
			document.cookie = `access_token=${data.session.access_token}; Path=/; SameSite=None; Secure`;
			document.cookie = `refresh_token=${data.session.refresh_token}; Path=/; SameSite=None; Secure`;
			document.cookie = `token_type=${data.session.token_type}; Path=/; SameSite=None; Secure`;
			document.cookie = `expires_in=${data.session.expires_in}; Path=/; SameSite=None; Secure`;
			document.cookie = `expires_at=${data.session.expires_at}; Path=/; SameSite=None; Secure`;
			window.location.href = "/auth/callback"
		}
		setSignInPending(false)
	}

	const handleProviderSignIn = async (provider: Provider) => {
		setSignInPending(true)
		signInWithProvider(provider)
			.finally(() => {
			setSignInPending(false)
		})
	}

	useEffect(() => {
		const timeline = gsap.timeline()
		
		timeline.to('.authInfo', {
				transform: authType === "signIn" ? "translateX(-60%) " : "translateX(60%) ",
				textAlign: authType === "signIn" ? "left" : "right",
				duration: 0.5,
				ease: 'power3.out'
			}, 0)
		timeline.to('.SignUpForm', {
				transform: authType === "signIn" ? "translateX(-100%)" : "translateX(0%)",
				duration: 0.5,
				ease: 'power3.out'
			}, 0)
		timeline.to('.SignInForm', {
				transform: authType === "signIn" ? "translateX(0%)" : "translateX(100%)",
				duration: 0.5,
				ease: 'power3.out'
			}, 0)
	  }, [authType]);
	
	return (
		<div className="flex flex-row h-screen w-screen justify-center items-center overflow-hidden">
			<div className="SignUpForm translate-x-[-100%] bg-surface-0 p-6 w-1/3">
				<h1>Sign Up</h1>
				{!!error && (
					<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
						<TriangleAlert className="size-4" />
						<p>{error}</p>
					</div>
				)}
				<form className='space-y-2.5' onSubmit={(e) => handlePasswordSignUp(e)}>
					<Input disabled={signInPending} value={displayName} onChange={(e) => {setDisplayName(e.target.value)}} placeholder='Display Name' type="text" required />
					<Input disabled={signInPending} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder='Email' type="email" required />
					<Input disabled={signInPending} value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder='Password' type="password" required />
					<Input disabled={signInPending} value={confirmPassword} onChange={(e) => {handlePasswordEntry(e)}} placeholder='Confirm password' type="password" required />
					<Button type='submit' className='w-full hover:cursor-pointer' size='lg' disabled={signInPending}>Continue</Button>
				</form>
				<Separator className="mt-2.5 mb-2.5 border-black" />
				<div className='flex flex-col gap-y-2.5'>
					<Button disabled={signInPending} onClick={() => {handleProviderSignIn("google")}} variant={'outline'} size='lg' className='w-full relative pb-[2px] hover:cursor-pointer'>
						<FcGoogle className="size-5 absolute top-[9px] left-3" />
						Continue with Google
					</Button>
					<Button disabled={signInPending} onClick={() => {handleProviderSignIn("github")}} variant={'outline'} size='lg' className='w-full relative pb-[2px] hover:cursor-pointer'>
						<FaGithub className="size-5 absolute top-[9px] left-3" />
						Continue with Github
					</Button>
				</div>
				<p className="text-xs text-muted-foreground pt-2">
					Already have an account? <span onClick={() => setAuthType("signIn")} className="text-sky-700 hover:underline cursor-pointer">Sign In</span>
				</p>
				<p className="text-xs text-muted-foreground pt-2">
					Click <span onClick={() => window.location.href = '/'} className="text-sky-700 hover:underline cursor-pointer">here</span> to return to SkibiDB without an account
				</p>
			</div>
			<div className="authInfo translate-x-[-60%] scale-x-1 w-2/3 h-full bg-[#0D0D0D] text-[#F4EDED] pl-40 pr-40 flex flex-col justify-center items-start">
				<p className="w-full z-20 text-2xl font-bold">{authType === "signIn" ? "Welcome back to SkibiDB" : "Welcome to SkibiDB"}</p>
				<p className="z-20 text-lg">{authType === "signIn" ? "Sign In to your account to view our collection of Games and DLC's" : "Sign Up to your account to view our collection of Games and DLC's"}</p>
			</div>
			<div className="SignInForm bg-surface-0 p-6 w-1/3 text-right">
				<h1>Sign In</h1>
				{!!error && (
					<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
						<TriangleAlert className="size-4" />
						<p>{error}</p>
					</div>
				)}
				<form className='space-y-2.5' onSubmit={(e) => handlePasswordSignUp(e)}>
					<Input disabled={signInPending} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder='Email' type="email" required />
					<Input disabled={signInPending} value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder='Password' type="password" required />
					<Button type='submit' className='w-full hover:cursor-pointer' size='lg' disabled={signInPending}>Continue</Button>
				</form>
				<Separator className="mt-2.5 mb-2.5 border-black" />
				<div className='flex flex-col gap-y-2.5'>
					<Button disabled={signInPending} onClick={() => {handleProviderSignIn("google")}} variant={'outline'} size='lg' className='w-full relative pb-[2px] hover:cursor-pointer'>
						<FcGoogle className="size-5 absolute top-[9px] left-3" />
						Continue with Google
					</Button>
					<Button disabled={signInPending} onClick={() => {handleProviderSignIn("github")}} variant={'outline'} size='lg' className='w-full relative pb-[2px] hover:cursor-pointer'>
						<FaGithub className="size-5 absolute top-[9px] left-3" />
						Continue with Github
					</Button>
				</div>
				<p className="text-xs text-muted-foreground pt-2">
					Already have an account? <span onClick={() => setAuthType("signUp")} className="text-sky-700 hover:underline cursor-pointer">Sign In</span>
				</p>
				<p className="text-xs text-muted-foreground pt-2">
					Click <span onClick={() => window.location.href = '/'} className="text-sky-700 hover:underline cursor-pointer">here</span> to return to SkibiDB without an account
				</p>
			</div>
		</div>
	)
}