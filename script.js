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
            const padding = {top: 0, left: 20, bottom: 0, right: 0}
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

            //Constants for use in the legend.
            const legendRectHeight = 20;
            const legendRectWidth = 3;
            const legendY = 630;
            const legendWidth = (colorsArr.length-1) * legendRectWidth;
            const legendScale = d3.scaleLinear().domain([minEdu, maxEdu]).range([padding.left, padding.left+legendWidth]);
            const legendAxis = d3.axisBottom(legendScale).tickFormat((d) => d+"%" );

            const tooltipDiv = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);

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

            //getCountyData takes an id as an arg, returns an object from the education dataset that corresponds to that id.
            function getCountyData(id) {
                return education.filter((val) => val["fips"] === id)[0];
            }

            /* SVG APPENDS */

            svg.append("g").selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("fill", (d) => `rgb(${color(getCountyData(d.id)["bachelorsOrHigher"])})`)
            .attr("d", path)
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => getCountyData(d.id)["bachelorsOrHigher"])
            .attr("class", "county")
            .attr("data-area-name", (d) => getCountyData(d.id)["area_name"])
            .on("mouseover", (d) => {
                //The tooltip variable stores the object from the education dataset that corresponds to the selected county.
                let tooltip = getCountyData(d.id);
                tooltipDiv.transition().duration(200).style("opacity", 1);

            })
            .on("mouseout", (d) => {
                tooltipDiv.transition().duration(200).style("opacity", 0);
            });

            svg.append("path")
            .datum(states)
            .attr("fill", "none")
            .attr("stroke", "lightgrey")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

            //Legend.

            svg.append("g").attr("id", "legend");
            const legend = d3.select("#legend");

            legend.selectAll("rect")
            .data(colorsArr)
            .enter()
            .append("rect")
            .attr("x", (d, i) => padding.left + i*legendRectWidth)
            .attr("y", legendY)
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .attr("fill", (d) => `rgb(${d})`);

            //Legend's Axis.
            legend.append("g")
            .attr("transform", `translate(0,${legendY+legendRectHeight})`)
            .attr("id", "legend-axis")
            .call(legendAxis);

            
        })
    });
    

});