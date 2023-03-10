let county_url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let education_url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

let drawMap = () => {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => {
                return (item['fips'] === id);
            })
            let percentage = county['bachelorsOrHigher'];
            console.log(percentage);
            if (percentage <= 10) {
                return '#99ff99';
            } else if (percentage <= 20) {
                return '#66ff66';
            } else if (percentage <= 30) {
                return '#00ff00';
            } else if (percentage <= 40) {
                return '#00e600';
            } else if (percentage <= 50) {
                return '#00cc00';
            } else {
                return '#00b300';
            }
        })
        .attr('data-fips', (countyDataItem) => {
            return countyDataItem['id'];
        })
        .attr('data-education', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => {
                return (item['fips'] === id);
            })
            let percentage = county['bachelorsOrHigher'];
            return percentage;
        })
        .on('mouseover', (object, countyDataItem) => {
            tooltip.transition()
                .style('visibility', 'visible');
            
            let id = countyDataItem['id'];
            let county = educationData.find((item) => {
                return (item['fips'] === id);
            })

            // console.log(county)

            tooltip.text(county['fips'] + ' - ' + county['area_name'] + 
                ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%');
            
            tooltip.attr('data-education', county['bachelorsOrHigher']);
        })
        .on('mouseout', (object, countyDataItem) => {
            tooltip.transition()
                .style('visibility', 'hidden');
        })
}

d3.json(county_url).then(
    (data, error) => {
        if (error) {
            console.log(error);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;
            // console.log(countyData);

            d3.json(education_url).then(
                (data, error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        educationData = data;
                        // console.log(educationData);
                        drawMap();
                    }
                }
            )
        }
    }
)