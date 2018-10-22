document.addEventListener("DOMContentLoaded", function() {
    
    fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json")
    .then((response) => response.json())
    .then((topology) => {
        
        fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")
        .then((response) => response.json())
        .then((education) => {
            console.log(topology);
            //console.log(education);

            /* CONSTANTS */

            //Width and height to define the svg constant.
            const width = 1000;
            const height = 1000;
            const svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

            //Conversions of the nation, states, and countines objects found inside the topoJSON dataset provided.
            let nation = topojson.feature(topology, topology.objects.nation);
            let states = topojson.mesh(topology, topology.objects.states, (a, b) => a !== b);
            let counties = topojson.feature(topology, topology.objects.counties);
            console.log("nation", nation);
            console.log("states", states);
            console.log("counties", counties);

            let path = d3.geoPath();
            
            //minEdu and maxEdu are used to define the domain for the color scales, for use in fill attributes later.
            const minEdu = d3.min(education, (val) => val["bachelorsOrHigher"]);
            const maxEdu = d3.max(education, (val) => val["bachelorsOrHigher"]);
            const color = d3.scaleQuantize().domain([minEdu, maxEdu]).range(["#ffffff", "#e0f5ec", "#c0e9da", "#9bd9c7", "#74c4b7", "#41a2ab", "#237c8b", "#00556d", "#003544"]);

            /* SVG APPENDS */

            svg.append("g").selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("fill", (d) => color(education.filter((val) => val["fips"] === d.id)[0]["bachelorsOrHigher"]))
            .attr("d", path)
            .attr("id", (d) => d.id)
            .attr("data-area-name", (d) => education.filter((val) => val["fips"] === d.id)[0]["area_name"]);

            svg.append("path")
            .datum(states)
            .attr("fill", "none")
            .attr("stroke", "lightgrey")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

            
        })
    });
    

});