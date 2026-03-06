# Final Project Documentation/Projectbook

**Team Onion: Rachel Conca, Max McCalla, Elias Montas, Rohit Tallapragada**

## Introduction

### Motivation

We wanted to create an easy to understand visualization of a fun dataset that we all liked. We wanted to see if there were any trends of photo usage in The Onion's *American Voices* series since they often would reuse photos for comedic effect.

### The Data

The dataset was found on *Data is Plural* and was set up by Cody Winchester on a single Google Sheet that we downloaded into CSV format and used for our visualization. The sheet also contained seperate pages for photos and occupations, but we only used the photo sheet beyond the original sheet since the occupations were already matched up with the individual quotes on the original sheet.

#### Cleaning

Luckily, the data collection method employed by Cody Winchester was pretty clean and we didn't have to do much ourselves to prep the data to use. We did have to run code to extract the year from the date column, but that was minimal since the dates were formatted standardly across all the data points.

The only issue we ran into was that some of the images from `photos.csv` didn't load in initially when creating the photo bar mechanism due to issues with the links we were loading them from. To counter this, we went in and updated each link individually in the CSV file. While this was a bit tedious, it ensured that each photo was able to be loaded correctly.

## Meetings/Work Updates

### Meeting 1: 2/27/2026

-   Rachel and Max met up in class to decide on project idea/start brainstorming ideas.
-   Found various interesting datasets on *Data is Plural* before landing on the current dataset of fake quotes from The Onion on their "American Voices" series that we thought was interesting and entertaining.
-   Talked with Prof. Harrison, and came up with an idea to plot how often The Onion uses each photo over time with a bar chart timeline of how many articles are published and have an interactive aspect where users could click the individual photos used by The Onion to see more details about what articles they were used in, what quotes the photo "said", and what their name/occupation was in each article.
-   Set up a fork of the original repository on GitHub and added relevant folders for data/images and HTML and JS files for the actual coding of the visualization.

#### Initial Sketch of Visualization

![Vis Sketch](img/final%20project%20plans-1.jpg)

### Meeting 2: 3/3/2026

#### Updates since previous meeting

-   Max created JS file to link to the HTML file to start building our site.
-   Max uploaded data from the CSV file and created a bar graph visualization that graphs total amount of quotes per year.
-   Also created an interactive feature that changes the color of the bars when the user hovers over them.
-   Rachel added an animation on load for the bar chart where the bars rise from 0 to their respective heights.

#### Screenshot of updates

![Bar Graph Screenshot 1](img/bar%20chart%20screenshot%201.png)

#### During the meeting

-   Worked on adding a scrollable div at the top of our site so that users can scroll through a list of photos to select the one they want to learn more about.
-   Added a CSS file for standardized styling similar to The Onion's webpage (using their hex of green and white text).
-   Running into issues with interactivity in the photo scroll div, working to debug and fix those over the next week.

#### Screenshot of post-meeting site

![Bar Chart Screenshot 2](img/bar%20chart%20screenshot%202.png)

### Meeting 3: 3/4/2026

-   Elias worked on adding the line graph that tracks how frequently a selected image appears throughout the years. Selecting an image from the photo bar updates the line chart in real time in comparison to the bar chart.
-   Elias attempted to fix issues with the photo scroll div interactivity, works on local computer currently.

#### Screenshot of post-meeting site

![Line Graph](img/line-graph.png)

### Meeting 4: 3/6/2026

#### Updates since previous meeting

-   Rachel edited line graph to be on a standardized y-axis for ease of comparison between different photo data. Also changed some stylistic things to make the points easier to read
-   Also added smooth transitions on the line graph to transition between the data of two different photos.
-   Rohit added tooltips to display relevant information about photos, bars, and points on the line graph.
-   Max updated the photo tooltip to display statistics on which photos were commonly shown with other photos and highlighting the most commonly shown photos when tooling over a photo.
-   Max changed the order of the photos so the most used photos load in first rather than loading all the photos by ID number.

#### Screenshot of pre-meeting site

![Project Site Screenshot](img/project%20screenshot%203.png)

#### During the meeting

-   Rachel fixed photo transition on load in since it got messed up when changing the photo order.
-   Max added feature that highlights the "in common" photos when tooling over a photo.
-   Updated HTML page with more information about the project.
-   Updated styling for the HTML webpage
-   Full group practiced runthroughs of the final recording of the project.
-   Recorded runthroughs of the final recording and uploaded the best take to YouTube as an unlisted video.
-   Eilas embedded the final video link into the site for easy access.

#### Screenshot of post-meeting site

![Project Site Screenshot](img/project%20screenshot%204.png)

## Conclusions

Overall, this project went pretty well. There weren't many technical issues that arose during the project that weren't able to be solved rather quickly by group members. The biggest issue we faced was time as most of our group was sick during the A3 time period and had to request an extension on that assignment, pushing our time table for this project forward and giving us less time to fully complete everything we had wanted to do for this project.

### Future Improvements

One major feature we wanted to add but didn't have the time to complete was a feature that would incorporate the data of different articles, quotes, names, and occupations of individual photos. This would add an extra part of the visualization that would show all the specific articles a photo was featured in, along with their name, occupation, and quote that could be filtered by year after interacting with the other parts of the visualization.