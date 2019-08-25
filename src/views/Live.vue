<template>
    <v-app>
        <v-container class="main-container" v-if="liveTV">
            <div class="livetv">
                <video id="smTV" class="video-js vjs-default-skin" controls preload="auto">
                    <source :src="channelInfo['url']" type="application/x-mpegURL">
                </video>
            </div>
        </v-container>
        <v-container class="main-container" v-else>
            <h1 class="container-head-text">Select a Channel to Watch!! 😎 </h1>
            <div class="channels">
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-card>
                            <v-container fluid>
                                <v-row>
                                    <v-col
                                        v-for="(channel, index) in getChannelsInfo"
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
                                                    class="fill-height align-end channel-name"
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
            liveTV: true,
        }
    },
    created() {
        this.$eventHub.$on('updateSearchChannelsList', this.updateSearchChannelsList);
        this.$eventHub.$on('makeFavorite', this.makeFavorite);
        this.$eventHub.$on('playVideo', this.playVideo);
    },
    mounted() {
        this.playVideo();
    },
    computed: {
        getChannelsInfo(){
            let self = this, tempChannelsList = [], searchText = self.$parent.$parent.searchText.toLowerCase();
            if(self.channelsList.length == 0){
                self.$router.push("/");
            }else if(searchText && searchText.length){
                for(let ch in self.channelsList){
                    if(self.channelsList[ch]['name'].toLowerCase().includes(searchText)){
                        tempChannelsList.push(self.channelsList[ch]);
                    }
                }
                return tempChannelsList;
            }else{
                self.liveTV = true;
            }
        }
    },
    methods: {
        playVideo() {
            var self = this;
            self.channelInfo = self.$parent.$parent.channelInfo;
            self.channelsList = self.$parent.$parent.channelsList;
            self.checkFavorite();
            setTimeout(()=> {
                if(Hls.isSupported()){
                    var video = document.getElementById('smTV');
                    var hls = new Hls();
                    hls.loadSource(self.channelInfo['url']);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED,function()
                    {
                        video.play();
                    });
                }
                else if (video.canPlayType('application/vnd.apple.mpegurl')){
                    video.src = self.channelInfo['url'];
                    video.addEventListener('canplay',function()
                    {
                        video.play();
                    });
                }
            }, 1);
        },
        updateSearchChannelsList(clist){
            var self = this;
            self.channelsList = clist;
            let channelInfo = self.$parent.$parent.channelInfo;
            if(clist.length == channelInfo['len']){
                self.liveTV = true;
                self.playVideo();
            }else{
                self.liveTV = false;
            }
        },
        watchChannel(channel) {
            channel['len'] = this.$parent.$parent.channelInfo.length;
            this.$eventHub.$emit('updateChannelInfo', channel);
            this.liveTV = true;
            this.playVideo();
        },
        checkFavorite(){
            var self = this;
            let smtv = JSON.parse(localStorage['smtv'] || false);
            if(smtv && smtv['name'] == self.channelInfo['name']){
                self.$parent.$parent.isFavorite = true;
            }else{
                self.$parent.$parent.isFavorite = false;
            }
        },
        makeFavorite(){
            var self = this;
            if(self.$parent.$parent.isFavorite){
                delete localStorage['smtv'];
                self.$parent.$parent.isFavorite = false;
                self.$parent.$parent.showPlaylist = false;
            }else{
                let smtv = self.channelInfo;
                localStorage['smtv'] = JSON.stringify(smtv);
                self.$parent.$parent.isFavorite = true;
                self.$parent.$parent.showPlaylist = true;
            }
        }
    }
}
</script>