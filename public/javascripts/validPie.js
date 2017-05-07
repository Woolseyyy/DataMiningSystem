  var data = [
    {productName:2007, area:'有效评价', profit: indata.validPercent},
    {productName:2007, area:'无效评价', profit: indata.invalidPercent},
  ];
  //0.7替换为<%= data.validPercent %>
  //0.3替换为<%= data.invalidPercent %>
  
  var Stat = G2.Stat;

  var chart = new G2.Chart({
    id: 'c2',
    forceFit: true,
    height: 300,
    plotCfg: {
      margin: 50
    }
  });
  chart.source(data);

  // 以 year 为维度划分分面
  chart.facet(['productName'], {
    margin: 50,
    facetTitle: {
      colDimTitle: {
        title: null
      },
      colTitle: { 
        title: {
          fontSize: 18,
          textAlign: 'center',
          fill: '#999'
        }
      }
    }
  }); 
  chart.legend({
    position: 'bottom'
  });
  chart.coord('theta', {
    radius: 1,
    inner: 0.35
  });
  chart.tooltip({
    title: null
  });
  chart.intervalStack().position(Stat.summary.percent('profit'))
    .color('area')
    .label('..percent', {
      offset: -2
    })
    .style({
      lineWidth: 1
    });
  chart.render();