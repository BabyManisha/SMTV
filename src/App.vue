<template>
    <div class="smtv-app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data: () => ({
        channelsList: [],
        channelInfo: {},
        showPlaylist: false
    }),
    created() {
        var self = this;
        self.checkFavorite();
    },
    methods: {
        checkFavorite(){
            let channelInfo = JSON.parse(localStorage['smtv'] || false);
            if(channelInfo){
                this.showPlaylist = true;
            }else{
                this.showPlaylist = false;
            }
        },
        watchPlaylist(){
            this.channelInfo = JSON.parse(localStorage['smtv'] || false);
            this.$router.push("/live");
        }
    },
};
</script>
