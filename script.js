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
            const colorsArr = getGradient("rgb(255, 255, 255)", "rgb(0, 82, 96)", 100);
            const color = d3.scaleQuantize().domain([minEdu, maxEdu]).range(colorsArr);
            console.log(colorsArr);

            /* FUNCTIONS */

            //interpolate() returns a color value midway between the two provided color values. The degree of change depends on the factor.
            //This function is called inside the getGradient function.
            function interpolate(color1, color2, factor) {
                if (arguments.length < 3) {
                    factor = 0.5;
                }
        
                let result = color1.slice();
                for (let i = 0; i < 3; i++) {
                    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
                }
                return result;
            }
        
            //getGradient() takes three args - c1 and c2 are colors in rgb() format, and steps is the number of intermediary colors desired.
            //The function returns a 2D array. Each value in the array is another array of three numbers, designed to fit into rgb() values.
            function getGradient(c1, c2, steps) {
                let stepFactor = 1 / (steps - 1), interpolatedArray = [];
                c1 = c1.match(/\d+/g).map(Number);
                c2 = c2.match(/\d+/g).map(Number);
        
                for (let i = 0; i < steps; i++) {
                    interpolatedArray.push(interpolate(c1, c2, stepFactor * i));
                }
                return interpolatedArray;
            }

            /* SVG APPENDS */

            svg.append("g").selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("fill", (d) => `rgb(${color(education.filter((val) => val["fips"] === d.id)[0]["bachelorsOrHigher"])})`)
            .attr("d", path)
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => education.filter((val) => val["fips"] === d.id)[0]["bachelorsOrHigher"])
            .attr("class", "county")
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