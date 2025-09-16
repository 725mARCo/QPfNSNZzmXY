// 代码生成时间: 2025-09-16 16:17:10
// interactive_chart_generator.js

// 导入 Meteor 框架相关包
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

// 创建一个简单的图表数据模型
const ChartData = new Mongo.Collection('chartData');

// 定义图表配置 ReactiveVar
const chartConfig = new ReactiveVar({
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {}\});

// 定义图表更新方法
function updateChart() {
  const config = chartConfig.get();
  // 使用图表库更新图表，这里示例使用 Chart.js
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, config);
}

// 定义从服务器获取数据的 HTTP 方法
function fetchData() {
  try {
    // 假设有一个 API 端点返回图表数据
    const response = HTTP.call('GET', 'http://example.com/api/chartData');
    if (response.statusCode === 200) {
      const data = JSON.parse(response.content);
      // 更新图表数据 ReactiveVar
      chartConfig.set({
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets
        },
        options: {}
      });
      updateChart();
    } else {
      throw new Error('Failed to fetch chart data');
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
}

// 定义 Meteor 方法，允许客户端调用 fetchData 函数
Meteor.methods({
  'fetchChartData': fetchData
});

// 定义客户端模板 helpers
Template.main.helpers({
  // 提供图表配置 ReactiveVar 给模板
  chartConfig() {
    return chartConfig;
  }
});

// 定义客户端模板 events
Template.main.events({
  // 点击按钮时触发图表数据的获取
  'click #fetchDataButton': function(event, templateInstance) {
    Meteor.call('fetchChartData');
  },
  // 监听图表配置的变化并更新图表
  'change .chart-config': function(event, templateInstance) {
    // 更新图表配置 ReactiveVar
    const newConfig = templateInstance.$(event.currentTarget).serializeArray();
    chartConfig.set({
      type: newConfig.find(item => item.name === 'type').value,
      data: {
        labels: newConfig.find(item => item.name === 'labels').value.split(','),
        datasets: JSON.parse(newConfig.find(item => item.name === 'datasets').value)
      },
      options: {}
    });
    updateChart();
  }
});

// 定义 Meteor 订阅，如果有必要
Meteor.subscribe('chartData');