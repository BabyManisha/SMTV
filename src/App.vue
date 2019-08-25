<template>
    <v-app>
        <div class="smtv-app">
            <div id="header-div">
                <v-app-bar
                absolute
                color="#f54254"
                dark
                src="https://picsum.photos/1920/1080?random"
                fade-img-on-scroll
                scroll-target="#scrolling-techniques-5"
                scroll-threshold="500"
            >
                    <template v-slot:img="{ props }">
                    <v-img
                        v-bind="props"
                        gradient="to top right, rgba(245, 96, 66,.7), rgba(245, 66, 84, .7)"
                    ></v-img>
                    </template>
            
                    <router-link to="/">
                        <v-btn icon>
                            <v-icon class="brand">live_tv</v-icon>
                        </v-btn>
                    </router-link>
                    
                    <v-toolbar-title><b>SM TV</b></v-toolbar-title>

                    <div class="flex-grow-1"></div>
            
                    <v-text-field v-if="showSearch" id="search" label="Search For Channels . . . ."
                        v-model="searchText" outlined clearable 
                        solo append-icon="search" hide-details single-line
                        @keyup.enter="getSearchData()">
                    </v-text-field>

                    <router-link  v-if="showSearch" to="/countries" title="World Map">
                        <v-btn icon>
                            <v-badge color="green">
                                <!-- <template v-slot:badge >154</template> -->
                                <v-icon>map</v-icon>
                            </v-badge>
                        </v-btn>
                    </router-link>
                    
                    <v-btn icon @click="resetChannels()" v-if="isLive" title="Channels">
                        <v-badge color="green">
                            <!-- <template v-slot:badge >{{channelsList.length}}</template> -->
                            <v-icon>ballot</v-icon>
                        </v-badge>
                    </v-btn>
                    
                    <v-btn icon v-if="isLive" title="Favorite Channels" @click="makeFavorite()">
                        <v-btn icon>
                            <v-badge color="green">
                                <v-icon :class="isFavorite ? 'selected' : 'normal'">favorite</v-icon>
                            </v-badge>
                        </v-btn>
                    </v-btn>

                    <v-btn icon title="Favorite Channels" v-if="showPlaylist" @click="watchPlaylist()">
                        <v-btn icon>
                            <v-badge color="green">
                                <!-- <template v-slot:badge >5</template> -->
                                <v-icon>playlist_play</v-icon>
                            </v-badge>
                        </v-btn>
                    </v-btn>
                </v-app-bar>
            </div>
            <router-view></router-view>
        </div>
    </v-app>
</template>

<script>
import { debug } from 'util';
export default {
    name: 'App',
    data: () => ({
        channelsList: [],
        channelInfo: {},
        searchText: "",
        showPlaylist: false,
        isFavorite: false,
        showSearch: true,
        isLive: false
    }),
    created() {
        var self = this;
        self.checkPlaylist();
        self.checkPath();
        self.$eventHub.$on('updateChannelsList', self.updateChannelsList);
        self.$eventHub.$on('updateChannelInfo', self.updateChannelInfo);
    },
    updated() {
        this.checkPath();
    },
    watch: {
        searchText(){
            this.getSearchData();
        }
    },
    methods: {
        checkPath(){
            var self = this;
            self.checkPlaylist();
            if(window.location.pathname == '/' || window.location.pathname == '/countries'){
                self.showSearch = false;
                self.isLive = false;
            }else if(window.location.pathname == '/live'){
                self.showSearch = true;
                self.isLive = true;
            } else{
                self.showSearch = true;
                 self.isLive = false;
            }
        },
        updateChannelsList(clist){
            this.channelsList = clist;
        },
        updateChannelInfo(cinfo){
            this.channelInfo = cinfo;
        },
        getSearchData(){
            let self = this, tempChannelsList = [];
            if(self.channelsList.length == 0){
                this.$router.push("/");
            }else if(self.searchText && self.searchText.length){
                for(let ch in self.channelsList){
                    if(self.channelsList[ch]['name'].toLowerCase().includes(self.searchText)){
                        tempChannelsList.push(self.channelsList[ch]);
                    }
                }
                self.$eventHub.$emit('updateSearchChannelsList', tempChannelsList);
            }else{
                self.$eventHub.$emit('updateSearchChannelsList', self.channelsList);
            }
        },
        resetChannels(){
            this.$router.push("channels/"+this.channelInfo['countryCode']);
        },
        checkPlaylist(){
            let channelInfo = JSON.parse(localStorage['smtv'] || false);
            if(channelInfo){
                this.showPlaylist = true;
            }else{
                this.showPlaylist = false;
            }
        },
        makeFavorite(){
            this.$eventHub.$emit('makeFavorite');
        },
        watchPlaylist(){
            this.channelInfo = JSON.parse(localStorage['smtv'] || false);
            if(window.location.pathname != '/live'){
                this.$router.push('/live');
            }else{
                this.$eventHub.$emit('playVideo');
            }
        }
    },
};
</script>
