<script lang="ts">
    import User from "../User";
    import { link } from "svelte-spa-router";
    import { LOGIN_URL } from "../stores";
    import { user } from "../stores";

    let login: string;
    let pass: string;
    let email: string;

    let is_login: boolean = true;
</script>

<main>
    <section class="vh-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-dark text-white" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <div class="mb-md-5 mt-md-4 pb-5">

                                <h2 class="fw-bold mb-2 text-uppercase">{is_login ? "Login" : "Registration"} </h2>
                                <p class="text-white-50 mb-5">Please enter your login{!is_login ? ", email" : ""}
                                    and password!</p>

                                <div class="form-outline form-white mb-4">
                                    <input type="text" id="typeTextX" class="form-control form-control-lg"
                                           bind:value={login}/>
                                    <label class="form-label" for="typeTextX">User name</label>
                                </div>
                                {#if !is_login}
                                    <div class="form-outline form-white mb-4">
                                        <input type="email" id="typeEmailX" class="form-control form-control-lg"
                                               bind:value={email}/>
                                        <label class="form-label" for="typeTextX">email</label>
                                    </div>
                                {/if}

                                <div class="form-outline form-white mb-4">
                                    <input type="password" id="typePasswordX" class="form-control form-control-lg"
                                           bind:value={pass}/>
                                    <label class="form-label" for="typePasswordX">Password</label>
                                </div>

                                <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

                                <button class="btn btn-outline-light btn-lg px-5" type="submit"
                                        on:click={is_login ? $user.logIn(login, pass) : $user.register_user(login, pass, email)}>
                                    {is_login ? "Login" : "Register"} </button>

                                <div class="d-flex justify-content-center text-center mt-4 pt-1">
                                    <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                    <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                                </div>

                            </div>

                            <div>
                                <p class="mb-0">{is_login ? "Don't h" : "H"}ave an account? <a class="text-white-50 fw-bold"
                                 href={$LOGIN_URL} on:click={() => (is_login = !is_login)}>Sign {is_login ? "Up" : "In"} </a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>