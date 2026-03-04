// Declare the chart dimensions and margins.
  const width = 1200;
  const height = 300;
  const marginTop = 30;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;

  var selectedPhoto = -1;

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

  d3.csv("../data/onion_data.csv",d3.autoType).then(function(data) {

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

// Declare the x (horizontal position) scale.
  const minYear = d3.min(data, d => d.year);
  const maxYear = d3.max(data, d => d.year);

  const x = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([marginLeft, width - marginRight]);

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
      .attr("x", (d) => x(d.x0.getFullYear()) + 1)
      .attr("width", (d) => x(d.x1.getFullYear()) - x(d.x0.getFullYear()) - 1)
      .attr("y", (d) => y(0))
      .attr("height", 0)
      .on("mouseover",function(event,d){
            d3.select(this)
                .attr("fill","black");
        })
        .on("mouseout",function(event,d){
            d3.select(this)
                .attr("fill","#016b3a");
        })

  // Add the x-axis and label.
  svg.append("g")
      .attr("transform", `translate(${(x(2023)-x(2022)-1)/2},${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(30,"f").tickSizeOuter(0))

    // add animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length))
        .delay((d, i) => {console.log(i); return i*100})

    })

        //Photo Bar
      d3.csv("../data/photos.csv",d3.autoType).then(function(data) {
            photosvg.append("g")
            .selectAll('image')
            .data(data)
            .join('image')
                .attr("href", d => d.example_img_link)
                .attr("x", (d,i) => {d._x = i*110; return d._x;})
                .attr("y", 0)
                .attr("width", 100)
                .attr("height", 100)
                .on("click", (event,d,i) => {
                    selectedPhoto = d.picture_category; 
                    console.log(selectedPhoto);})
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr("x", d._x - 5)
                        .attr("height", 110)
                        .attr("width", 110);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                        .attr("opacity", 0.5)
                        .attr("x", d._x)
                        .attr("height", 100)
                        .attr("width", 100)
                })
                .attr("opacity", 0)
                    .transition()
                    .duration(800)
                    .attr("opacity", 0.5)
                    .delay((d, i) => i * 100);
            
        
      })

    //vis.append(svg.node());