document.addEventListener('DOMContentLoaded', function() {
    const margin = {top: 20, right: 30, bottom: 40, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let allData, topData;

    // Function to update the chart
    function updateChart(data) {
        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
          .domain([0, d3.max(data, d => +d.Count)])
          .range([0, width]);
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

        const y = d3.scaleBand()
          .range([0, height])
          .domain(data.map(d => d.reason))
          .padding(0.1);
        svg.append("g")
          .call(d3.axisLeft(y));

        svg.selectAll(".bar")
          .data(data)
          .join("rect")
            .attr("x", 0)
            .attr("y", d => y(d.reason))
            .attr("width", d => x(+d.Count))
            .attr("height", y.bandwidth())
            .attr("class", "bar");
    }

    // Load data and initialize chart with top 10 reasons
    d3.csv("boston_311_2023_by_reason.csv").then(function(data) {
        data.sort((a, b) => d3.descending(+a.Count, +b.Count));
        allData = data;
        topData = data.slice(0, 10);
        updateChart(topData);
    });

    // Button click event
    d3.select("#toggleButton").on("click", function() {
        if (this.textContent === "Show All Categories") {
            updateChart(allData);
            this.textContent = "Show Top 10 Categories";
        } else {
            updateChart(topData);
            this.textContent = "Show All Categories";
        }
    });
});
