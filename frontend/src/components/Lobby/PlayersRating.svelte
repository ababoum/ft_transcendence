<script lang="ts">
	import {onMount} from "svelte";
	import {get_top_10} from "../../stores/requests";
	import Avatar from "../Avatar.svelte";

	let stats: any = undefined;
	onMount(async () => {
		try {stats = await get_top_10()}
		catch (e) {}
	});

</script>

<main>
    <div class="container rounded bg-white p-md-5">
        <div class="h2 font-weight-bold">Top Players</div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Rating</th>
                </tr>
                </thead>
                <tbody>
                {#if stats !== undefined}
                    {#each stats as stat}
                        <tr class="bg-blue">
                            <td class="pt-2">
                                <Avatar classes="rounded-circle" size="40" nickname="{stat.nickname}"/>
                                <div class="pl-lg-5 pl-md-3 pl-1 name">{stat.nickname}</div>
                            </td>
                            <td class="pt-3 mt-1">{stat.rating}</td>
                            <td class="pt-3"><span class="fa fa-check pl-3"></span></td>
                            <td class="pt-3"><span class="fa fa-ellipsis-v btn"></span></td>
                        </tr>
                        <tr class="spacing-row">
                            <td></td>
                        </tr>
                    {/each}
                {/if}
                </tbody>
            </table>
        </div>
    </div>
</main>


<style>
    * {
        box-sizing: border-box
    }

    .h2 {
        color: #444;
        font-family: 'PT Sans', sans-serif
    }

    thead {
        font-family: 'Poppins', sans-serif;
        font-weight: bolder;
        font-size: 20px;
        color: #666
    }

    .name {
        display: inline-block
    }

    .bg-blue {
        background-color: #EBF5FB;
        border-radius: 8px
    }

    .fa-check {
        color: blue
    }

    .bg-blue:hover {
        background-color: #3e64ff;
        color: #eee;
        cursor: pointer
    }

    .bg-blue:hover .fa-check,
    .bg-blue:hover {
        background-color: #3e64ff;
        color: #eee
    }

    .table thead th,
    .table td {
        border: none
    }

    .table tbody td:first-child {
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px
    }

    .table tbody td:last-child {
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px
    }

    .spacing-row {
        height: 10px
    }

    @media (max-width: 575px) {
        .container {
            width: 125%;
            padding: 20px 10px
        }
    }
</style>