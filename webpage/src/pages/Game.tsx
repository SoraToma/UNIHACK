import { Toolbar } from '@/components/Toolbar';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Game = () => {
	const { gameId } = useParams();
	const [gameData, setGameData] = useState<{ name?: string, created_at?: number, summary?: string, storyline?: string }>({});
	const [gameInfo, setGameInfo] = useState<{ release_date?: string }>({});

	useEffect(() => {
		const getGameData = async () => {
			const response = await fetch(`https://unihack-532x.onrender.com/search-by-id?gameId=${gameId}`)
				.then(response => response.json());
			setGameData(response[0]);
		}
		getGameData();
	}, [gameId]);

	useEffect(() => {
		if (gameData?.name){
			const date = new Date((gameData?.created_at ?? 0) * 1000);
			const formattedDate = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}).format(date);
			setGameInfo({ release_date: formattedDate });
		}
	}, [gameData])

	return (
		<div>
			<div className='h-full w-full absolute'>
				<div className="h-full w-full bg-white/1 backdrop-blur-3xl z-10 absolute top-0 left-0"></div>
				<img src='https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp' className='absolute w-full z-0 top-0 left-0'></img>
			</div>
			<div className='absolute  w-full z-10'>
				<div className='w-full h-auto bg-[#0D0D0D]'><Toolbar searchActive={true} selected='Game' isLight={false} /></div>
				<div className='flex flex-col items-center'>
					<div className='w-full h-100 flex flex-row items-end justify-start pl-40 z-20'>
						<img className="translate-y-30 rounded-xl" src={"https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp"} alt='game cover' />
						<p className='pl-8 pb-5 text-5xl text-[#F4EDED] font-bold'>{gameData.name}</p>
					</div>
					<div className='bg-[#464D77] w-full h-20'>
						<div className='flex flex-row pl-115 pt-8 items-start gap-x-10'>
							<p className='text-lg text-[#F4EDED] font-bold'>Release Date: {gameInfo.release_date}</p>
							<p className='text-lg text-[#F4EDED] font-bold'>Publisher: FromSoftware</p>
						</div>
					</div>
					<div className='bg-[#464D77] w-full h-auto p-20'>
						<div className='flex flex-col m-auto w-9/10 items-start gap-y-2'>
							<h1 className='text-3xl text-[#F4EDED] font-bold' >Summary</h1>
							<p className='pt-2 text-lg text-[#F4EDED] '>{gameData.summary}</p>
							{
								gameData.storyline ? 
								<>
									<h1 className='pt-5 text-3xl text-[#F4EDED] font-bold' >Storyline</h1>
									<p className='text-lg text-[#F4EDED]'>{gameData.storyline}</p>
								</>
								: null
							}	
						</div>
					</div>
				</div>
				<div className='bg-[#464D77] w-full h-auto p-20'>
					<div className='flex flex-col m-auto w-9/10 items-start gap-y-2 mb-50'>
						<h1 className='text-3xl text-[#F4EDED] font-bold'>Write a Review</h1>
						<textarea 
							className='w-full h-40 p-2 mt-2 text-lg outline-2 text-[#F4EDED] rounded-md' 
							placeholder='Write your review here...'
						></textarea>
					</div>
				</div>
				<pre>{JSON.stringify(gameData, null, 2)}</pre>
			</div>
		</div>
	)
}