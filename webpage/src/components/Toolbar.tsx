import { useEffect, useState } from "react"
import { supabase, useSupabase } from "@/providers/supabaseProvider"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { LogOut } from "lucide-react"

export const Toolbar = ({selected, searchActive, isLight} : {selected : string, searchActive : boolean, isLight: boolean}) => {
	const { signOut } = useSupabase()

	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			const cookie = document.cookie.match(new RegExp("(^| )access_token=([^;]+)"));
			const access_token = cookie?.[2];
			const { data, error } = await supabase.auth.getUser(access_token)
			if (error === null){
				console.log(data)
				setUser(data?.user)
			}
		}
		fetchUser()
	}, [])

	const [searchQuery, setSearchQuery] = useState("")
	
	const searchGame = async () => {
		const response = await fetch(`https://unihack-532x.onrender.com/search-game?game=${searchQuery}`)
			.then(response => response.json())
		window.location.href = `/games/${response[0].id}`
	}

	return (
		<div className={`flex flex-col items-center ${isLight ? 'bg-[#F4EDED] text-[#0D0D0D]' : 'bg-[#0D0D0D] text-[#F4EDED]'}`}>
			<div className="flex flex-row items-center justify-center p-6 gap-x-16 bg-transparent">
				<button onClick={() => {window.location.href = '/'}} className="text-2xl font-bold">GameDB</button>
				<button onClick={() => {}} className={`mt-1 ${selected === "Popular Games" ? "text-blue-500" : ""}`}>Popular Games</button>
				{ searchActive ? 
				<>
					<input onChange={(e) => {setSearchQuery(e.target.value)}} onKeyDown={(e) => {if(e.key === "Enter") searchGame()}} value={searchQuery} className={`w-90 h-1/2 p-1 border-b-2 ${isLight ? 'border-[#0D0D0D]' : 'border-[#F4EDED]'}`}  placeholder="Search"></input>
					{user ?
					<>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger className="outline-none relative">
								<Avatar>
									<AvatarImage src={user?.user_metadata.avatar_url} />
									<AvatarFallback>
										{(user?.user_metadata.name ?? user?.user_metadata.displayName ?? "U").charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => signOut()} className="h-10 hover:cursor-pointer">
									<LogOut className="size-4 mr-2" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
					:
					<button onClick={() => {window.location.href = '/auth'}} className="mt-1 ml-40 mr-10">Sign-in</button>
					}
				</>
				:  
				<>
					<button onClick={() => {}} className={`mt-1 ${selected === "New Games" ? "text-blue-500" : ""}`}>New Games</button>
					<button onClick={() => {}} className={`mt-1 ${selected === "Upcoming Games" ? "text-blue-500" : ""}`}>Upcoming Games</button>
					{user ?
					<>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger className="outline-none relative">
								<Avatar>
									<AvatarImage src={user?.user_metadata.avatar_url} />
									<AvatarFallback>
										{(user?.user_metadata.name ?? user?.user_metadata.displayName ?? "U").charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => signOut()} className="h-10 hover:cursor-pointer">
									<LogOut className="size-4 mr-2" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
					:
					<button onClick={() => {window.location.href = '/auth'}} className="mt-1 ml-40 mr-10">Sign-in</button>
					}
				</>
				}
			</div>
		</div>
	)
}