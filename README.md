Pour un 1er lancement
- C/C config/backend.env => backend/.env
- DB_HOST='postgres' => DB_HOST='localhost'
- docker-compose up postgres -d
- Supprimer les dossiers de migration dans backend/prisma/migrations
- cd backend/
- npx prisma migrate dev
- npx prisma generate
- cd ..
- make

TESTS TO DO:
- Run tests on each browser (Chrome, Firefox)
- Monitor warnings and unhandled errors in the console

TO DO
- Voir pour input field plein d'espaces, interdire les espaces comme caracteres **OK**
- Tester 42auth + 2FA ➔ **Normalement OK, cas d'usage standard**
- SOCKET NE SE CONNECTE PAS APRES 1er LOGIN


HOW TO LAUNCH ON THE CLOUD
- prepare backend.env (DATABASE_URL + correct API KEY)
- update domain.js with the right urls
- update backend Dockerfile to launch the right CMD (with or without db reset: init vs prod)]

LAST TESTS:
- Ajouter on:keypress a tous les on:click
(!) Plugin svelte: A11y: visible, non-interactive elements with an on:click event must be accompanied by an on:keydown, on:keyup, or on:keypress event.
src/routes/ChatRoom.svelte
774:                               {#if DirectMessagesRoom.participants[0].nickname === $user.nickname}
775:                                 {#if blockList.find((x) => x.nickname === DirectMessagesRoom.participants[1].nickname) === undefined}
776:                                   <p
                                       ^
777:                                     class="btn btn-info DM"
778:                                     on:click={() =>
src/routes/ChatRoom.svelte
788:                               {:else if DirectMessagesRoom.participants[1].nickname === $user.nickname}
789:                                 {#if blockList.find((x) => x.nickname === DirectMessagesRoom.participants[0].nickname) === undefined}
790:                                   <p
                                       ^
791:                                     class="btn btn-info DM"
792:                                     on:click={() =>
src/routes/ChatRoom.svelte
882:                                     aria-labelledby="dropdownMenuButton"
883:                                   >
884:                                     <p
                                         ^
885:                                       class="dropdown-item"
886:                                       on:click={() =>
src/routes/ChatRoom.svelte
895:                                     {#if message.author.nickname != $user.nickname}
896:                                       {#if invite === true}
897:                                         <p
                                             ^
898:                                           class="dropdown-item"
899:                                           on:click={() =>
src/routes/ChatRoom.svelte
914:                                         </p>
915:                                       {/if}
916:                                       <p
                                           ^
917:                                         class="dropdown-item"
918:                                         on:click={() =>
src/routes/ChatRoom.svelte
925:                                         Block
926:                                       </p>
927:                                       <p
                                           ^
928:                                         class="dropdown-item"
929:                                         on:click={() =>
src/components/Profile/ProfileImage.svelte
35:   <Avatar nickname={$user.nickname} size="125" personal={true} />
36:   <div class="avatar-content">
37:     <span
        ^
38:       class="avatar-text"
39:       on:click={() => {
src/components/Profile/ProfileAbout.svelte
104:       <strong>Nickname:</strong>
105:       {$user.nickname}
106:       <span class="update-btn" on:click={toggleNickname}>⚙️</span>
           ^
107:     </div>
108:     {#if updating_nickname}
src/components/Profile/ProfileAbout.svelte
132:       <strong>Email:</strong>
133:       {$user.email}
134:       <span class="update-btn" on:click={toggleEmail}>⚙️</span>
           ^
135:     </div>
136:     {#if updating_email}
src/components/Profile/ProfileAbout.svelte
159:     <div>
160:       <strong>Do you want to change your password?</strong>
161:       <span class="update-btn" on:click={togglePassword}>⚙️</span>
           ^
162:     </div>
163:     {#if updating_password}
src/components/Profile/Friends.svelte
46:               <div class="col-md-7 col-sm-7">
47:                 <h5>
48:                   <span
                      ^
49:                     on:click={() =>
50:                       displayUserProfile(nickname)}
src/components/Profile/Modal.svelte
52: <div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
53:   <div id="modal" on:click|stopPropagation={() => {}}>
54:     <svg id="close" on:click={() => close()} viewBox="0 0 12 12">
        ^
55:       <circle cx="6" cy="6" r="6" />
56:       <line x1="3" y1="3" x2="9" y2="9" />
src/components/Profile/Modal.svelte
51: 
52: <div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
53:   <div id="modal" on:click|stopPropagation={() => {}}>
      ^
54:     <svg id="close" on:click={() => close()} viewBox="0 0 12 12">
55:       <circle cx="6" cy="6" r="6" />
src/components/Profile/Modal.svelte
50: </script>
51: 
52: <div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
    ^
53:   <div id="modal" on:click|stopPropagation={() => {}}>
54:     <svg id="close" on:click={() => close()} viewBox="0 0 12 12">
src/components/Game/SpectatorPopup.svelte
17: </script>
18: 
19: <span
    ^
20:   class="badge bg-primary rounded-pill"
21:   style="cursor: default"
