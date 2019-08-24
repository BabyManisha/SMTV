<template>
    <v-app>
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
    
            <v-text-field label="Search For Channels"
                v-model="searchText" outlined clearable 
                solo append-icon="search" hide-details single-line>
            </v-text-field>

            <router-link to="/countries" title="World Map">
                <v-btn icon>
                    <v-badge color="green">
                        <template v-slot:badge >154</template>
                        <v-icon>map</v-icon>
                    </v-badge>
                </v-btn>
            </router-link>
            
            <v-btn icon @click="resetChannels()" v-if="channelsList.length" title="Channels">
                <v-badge color="green">
                    <template v-slot:badge >{{channelsList.length}}</template>
                    <v-icon>ballot</v-icon>
                </v-badge>
            </v-btn>
            
            <v-btn icon title="Favorite Channels" @click="makeFavorite()">
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

        <v-container style="padding-top: 100px;" v-if="liveTV">
            <div class="livetv">
                <video id="smTV" class="video-js vjs-default-skin" controls preload="auto">
                    <source :src="channelInfo['url']" type="application/x-mpegURL">
                </video>
            </div>
        </v-container>
        <v-container style="padding-top: 100px;" v-else>
            <h1 class="container-head-text">Select a Channel to Watch!! 😎 </h1>
            <div class="channels">
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-card>
                            <v-container fluid>
                                <v-row>
                                    <v-col
                                        v-for="(channel, index) in tempChannelsList"
                                        :key="index"
                                        class="d-flex child-flex"
                                        cols="2"
                                    >
                                        <v-card flat tile class="d-flex" @click="watchChannel(channel)">
                                            <v-img
                                                :src="channel.logo"
                                                :lazy-src="channel.logo"
                                                aspect-ratio="1"
                                                class="grey lighten-2 channel-image white--text"
                                                :title=channel.name
                                                height="200px"
                                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                            >
                                                <template v-slot:channel.name>
                                                    <v-row
                                                        class="fill-height ma-0"
                                                        align="center"
                                                        justify="center"
                                                    >
                                                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                                    </v-row>
                                                </template>
                                                <v-card-title
                                                    class="fill-height align-end"
                                                    v-text="channel.name"
                                                ></v-card-title>
                                            </v-img>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </v-app>
</template>
<script>
import Vue from "vue";
import { setTimeout } from 'timers';
export default {
    name: "Live",
    data() {
        return {
            channelsList: [],
            channelInfo: {},
            searchText: "",
            liveTV: true,
            tempChannelsList: [],
            isFavorite: false,
            showPlaylist: this.$parent.showPlaylist
        }
    },
    created() {
        this.channelInfo = this.$parent.channelInfo;
        this.channelsList = this.$parent.channelsList;
        if(this.channelsList.length == 0 && this.channelInfo == null){
            this.$router.push("/");
        }
    },
    updated() {
        this.channelInfo = this.$parent.channelInfo;
        this.channelsList = this.$parent.channelsList;
        // this.playVideo();
    },
    mounted() {
        this.playVideo();
    },
    watch: {
        searchText(){
            let self = this;
            self.tempChannelsList = [];
            if(self.channelsList.length == 0){
                this.$router.push("/");
            }else if(self.searchText.length){
                self.liveTV = false;
                for(let ch in self.channelsList){
                    if(self.channelsList[ch]['name'].toLowerCase().includes(self.searchText)){
                        self.tempChannelsList.push(self.channelsList[ch]);
                    }
                }
            }else{
                self.liveTV = true;
            }
        }
    },
    methods: {
        playVideo(){
            this.checkFavorite();
            setTimeout(()=> {
                if(Hls.isSupported()){
                    var video = document.getElementById('smTV');
                    var hls = new Hls();
                    hls.loadSource(this.channelInfo['url']);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED,function()
                    {
                        video.play();
                    });
                }
                else if (video.canPlayType('application/vnd.apple.mpegurl')){
                    video.src = this.channelInfo['url'];
                    video.addEventListener('canplay',function()
                    {
                        video.play();
                    });
                }
            }, 1);
        },
        watchChannel(channel) {
            this.$parent.channelInfo = channel;
            this.$parent.channelInfo['len'] = this.channelsList.length;
            this.channelInfo = this.$parent.channelInfo;
            this.channelsList = this.$parent.channelsList;
            this.liveTV = true;
            this.playVideo();
        },
        watchPlaylist(){
            this.$parent.watchPlaylist();
        },
        resetChannels(){
            this.$router.push("/channels/"+this.channelInfo['countryCode']);
        },
        checkFavorite(){
            var self = this;
            let smtv = JSON.parse(localStorage['smtv'] || false);
            if(smtv){
                self.showPlaylist = true;
                self.$parent.showPlaylist = true;
            }
            console.log(smtv['name']);
            console.log(self.channelInfo);
            console.log(self.channelInfo['name']);
            if(smtv && smtv['name'] == self.channelInfo['name']){
                self.isFavorite = true;
            }else{
                self.isFavorite = false;
            }
        },
        makeFavorite(){
            var self = this;
            if(self.isFavorite){
                delete localStorage['smtv'];
                self.isFavorite = false;
                self.showPlaylist = false;
                self.$parent.showPlaylist = false;
            }else{
                let smtv = self.channelInfo;
                localStorage['smtv'] = JSON.stringify(smtv);
                self.isFavorite = true;
                self.showPlaylist = true;
                self.$parent.showPlaylist = true;
            }
        }
    }
}
</script>