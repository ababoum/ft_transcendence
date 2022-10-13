<script lang="ts">
	let imageSrc = fetch('google.fr');
	let default_imageSrc = '../'
</script>

{#await imageSrc}
<div class="avatar">
	<img src={imageSrc} alt="profile" class="avatar-img" />
</div>	
{:then } 
<div class="avatar">
	<img src={imageSrc} alt="profile" class="avatar-img" />
</div>
	
{/await}

<style>
	.avatar {
		text-align: center;
		margin: 20px;
	}

	.avatar-img {
		width: 80px;
		border-radius: 50%;
	}
</style>