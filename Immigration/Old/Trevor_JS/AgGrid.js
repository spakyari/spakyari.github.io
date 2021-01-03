var columnDefs = [
  {headerName: "Make", field: "make", sortable: true, filter: true, rowGroup: true},
  {headerName: "Model", field: "model", sortable: true, filter: true, rowGroup: true },
  {headerName: "Price", field: "price", sortable: true, filter: true, rowGroup: true }
];

var autoGroupColumnDef = {
  headerName: 'Model',
  field: 'model',
  cellRenderer: 'ageGroupCellRenderer',
  cellRendererParams: {
    checkbox: true
  }
}

var gridOptions = {
  columnDefs: columnDefs,
  autoGroupColumnDef: autoGroupColumnDef,
  rowSelection: 'multiple',
  
};

var eGridDiv = document.querySelector('#myGrid')

new agGrid.Grid(eGridDiv, gridOptions);

agGrid.simpleHttpRequest({
  url: 'http://127.0.0.1:5000/api/v1.0/top_colonies/all'
}).then(function(data){
  gridOptions.api.setRowData(data)
})

function getSelectedRows() {
  var selectedNodes = gridOptions.api.getSelectedNodes()
  var selectedData = selectedNodes.map( function(node) { return node.data })
  var selectedDataStringPresentation = selectedData.map( function(node) { return node.make + ' ' + node.model }).join(', ')
  alert('Selected nodes: ' + selectedDataStringPresentation);
}
