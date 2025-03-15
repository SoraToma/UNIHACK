import { useEffect } from "react";

export const Callback = () => {
	useEffect(() => {
		const hash = window.location.hash;
		const cookiesToStore = hash.substring(1).split('&');
		cookiesToStore.forEach(cookie => {
		  document.cookie = `${cookie}; Path=/; SameSite=None; Secure`;
		})
		window.history.pushState(null, '', '/auth/callback');
		window.location.href = '/';
		}, []);

	return (
		<div>
			<h1>Callback Page</h1>
		</div>
	)
}