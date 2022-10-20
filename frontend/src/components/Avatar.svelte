<script context="module">
    const elements = new Set();
</script>

<script lang="ts">
    import {GET_LOGIN_AVATAR} from "../stores/store";

	export let size;
    export let login = "";

	// default paths
	let default_imageSrc = "static/default_avatar.png";
	let loading_imageSrc = "static/loading_icon.gif";
	let actual_img = default_imageSrc;

	const fetchImage = (async () => {
		const resp = await fetch($GET_LOGIN_AVATAR + login)
		const imageBlob = await resp.blob();
		const reader = new FileReader();
		reader.readAsDataURL(imageBlob);

		reader.onload = function (e) {
			var rawLog = reader.result;
			if (resp.ok) {
				actual_img = rawLog as string;
			} else {
				throw new Error();
			}
		};
	})();
</script>

<main>
    {#await fetchImage}
        <div class="avatar">
            <img src={loading_imageSrc} alt="profile" class="avatar-img" style="width: {size}px;" />
        </div>
    {:then data}
        <img src="{actual_img}" class="rounded-circle" style="width: {size}px;"
             alt="Avatar" />
    {:catch error}
        <div class="avatar">
            <img src={default_imageSrc} alt="profile" class="avatar-img" style="width: {size}px;"/>
        </div>
    {/await}
</main>