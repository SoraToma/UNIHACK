import { useEffect, useState, useRef } from "react"
import { supabase, useSupabase } from "@/providers/supabaseProvider"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { LogOut } from "lucide-react"

export const Toolbar = ({selected, searchActive, isLight} : {selected : string, searchActive : boolean, isLight: boolean}) => {
	const { signOut } = useSupabase()

	const [user, setUser] = useState<User | null>(null)
	const [searchResults, setSearchResults] = useState([])
	const [searchQuery, setSearchQuery] = useState("")
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const searchGame = async (query: string) => {
		const response = await fetch(`https://unihack-532x.onrender.com/search-game?game=${query}`)
			.then(response => response.json())
		setSearchResults(response)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value
		setSearchQuery(query)
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		timeoutRef.current = setTimeout(() => {
			if (query === searchQuery) {
				searchGame(query)
			}
		}, 300)
	}

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

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

	return (
		<div className={`flex flex-col items-center ${isLight ? 'bg-[#F4EDED] text-[#0D0D0D]' : 'bg-[#0D0D0D] text-[#F4EDED]'}`}>
			<div className="flex flex-row items-center justify-center p-6 gap-x-16 bg-transparent relative">
				<button onClick={() => {window.location.href = '/'}} className="text-2xl font-bold">SkibiDB</button>
				<button onClick={() => {}} className={`mt-1 ${selected === "Popular Games" ? "text-blue-500" : ""}`}>Popular Games</button>
				{ searchActive ? 
				<>
					<input onChange={handleInputChange} onKeyDown={(e) => {if(e.key === "Enter") searchGame(searchQuery)}} value={searchQuery} className={`w-90 h-1/2 p-1 border-b-2 ${isLight ? 'border-[#0D0D0D]' : 'border-[#F4EDED]'}`}  placeholder="Search"></input>
					{searchResults.length > 0 && (
						<div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-30">
							{searchResults.map((result: any) => (
								<div key={result.id} className="text-black p-2 hover:bg-gray-200 cursor-pointer" onClick={() => window.location.href = `/games/${result.id}`}>
									{result.name}
								</div>
							))}
						</div>
					)}
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