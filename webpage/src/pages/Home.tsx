import { useState } from "react"
import { Toolbar } from "@/components/Toolbar"
import { useEffect, useRef } from "react"

export const Home = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState([])
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

	return (
		<div className="flex flex-col items-center h-auto">
			<Toolbar selected="Home" searchActive={false} isLight={true} />
			<div className="flex flex-col items-start p-6">
				<h1 className="text-4xl font-bold mt-12">Welcome to SkibiDB</h1>
				<p className="text-xl mt-4">The best place to find information about your favorite games!</p>
				<div className="relative">
					<input onChange={handleInputChange} onKeyDown={(e) => {if(e.key === "Enter") searchGame(searchQuery)}} value={searchQuery} className="mt-8 w-full h-1/2 p-4 border-b-2 border-black" placeholder="Search for games..."></input>
					{searchResults.length > 0 && (
						<div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-10">
							{searchResults.map((result: any) => (
								<div key={result.id} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => window.location.href = `/games/${result.id}`}>
									{result.name}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<div className="mt-20 flex flex-row w-full h-200 items-center justify-center p-6 gap-x-12 bg-[#464D77] rounded-tl-3xl rounded-tr-3xl">

			</div>
		</div>
	)
}