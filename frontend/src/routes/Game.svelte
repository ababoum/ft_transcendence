<script lang="ts">
    import Header from "../components/Nav.svelte";
    import {link, pop, push} from "svelte-spa-router";
	import {onDestroy, onMount} from 'svelte';
	import {game_socket, get_current_user_data} from "../stores";

	let canvas;
	let context;

	let is_started = false;
	let game_data: any = {
		field: {
			width: 0,
            height: 0
		}
    };

	const UP_KEY : number = 38;
	const DOWN_KEY : number = 40;

	function keyHandler(e) {
	if (e.keyCode == DOWN_KEY)
		$game_socket.emit('move-paddle', "down");
	if (e.keyCode == UP_KEY)
		$game_socket.emit('move-paddle', "up");
	}



onMount(() => {
    context = canvas.getContext('2d');
})

    // x, y are position. w and h are width and height of the shape
    function drawRect(x, y, w, h): void {
        context.fillStyle = "#0095DD";
        context.fillRect(x, y, w, h);
    }

    // x, y are position, r is radius
    function drawCircle(x: number, y: number, r: number): void {
        context.fillStyle = "white";
        context.beginPath();
        // 0 is start of angle. Math.PI * 2 (360 degrees) is end of angle. false is direction (not important in this context
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }

    function drawText(text: string, x: number, y: number): void {
        context.fillStyle = "white";
        context.font = "45px fantasy";
        context.fillText(text, x, y);
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        try {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawRect(game_data.leftPlayer.x, game_data.leftPlayer.y, game_data.paddle.width, game_data.paddle.height);
			drawRect(game_data.rightPlayer.x, game_data.rightPlayer.y, game_data.paddle.width, game_data.paddle.height);
			drawCircle(game_data.ball.x, game_data.ball.y, game_data.ball.radius);
			drawText(game_data.leftPlayer.score, game_data.leftPlayer.score_x, game_data.leftPlayer.score_y);
			drawText(game_data.rightPlayer.score, game_data.rightPlayer.score_x, game_data.rightPlayer.score_y);
        } catch (error) {
            console.log(error);
        }
    }

	onMount(async () => {
		if (!await get_current_user_data().then(resp => resp.is_logged_in)) {
			await push('/');
		}
		try {
			$game_socket.on('exit-game', async () => {
				await push('/');
			});
			$game_socket.on('get-data', (data) => {
				game_data = data;
				is_started = true;
				draw();
			});
		} catch (error) {
			console.log("Not connected to game");
			await push('/');
		}
	});

	onDestroy(() => {
		try {
			$game_socket.removeAllListeners();
			$game_socket.close();
		} catch (error) {}
	});
</script>

<Header/>


<svelte:window on:keydown|preventDefault={keyHandler}  />
<canvas
        bind:this={canvas}
        width={game_data.field.width}
        height={game_data.field.height}
></canvas>

<style>
    canvas { background: #1a1e21; }
</style>