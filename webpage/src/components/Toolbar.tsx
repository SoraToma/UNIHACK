import { useState } from "react"

export const Toolbar = ({selected, searchActive} : {selected : string, searchActive : boolean}) => {
	const [searchQuery, setSearchQuery] = useState("")
	
		const searchGame = async () => {
			const response = await fetch(`https://unihack-532x.onrender.com/search-game?game=${searchQuery}`)
				.then(response => response.json())
			console.log(response)
			window.location.href = `/games/${response[0].id}`
		}

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-row items-center justify-center p-6 gap-x-16 bg-transparent">
				<button onClick={() => {}} className="text-2xl">GameDB</button>
				<button onClick={() => {}} className={`mt-1 ${selected === "Popular Games" ? "text-blue-500" : ""}`}>Popular Games</button>
				{ searchActive ? 
				<>
					<input onChange={(e) => {setSearchQuery(e.target.value)}} onKeyDown={(e) => {if(e.key === "Enter") searchGame()}} value={searchQuery} className="w-90 h-1/2 p-1 border-b-2 border-black" placeholder="Search"></input>
					<button className="mt-1 mr-10">Sign-in</button>
				</>
				:  
				<>
					<button onClick={() => {}} className={`mt-1 ${selected === "New Games" ? "text-blue-500" : ""}`}>New Games</button>
					<button onClick={() => {}} className={`mt-1 ${selected === "Upcoming Games" ? "text-blue-500" : ""}`}>Upcoming Games</button>
					<button onClick={() => {window.location.href = "/auth"}} className="mt-1 ml-40 mr-10">Sign-in</button>
				</>
				}
			</div>
		</div>
	)
}