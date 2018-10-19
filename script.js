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
            let states = topojson.mesh(topology, topology.objects.states, (a, b) => a !== b);
            let counties = topojson.mesh(topology, topology.objects.counties, (a, b) => a !== b);
            console.log("nation", nation);

            let path = d3.geoPath();
            //console.log(path);
            


            //svg.append("path").attr("d", path(nation));
            svg.append("path")
            .datum(nation)
            .attr("d", path)
            .attr("fill", "navy");

            svg.append("path")
            .datum(counties)
            .attr("fill", "none")
            .attr("stroke", "cyan")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

            svg.append("path")
            .datum(states)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

            
        })
    });
    

});