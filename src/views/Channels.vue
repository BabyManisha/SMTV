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
            
            <v-btn icon @click="resetChannels()" title="Channels">
                <v-badge color="green">
                    <template v-slot:badge >{{channelsList.length}}</template>
                    <v-icon>ballot</v-icon>
                </v-badge>
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

        <v-container style="padding-top: 100px;">
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
export default {
    name: "Channels",
    props: {
        countryCode: String
    },
    data() {
        return {
            channelsList: [],
            searchText: '',
            showPlaylist: this.$parent.showPlaylist
        }
    },
    created() {
        if(this.countryCode){
            this.getChannelsData(this.countryCode);
        }else{
            this.$router.push("/");
        }
    },
    computed: {
        getChannelsInfo(){
            let self = this, tempChannelsList = [];
            if(self.searchText.length){
                for(let ch in self.channelsList){
                    if(self.channelsList[ch]['name'].toLowerCase().includes(self.searchText)){
                        tempChannelsList.push(self.channelsList[ch]);
                    }
                }
                return tempChannelsList;
            }
            return self.channelsList;
        }
    },
    methods: {
        getChannelsData(countryCode){
            let self = this;
            self.$parent.channelInfo = {};
            self.$parent.channelInfo['countryCode'] = countryCode;
            Vue.http.get("/Channels/"+countryCode+".json")
            .then((res)=>{
                self.channelsList = res.data || [];
                self.$parent.channelsList = self.channelsList;
            },(error)=>{
                Vue.http.get("/Channels/UNSORTED.json")
                .then((res)=>{
                    self.channelsList = res.data || [];
                    self.$parent.channelsList = self.channelsList;
                },(error)=>{
                    self.channelsList = [];
                    self.$parent.channelsList = [];
                })
            });
        },
        resetChannels(){
            this.$router.push("/static/Channels/"+this.countryCode);
        },
        watchChannel(channel) {
            this.$parent.channelInfo = channel;
            this.$parent.channelInfo['len'] = this.channelsList.length;
            this.$router.push("/live");
        },
        watchPlaylist(){
            this.$parent.watchPlaylist();
        }
    },
}
</script>