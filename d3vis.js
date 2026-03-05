// Declare the chart dimensions and margins.
  const width = 1200;
  const height = 300;
  const marginTop = 30;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;

  var selectedPhoto = -1;

  // Shared tooltip
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip");

    document.getElementById("picturescroll").style.width = width+"px";
    document.getElementById("picturescroll").style.height = "120px";
    document.getElementById("picturescroll").style.overflowX = "scroll";

  // select container
  const vis = d3.select("#vis")

    const svg = vis.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0, 0, ${width}, ${height}`)
      .attr("style", "max-width: 100%; height: auto; display:block;");

    const photo = d3.select("#picturescroll");
    const photosvg = photo.append("svg")
        .attr("width",5700)
        .attr("height",100)

  d3.csv("data/onion_data.csv",d3.autoType).then(function(data) {

  // append svg to container
    data.forEach( function (d){
        d.year = d.date.getFullYear();
    });

    // use year based binning
    const yearGroups = d3.rollup(data, v => v.length, d => d.year);
    const bins = Array.from(yearGroups, ([year, count]) => ({
        x0: new Date(year, 0, 1),
        x1: new Date(year + 1, 0, 1),
        length: count
    })).sort((a, b) => a.x0 - b.x0)

// Declare the x (horizontal position) scale (year based scaling)
  const minYear = d3.min(data, d => d.year);
  const maxYear = d3.max(data, d => d.year + 1);

  const x = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([marginLeft, width - marginRight]);
    
const barWidth = x(minYear + 1) - x(minYear) - 1;

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .range([height - marginBottom, marginTop]);

  // Add a rect for each bin.
  svg.append("g")
    .attr("fill", "#016b3a")
    .selectAll()
    .data(bins)
    .join("rect")
        .attr("x", (d) => x(d.x0.getFullYear()) - barWidth / 2)
        .attr("width", barWidth)
      .attr("y", (d) => y(0))
      .attr("height", 0)
      .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "black");
            tooltip.style("opacity", 1)
                .html(`<strong>${d.x0.getFullYear()}</strong><br>Total Quotes: ${d.length}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 14) + "px")
                   .style("top",  (event.pageY - 36) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "#016b3a");
            tooltip.style("opacity", 0);
        })

  // Add the x-axis and label.
    const tickYears = d3.range(minYear, maxYear + 1);

    svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`) 
    .call(
        d3.axisBottom(x)
        .tickValues(tickYears)
        .tickFormat(d3.format("d"))     
        .tickSizeOuter(0)
    );

    // add animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length))
        .delay((d, i) => {console.log(i); return i*100})


    const yLine = d3.scaleLinear()
        .domain([0, 1]) // will be updated per photo in update()
        .range([height - marginBottom, marginTop]);

    // right y-axis group (for line scale)
    const yLineAxisG = svg.append("g")
        .attr("transform", `translate(${width - marginRight},0)`);

    // line group container
    const lineGroup = svg.append("g").attr("class", "photoLine");

    // years array so line includes 0s 
    const years = d3.range(minYear, maxYear + 1);

    // calculate global max across photos
    const globalMaxCount = d3.max(
        Array.from(d3.group(data, d => d.picture_category).values()),
        group => d3.max(d3.rollup(group, v => v.length, d => d.year).values())
    ) || 1;

    function update(photoID) {
        console.log("update called with photoID:", photoID);
        // clear line if nothing selected
        if (photoID == null || photoID === -1) {
            lineGroup.selectAll("*").remove();
            return;
        }

        // filter onion data for selected photo
        const filtered = data.filter(d => d.picture_category === photoID);
        console.log("filtered data length:", filtered.length);

        // counts per year for that photo
        const counts = d3.rollup(filtered, v => v.length, d => d.year);

        const series = years.map(yr => ({ // builds series over all year
            year: yr,
            count: counts.get(yr) || 0
        }));
        console.log("series:", series);

    const maxC = d3.max(series, d => d.count) || 1;
    yLine.domain([0, globalMaxCount]);

    // draw/update right axis
    yLineAxisG.call(
        d3.axisRight(yLine)
        .ticks(Math.min(5))
        .tickSizeOuter(0)
    );

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => yLine(d.count));

    // draw/update line
    const pathUpdate = lineGroup.selectAll("path")
        .data([series])
    
    pathUpdate.enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", d => line(d.map(p => ({year: p.year, count: 0}))))
        .merge(pathUpdate)
        .transition()
        .duration(500)
        .attrTween("d", function (d) {
            const previousSeries = this.__previousSeries || d.map(p => ({year: p.year, count: 0}));
            this.__previousSeries = d;
            return function(t) {
                const interpSeries = d.map((p, i) => ({
                    year: p.year,
                    count: previousSeries[i].count + (p.count - previousSeries[i].count) * t
                }));
                return line(interpSeries);
            }
        });
    console.log("path count after update:", lineGroup.selectAll("path").size());

    // dots for readability
    const circleUpdate = lineGroup.selectAll("circle")
        .data(series.filter(d => d.count > 0), d => d.year);
    
    const circleMerged = circleUpdate.enter().append("circle")
        .attr("r", 3)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("fill", "white")
        .attr("cx", d => x(d.year))
        .attr("cy", d => yLine(0))
        .merge(circleUpdate);

    circleMerged
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`<strong>${d.year}</strong><br>Appearances: ${d.count}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 14) + "px")
                   .style("top",  (event.pageY - 36) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    circleMerged
        .transition()
        .duration(500)
        .attr("cx", d => x(d.year))
        .attr("cy", d => yLine(d.count));

    // remove 0 entry circles
    circleUpdate.exit()
        .transition()
        .duration(500)
        .attr("cy", d => yLine(0))
        .remove();
    console.log("circle count after update", lineGroup.selectAll("circle").size());
    
    // prevent lines from rendering behind the bars
    lineGroup.raise();

    // debugging info
    console.log("photo", photoID, "total uses", filtered.length, "max/year", maxC);
    console.log("Total rows:", data.length);
    console.log("Sum of bars:", d3.sum(bins, d => d.length));
  }

  window.updateSelectedPhotoLine = update; // makes update callable from photo csv click 

        // precompute total uses per photo from onion data
        const photoUseCounts = d3.rollup(data, v => v.length, d => d.picture_category);

        //Photo Bar
      d3.csv("../data/photos.csv",d3.autoType).then(function(photoData) {
            photosvg.append("g")
            .selectAll('image')
            .data(photoData)
            .join('image')
                .attr("href", d => d.example_img_link)
                .attr("x", (d,i) => {d._x = i*110; return d._x;})
                .attr("y", 0)
                .attr("width", 100)
                .attr("height", 100)
                .on("click", (event,d,i) => {
                    selectedPhoto = d.picture_category; 
                    console.log(selectedPhoto);

                    window.updateSelectedPhotoLine(selectedPhoto);
                }) 
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr("x", d._x - 5)
                        .attr("height", 110)
                        .attr("width", 110);
                    const uses = photoUseCounts.get(d.picture_category) || 0;
                    tooltip.style("opacity", 1)
                        .html(`<strong>Photo #${d.picture_category}</strong><br>Total uses: ${uses}`);
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 14) + "px")
                           .style("top",  (event.pageY - 36) + "px");
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .attr("opacity", 0.5)
                        .attr("x", d._x)
                        .attr("height", 100)
                        .attr("width", 100);
                    tooltip.style("opacity", 0);
                })
                .attr("opacity", 0)
                    .transition()
                    .duration(800)
                    .attr("opacity", 0.5)
                    .delay((d, i) => i * 100);
      })
    });
    //vis.append(svg.node());