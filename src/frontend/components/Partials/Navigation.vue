<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <router-link to="/" class="navbar-brand">Dashboard</router-link>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Camaras
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">            
          <router-link v-for="cam in cameras" :key="cam.hostname" :to="'/camera/' + cam.hostname" class="dropdown-item">{{ cam.hostname }}</router-link>
          <!-- <router-link to="/camera/1" class="dropdown-item">Patio</router-link> -->
        </div>
      </li>
    </ul>
  </div>
</nav>

</template>
<script>
export default {
  name: "Navigation-menu",
  props: ['cameras'],
}
</script>
