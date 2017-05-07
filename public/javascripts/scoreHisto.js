var data = [
        {genre: '1 star', sold: indata['1starNum'] },
        {genre: '2 stars', sold: indata['2starNum']},
        {genre: '3 stars', sold: indata['3starNum']},
        {genre: '4 stars', sold: indata['3starNum']},
        {genre: '5 stars', sold: indata['4starNum']},
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      //1 star的50替换为 <%= data.1starNum %>
      //2 stats的30替换为 <%= data.2starNum %>
      //3 stats的10替换为 <%= data.3starNum %
      //4 stats的2替换为 <%= data.4starNum %
      //5 stats的8替换为 <%= data.5starNum %
// Step 1: 创建 Chart 对象
var chart = new G2.Chart({
        id: 'c1', // 指定图表容器 ID
        width : 400, // 指定图表宽度
        height : 250 // 指定图表高度
      });
// Step 2: 载入数据源
chart.source(data, {
        genre: {
          alias: '评分分布' // 列定义，定义该属性显示的别名
        },
        sold: {
          alias: '数量/百分比'
        }
      });
// Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
chart.interval().position('genre*sold').color('genre')
chart.render();
// Step 4: 渲染图表
