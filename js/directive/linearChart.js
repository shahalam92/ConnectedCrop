stationModule.directive('myMaxlength', function(showAlertService) {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.myMaxlength);
      function fromUser(text) {
          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            showAlertService.showAlert("You have reached the maximum length allowed for the name");
            return transformedInput;
          }
          return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
}).directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {               
                scope.$apply(attr.whenScrolled);
            }
        });
    };
}).directive('limitLength', function(showAlertService) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var maxlength = Number(attrs.myMaxlength);
        function fromUser(text) {
            if (text.length > maxlength) {
              var transformedInput = text.substring(0, maxlength);
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();

              showAlertService.showAlert("You have reached the maximum length allowed for the name");
              return transformedInput;
            }
            return text;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  }).directive('linearChart', function (flagService,api) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attrs) {
            // Set the dimensions of the canvas / graph
         scope.$watchGroup(['dataTest','days','chartStartDate','chartEndDate','width','height'], function (newVal, oldVal) {
         var  minY,maxY,width,height,margin = { top: 15,right: 20, bottom: 30,left: 35};
       	 width=scope.width;
         height=scope.height;
        // Parse the date / time
         if(scope.dataTest!==undefined&&scope.dataTest.length>0){
        	    // minY=d3.min(scope.dataTest, function (d) {
              //     return +d.metricValue;
              // });
              // maxY=d3.max(scope.dataTest, function (d) {
              //     return +d.metricValue+3;
              // });
         if(scope.dataTest[0].metricCode==api.key.unit_classSoil){

           var filteredData= scope.dataTest;
           console.log(filteredData)
           filteredData=filteredData.filter(function(item) { return !isNaN(item.metricValue) });
           console.log(filteredData)
            minY=d3.min(filteredData, function (d) {
                return +d.metricValue;
            });
            maxY=d3.max(filteredData, function (d) {
                return +d.metricValue+3;
            });
            console.log(minY+""+maxY)
            if(minY>=scope.dataTest[0].wiltingPoint||minY==undefined){
                minY=scope.dataTest[0].wiltingPoint-3;
            }
            if(maxY<=scope.dataTest[0].fieldCapacity||maxY==undefined){
                maxY=scope.dataTest[0].fieldCapacity+3;
            }
            console.log(minY+""+maxY)
        }else{
            var filteredData= scope.dataTest;
            filteredData=filteredData.filter(function(item) { return !isNaN(item.metricValue) });
            minY=d3.min(filteredData, function (d) {
                return +d.metricValue;
            });
            maxY=d3.max(filteredData, function (d) {
                return +d.metricValue+3;
            });
            // if(minY==undefined){
            //     minY=scope.dataTest[0].wiltingPoint-3;
            // }
            // if(maxY==undefined){
            //     maxY=scope.dataTest[0].fieldCapacity+3;
            // }
	          // if(maxY>100){
	        	//     maxY=70;
	          //   }
	          // if(minY<-55){
	        	//   minY=-55;
	          // }else if(minY<0&&minY>-55){
            //  	 minY=minY;
            //   } else{
            //  	 minY=0;
            //   }
         }
       }
        // Set the ranges
        var x = d3.time.scale().range([0, width-14]);
        var y = d3.scale.linear().range([height, 0]);
        var xAxis;
        // Define the axes
        if(scope.days==1){
       		    xAxis = d3.svg.axis()
		       		    .scale(x)
		                .orient("bottom")
		                .ticks(12)
		                .tickSize(2)
		                .tickFormat(d3.time.format("%I:%M %p"));

          }
         else if(scope.days==7){
            	 xAxis = d3.svg.axis()
		               .scale(x)
		               .orient("bottom")
		               .ticks(7)
		               .tickSize(2)
		               .tickFormat(d3.time.format("%b %d"));

         }
         else if(scope.days==14){
         	  xAxis = d3.svg.axis()
         	           .scale(x)
                       .orient("bottom")
                       .ticks(14)
                       .tickSize(2)
                       .tickFormat(d3.time.format("%b %d"));

	       }
         else if(scope.days==30){
        	  xAxis = d3.svg.axis()
        	          .scale(x)
                      .orient("bottom")
                      .ticks(15)
                      .tickSize(2)
                      .tickFormat(d3.time.format("%b %d"));

	            }
	       else{
	    	     xAxis = d3.svg.axis()
    	     		 .scale(x)
                     .orient("bottom")
                     .ticks(7)
                     .tickSize(2)
                     .tickFormat(d3.time.format("%b %d"));
            }
          var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .ticks(5)
                      .tickSize(2);

        // Define the line
        var valueline = d3.svg.line()
                            .interpolate("monotone")
                            
                           /*.defined(function(d){
                                if(scope.multiSearch(scope.dataTest[0].metricCode,['soi','sm'])){
                                    return d.metricValue >100 || d.metricValue<0;
                                }
                                else if(scope.multiSearch(scope.dataTest[0].metricCode,['temp','t1','t2'])){
                                    return d.metricValue >70  || d.metricValue <-55;
                                }

                            })*/
                           // .interpolate('monotone')
                        .x(function (d) {return x(new Date(d.detectionTime))})
                        .y(function (d) {return y(+d.metricValue);})
                        .defined(function(d) {return !isNaN(d.metricValue)});


        d3.select("svg").select("g").remove();
        // Adds the svg canvas
        var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        // Scale the range of the data
        x.domain([scope.chartStartDate,scope.chartEndDate]);
        y.domain([minY,maxY]).nice();

        if(scope.dataTest!==undefined&&scope.dataTest.length>0){
        	if(scope.dataTest[0].metricCode==api.key.unit_classSoil){

                svg.append("line")
                .attr("x1", 0)
                .attr("y1", +y(scope.dataTest[0].fieldCapacity))
                .attr("x2", width-5)
                .attr("y2", +y(scope.dataTest[0].fieldCapacity))
                .style("stroke-dasharray", ("10, 5"))
                .attr("stroke-width", 2)
                .attr("stroke", "#82b635");
                svg.append("line")
                .attr("x1", 0)
                .attr("y1", +y(scope.dataTest[0].wiltingPoint))
                .attr("x2", width-5)
                .attr("y2", +y(scope.dataTest[0].wiltingPoint))
                .style("stroke-dasharray", ("10, 5"))
                .attr("stroke-width", 2)
                .attr("stroke", "#82b635");

        	}
		        svg.append("path").attr('stroke',function (d) {  return "gray"; })
		       .attr('stroke-width', 2)
		       .attr('fill', 'none')
			   .attr("d", valueline(scope.dataTest));
        }

               // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
		            /*.style("text-anchor", "end")*/
		            .style("font-size","8px")
		            .style("font-family","Halvetica_light_neue")
		            .attr("dx", "-1.8em")
		            .attr("dy", "1.2em")
		            .attr("transform", function(d) {
	                return "rotate(-35)"
	                });

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .selectAll("text")
                    .style("font-size","8px")
                    .style("font-family","Halvetica_light_neue");
            }, true);

        }
    };
});
