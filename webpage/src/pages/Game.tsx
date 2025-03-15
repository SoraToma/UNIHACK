import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Game = () => {
	const { gameId } = useParams();
	const [gameData, setGameData] = useState({});

	useEffect(() => {
		const getGameData = async () => {
			const response = await fetch(`https://unihack-532x.onrender.com/searchgame?game=Valorant`)
				.then(response => response.json());
			console.log(response);
			setGameData(response);
		}
		getGameData();
	}, [gameId]);

	return (
		<div>
			<pre>{JSON.stringify(gameData, null, 2)}</pre>
		</div>
	)
}