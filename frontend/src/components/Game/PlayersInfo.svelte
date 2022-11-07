<script lang="ts">
	import Avatar from "../Avatar.svelte";

	export let leftPlayer: object;
	export let rightPlayer: object;
</script>

<div class="h-100 d-flex align-items-center justify-content-center">
    <ul class="list-group list-group-horizontal position-relative">
        <li class="list-group-item">
            <div class="d-flex align-items-center">
                <div>
                    <Avatar classes="rounded-circle" size="40" nickname="{leftPlayer.nickname}"/>
                </div>
                <div class="ms-3">{leftPlayer.nickname}</div>
            </div>
        </li>
        <li class="list-group-item">
            <div class="d-flex align-items-center">
                <div>{rightPlayer.nickname} </div>
                <div class="ms-3">
                    <Avatar classes="rounded-circle" size="40" nickname="{rightPlayer.nickname}"/>
                </div>
            </div>
        </li>
    </ul>
</div>