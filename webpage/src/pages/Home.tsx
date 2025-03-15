import { useState } from "react"
import { Toolbar } from "@/components/Toolbar"

export const Home = () => {
	const [searchQuery, setSearchQuery] = useState("")

	const searchGame = async () => {
		const response = await fetch(`https://unihack-532x.onrender.com/search-game?game=${searchQuery}`)
			.then(response => response.json())
		console.log(response)
		window.location.href = `/games/${response[0].id}`
	} 

	return (
		<div className="flex flex-col items-center h-auto">
			<Toolbar selected="Home" searchActive={false} />
			<div className="flex flex-col items-start p-6">
				<h1 className="text-4xl font-bold mt-12">Welcome to GameDB</h1>
				<p className="text-xl mt-4">The best place to find information about your favorite games!</p>
				<input onChange={(e) => {setSearchQuery(e.target.value)}} onKeyDown={(e) => {if(e.key === "Enter") searchGame()}} value={searchQuery} className="mt-8 w-full h-1/2 p-4 border-b-2 border-black" placeholder="Search for games..."></input>
			</div>
			<div className="mt-20 flex flex-row w-full h-200 items-center justify-center p-6 gap-x-12 bg-[#464D77] rounded-tl-3xl rounded-tr-3xl">

			</div>
		</div>
	)
}