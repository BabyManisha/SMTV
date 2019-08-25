<template>
    <v-app>
        <v-container class="main-container">
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
export default {
    name: "Channels",
    props: {
        countryCode: String
    },
    data() {
        return {
            channelsList: [],
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
            let self = this, tempChannelsList = [], searchText = self.$parent.$parent.searchText;
            if(searchText && searchText.length){
                for(let ch in self.channelsList){
                    if(self.channelsList[ch]['name'].toLowerCase().includes(searchText)){
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
            Vue.http.get("/Channels/"+countryCode+".json")
            .then((res)=>{
                self.channelsList = res.data || [];
                self.$eventHub.$emit('updateChannelsList', self.channelsList);
            },(error)=>{
                Vue.http.get("/Channels/UNSORTED.json")
                .then((res)=>{
                    self.channelsList = res.data || [];
                    self.$eventHub.$emit('updateChannelsList', self.channelsList);
                },(error)=>{
                    self.channelsList = [];
                   self.$eventHub.$emit('updateChannelsList', []);
                })
            });
        },
        resetChannels(){
            this.$router.push("/static/Channels/"+this.countryCode);
        },
        watchChannel(channel) {
            channel['len'] = this.channelsList.length;
            channel['countryCode'] = this.countryCode;
            this.$eventHub.$emit('updateChannelInfo', channel);
            this.$router.push("/live");
        },
        watchPlaylist(){
            this.$parent.watchPlaylist();
        }
    },
}
</script>