export const buildDataByField = (list, fieldKey, defaultValue = null) => {
  const array = [];
  for (const item of list) {
    const d = item[fieldKey] || defaultValue;
    array.push(d);
  }
  return array;
};

export const buildDataOfPie = (list, nameField, valueField) => {
  const array = [];
  for (const item of list) {
    array.push({
      name: item[nameField] || "未知",
      value: item[valueField],
    })
  }
  return array;
};

const optimize = {
  line(options, list) {
    // 渐变展示优化
    options.visualMap = [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: 400,
      },
    ];
  },
};

const optimizeCommon = (options, chartType, list) => {
  // datazoom
  if (list.length > 5) {
    options.dataZoom = [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: [0, 1],
      },
      {
        type: "inside",
        realtime: true,
        start: 30,
        end: 70,
        xAxisIndex: [0, 1],
      },
    ];
  }
};

export const optimizeOptions = (options, chartType, list) => {
  const specialOptimize = optimize[chartType];
  if (specialOptimize) {
    specialOptimize(options, list);
  }
  optimizeCommon(options, chartType, list);
  return options;
};

const getGroupSet = (list, group, defaultValue = "未知") => {
  const set = new Set();
  for (const item of list) {
    const value = item[group] || defaultValue;
    set.add(value);
  }
  return set;
};

export const buildAxis = (chartType, props, list) => {
  const category = {
    type: "category",
    data: Array.from(getGroupSet(list, props.xAxis, "未知")),
    // data: buildDataByField(list, props.xAxis, "未知"),
  };
  // console.log("category", category);

  const options = {
    xAxis: category,
    yAxis: { type: "value", boundaryGap: [0, 0.01] },
    series: buildSeries(chartType, props, list, category.data),
  };

  return options;
};

export const buildSeries = (chartType, props, list, categoryList) => {
  const { xAxis, yAxis, group } = props;
  if (!group) {
    return [
      {
        type: chartType,
        name: props.xAxis,
        data: buildDataByField(list, yAxis),
        smooth: true,
      },
    ];
  }

  // if need group, return multi series
  const series = [];
  if (group) {
    const set = getGroupSet(list, group);
    for (const type of set) {
      // type -> 分组字段对应值
      const serieData = categoryList.map((xAxisVal) => {
        const match = list.find((item) => {
          return item[group] == type && item[xAxis] == xAxisVal;
        });
        return match ? match[yAxis] : 0;
      });
      series.push({
        type: chartType,
        name: type,
        data: serieData,
        smooth: true,
      });
    }
  }
  // console.log("分组", series);
  return series;
};

export default {
  buildDataByField,
  buildDataOfPie,
  optimizeOptions,
  buildAxis,
  buildSeries,
};
