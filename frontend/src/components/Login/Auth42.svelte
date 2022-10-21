<script>
    import {BACKEND_URL} from "../../stores/store";
</script>

<main>
    <div style="margin-bottom: 1em">
        <a href="{$BACKEND_URL}/auth/42/return">
            <button class="button is-dark is-large m-auto">
                <span>
                    <img class="ft-icon" src="static/logo-42-square-reverse.png" alt="42">
                </span>
                Connect
            </button>
        </a>
    </div>
</main>

<style>
    .button {
        background-color: #fff;
        border-color: #dbdbdb;
        border-width: 1px;
        color: #363636;
        cursor: pointer;
        justify-content: center;
        padding: calc(.375em - 1px) .75em;
        text-align: center;
        white-space: nowrap;
    }

    .button.is-large {
        font-size: 1.5rem;
    }

    .button.is-dark {
        background-color: #363636;
        border-color: transparent;
        color: #f5f5f5;
        border-radius: 8px;
    }

    .m-auto {
        margin: auto !important;
    }

    .ft-icon {
        height: 1.5em;
        width: 1.5em;
    }

</style>