<template>
    <v-app>
        <v-container class="main-container">
            <h1 class="container-head-text">Enjoy Watching 6000+ Live channels from all over the world 😎</h1>
            <div class="worldmap">
                <div id="chartdiv"></div>
            </div>
        </v-container>
    </v-app>

</template>

<script>
export default {
    name: "Countries",
    props: {
        getChannelsData: Function
    },
    data (){
        return{
            showPlaylist: this.$parent.showPlaylist
        }
    },
    mounted(){
        var self = this;
        // Create map instance
        var chart = am4core.create("chartdiv", am4maps.MapChart);

        // Set map definition
        chart.geodata = am4geodata_worldLow;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;


        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am4core.color("#5CAB7D");
        polygonTemplate.propertyFields.fill = "color";


        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#5A9367");

        // Remove Antarctica
        polygonSeries.exclude = ["AQ"];

        // Add zoom control
        // chart.zoomControl = new am4maps.ZoomControl();


        polygonTemplate.events.on("hit", function(ev) {
            var data = ev.target.dataItem.dataContext;
            // console.log(data);
            // console.log(channelData[data.id]);
            // self.$eventHub.$emit('getChannelsData', data);
            self.$router.push('channels/'+data.id);
        });
    },
    methods: {
        watchPlaylist(){
            this.$parent.watchPlaylist();
        }
    },
};
</script>