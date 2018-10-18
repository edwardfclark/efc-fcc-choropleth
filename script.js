document.addEventListener("DOMContentLoaded", function() {
    
    fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json")
    .then((response) => response.json())
    .then((topology) => {
        
        fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")
        .then((response) => response.json())
        .then((education) => {
            console.log(topology);
            //console.log(education);

            const width = 1000;
            const height = 1000;

            const svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

            let nation = topojson.feature(topology, topology.objects.nation);
            let states = topojson.feature(topology, topology.objects.states);
            let counties = topojson.feature(topology, topology.objects.counties);
            //console.log("nation", nation);

            let path = d3.geoPath();
            //console.log(path);
            


            //svg.append("path").attr("d", path(nation));
            svg.append("path")
            .datum(nation)
            .attr("d", path)
            .attr("fill", "navy");

            svg.append("path")
            .datum(topojson.mesh(topology, topology.objects.states), (a, b) => a !== b)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

            svg.append("path")
            .datum(topojson.mesh(topology, topology.objects.counties), (a, b) => a !== b)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        })
    });
    

});