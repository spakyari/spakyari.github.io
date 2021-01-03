    // specify the columns
    API = 'https://immigration2021.herokuapp.com/'
    url = `${API}api/v1.0/top_colonies/50`

    d3.json(url).then(function(response) {

        var headers = response.headers
        var data = response.data

        myheaders = headers.map(column=>
          {
            console.log(column)
            column["sortable"]= true
            column["filter"]=true
            return column
          })

          console.log(myheaders)
  
          // let the grid know which columns and what data to use
          var gridOptions = {
            columnDefs: myheaders,
            rowData: data
          };




      
        // lookup the container we want the Grid to use
        var eGridDiv = document.querySelector('#myGrid');
      
        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid(eGridDiv, gridOptions);


    })
