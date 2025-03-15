import { useState } from "react"

export const Toolbar = ({selected, searchActive, isLight} : {selected : string, searchActive : boolean, isLight: boolean}) => {
	const [searchQuery, setSearchQuery] = useState("")
	
		const searchGame = async () => {
			const response = await fetch(`https://unihack-532x.onrender.com/search-game?game=${searchQuery}`)
				.then(response => response.json())
			console.log(response)
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
					<button className="mt-1 mr-10">Sign-in</button>
				</>
				:  
				<>
					<button onClick={() => {}} className={`mt-1 ${selected === "New Games" ? "text-blue-500" : ""}`}>New Games</button>
					<button onClick={() => {}} className={`mt-1 ${selected === "Upcoming Games" ? "text-blue-500" : ""}`}>Upcoming Games</button>
					<button onClick={() => window.location.href = '/auth' } className="mt-1 ml-40 mr-10">Sign-in</button>
				</>
				}
			</div>
		</div>
	)
}