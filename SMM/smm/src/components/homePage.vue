<template>
  <div class="feedContainer">
      <div class="feedHeader-container ">
        <div class="feedHeader">
          <img
            id="feedCondor-icon"
            src="../icon_condor.png"
            alt="Condor Icon"
          />
          <!-- <font-awesome-icon :icon="['fas', 'user']" /> -->
        </div>
      </div>
      <!-- L'item "footer" ha posizione fixed. L'ho messo qui per comodità. -->
      <div class="feedFooter">
       <!-- <bulma icon house" /> -->
       <span class="icon">
        <i class="fas fa-home"></i>
       </span>
       <span class="icon">
        <i class="fas fa-feather" onclick={PostMessage}></i> <!--Da implementare-->
       </span>
       <span class="icon">
        <i class="fas fa-search"></i>
       </span>
      </div>
      <div class="feed">
        <!--  -->
        <!--  -->
        <!-- inizio post -->
        <div class="user-post" id="0001">
          <div class="profile-pic">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
            />
          </div>
          <div class="post-body">
            <div class="post-namedate">
              <span class="post-username"><span>@</span>Camzz</span>
              <i class="fas fa-feather"></i>
              <span class="post-date"> | Dec 13</span>
            </div>
            <div class="post-content">
              <img
                src="https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div class="post-reactions">
              <div class="post-comments">
                <i class="fas fa-comment"></i>
                <span class="post-comments-number">69</span>
              </div>
              <div class="post-likes">
                <i class="fas fa-thumbs-up"></i>
                <span class="post-likes-number">227</span>
              </div>
              <div class="post-dislikes">
                <i class="fas fa-thumbs-down"></i>
                <span class="post-dislikes-number">38</span>
              </div>
              <div class="post-impressions">
                <i class="fas fa-eye"></i>
                <span class="post-impressions-number">3.148</span>
              </div>
            </div>
          </div>
        </div>
        <!-- fine post -->
        <!--  -->
        <!--  -->
        <!-- inizio post -->
        <div class="user-post" id="0002">
          <div class="profile-pic">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
            />
          </div>
          <div class="post-body">
            <div class="post-namedate">
              <span class="post-username"><span>@</span>Emrata</span>
              <!-- <i class="fas fa-feather"></i> -->
              <span class="post-date"> | Dec 14</span>
            </div>
            <div class="post-content">
              Vorrei proprio farmi amare da un ligure.
            </div>
            <div class="post-reactions">
              <div class="post-comments">
                <i class="fas fa-comment"></i>
                <span class="post-comments-number">134</span>
              </div>
              <div class="post-likes">
                <i class="fas fa-thumbs-up"></i>
                <span class="post-likes-number">2</span>
              </div>
              <div class="post-dislikes">
                <i class="fas fa-thumbs-down"></i>
                <span class="post-dislikes-number">198</span>
              </div>
              <div class="post-impressions">
                <i class="fas fa-eye"></i>
                <span class="post-impressions-number">254</span>
              </div>
            </div>
          </div>
        </div>
        <!-- fine post -->
        <!--  -->
        <!--  -->
        <!-- inizio post -->
        <div class="user-post" id="0003">
          <div class="profile-pic">
            <img
              src="https://images.unsplash.com/photo-1584999734482-0361aecad844?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
            />
          </div>
          <div class="post-body">
            <div class="post-namedate">
              <span class="post-username"><span>@</span>DiGia</span>
              <i class="fas fa-feather"></i>
              <span class="post-date"> | Dec 15</span>
            </div>
            <div class="post-content">
              <img
                src="https://static.sky.it/editorialimages/5a52e4808f8e230933693a55e5812d99d34e38cd/skytg24/it/cronaca/2023/01/23/-meteo-neve-oggi-foto/Neve_Norcia.jfif"
                alt="Snow"
              />
            </div>
            <div class="post-reactions">
              <div class="post-comments">
                <i class="fas fa-comment"></i>
                <span class="post-comments-number">13</span>
              </div>
              <div class="post-likes">
                <i class="fas fa-thumbs-up"></i>
                <span class="post-likes-number">1.543</span>
              </div>
              <div class="post-dislikes">
                <i class="fas fa-thumbs-down"></i>
                <span class="post-dislikes-number">12</span>
              </div>
              <div class="post-impressions">
                <i class="fas fa-eye"></i>
                <span class="post-impressions-number">9.008</span>
              </div>
            </div>
          </div>
        </div>
        <!-- fine post -->
        <!--  -->
        <!--  -->
        <!-- inizio post -->
        <div class="user-post" id="0004">
          <div class="profile-pic">
            <img
              src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
            />
          </div>
          <div class="post-body">
            <div class="post-namedate">
              <span class="post-username"><span>@</span>Manueee</span>
              <i class="fas fa-feather"></i>
              <span class="post-date"> | Jan 04</span>
            </div>
            <div class="post-content">Mi piacciono i gatti ciaoooo.</div>
            <div class="post-reactions">
              <div class="post-comments">
                <i class="fas fa-comment"></i>
                <span class="post-comments-number">1</span>
              </div>
              <div class="post-likes">
                <i class="fas fa-thumbs-up"></i>
                <span class="post-likes-number">1</span>
              </div>
              <div class="post-dislikes">
                <i class="fas fa-thumbs-down"></i>
                <span class="post-dislikes-number">1.103</span>
              </div>
              <div class="post-impressions">
                <i class="fas fa-eye"></i>
                <span class="post-impressions-number">8.390</span>
              </div>
            </div>
          </div>
        </div>
        <!-- fine post -->
        <!--  -->
        <!--  -->
        <!-- inizio post -->
        <div class="user-post" id="0005">
          <div class="profile-pic">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
            />
          </div>
          <div class="post-body">
            <div class="post-namedate">
              <span class="post-username"><span>@</span>Jaques</span>
              <!-- <i class="fas fa-feather"></i> -->
              <span class="post-date"> | 2h</span>
            </div>
            <div class="post-content">
              <img
                src="https://images.unsplash.com/photo-1534146789009-76ed5060ec70?q=80&w=2649&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div class="post-reactions">
              <div class="post-comments">
                <i class="fas fa-comment"></i>
                <span class="post-comments-number">66</span>
              </div>
              <div class="post-likes">
                <i class="fas fa-thumbs-up"></i>
                <span class="post-likes-number">134</span>
              </div>
              <div class="post-dislikes">
                <i class="fas fa-thumbs-down"></i>
                <span class="post-dislikes-number">0</span>
              </div>
              <div class="post-impressions">
                <i class="fas fa-eye"></i>
                <span class="post-impressions-number">1592</span>
              </div>
            </div>
          </div>
        </div>
        <!-- fine post -->
        <!--  -->
        <!--  -->
      </div>
      <div class="footer"></div>
    </div>
</template>
<script>
  import { ref, onMounted } from 'vue';
  //import { library } from '@fortawesome/fontawesome-svg-core';
  //import { faUser, faHouse, faFeather, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
  //import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  
  import "../feed_style.css"
  
  //library.add(faHouse, faFeather, faMagnifyingGlass);
  
  export default {
    setup() {
      const squeals = ref([]);

      onMounted(async () => {
        try {
          const response = await fetch('http://localhost:3001/squealsToUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: 'nome_utente' }) 
          });
          if (!response.ok) {
            throw new Error('Errore nel caricamento dei squeals');
          }
          const data = await response.json();
          squeals.value = data;
        } catch (error) {
          console.error('Errore:', error);
        }
      });

      return { squeals };
    },
    components:{
      /*FontAwesomeIcon*/
    }
  }
</script>
