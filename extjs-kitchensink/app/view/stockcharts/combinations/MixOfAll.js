/**
 * Class to test MACD and William %R chart
 */
Ext.define("KS.view.stockcharts.combinations.MixOfAll", {
    extend: 'Ext.Panel',
    xtype: 'basic-combo-all',
    requires: [
        'Chartsly.view.test.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.chart.interactions.ItemHighlight',
        'Chartsly.chart.indicator.WilliamPctR',
        'Chartsly.chart.indicator.MovingAverageConvergenceDivergence',
        'Chartsly.model.Stock', 
        'Chartsly.store.Apple'
    ],
    exampleDescription: [
        'A combination to a CandleStick chart with PSAR and Bollinger Bands, which has got Annotation and Events, and two indicators - MACD and William %R'
    ],
    config: {
        items: [
            {
                xtype: 'chart',
                height: 300,
                background: 'white',
                insetPadding: {
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                interactions: {
                    type: 'annotation'
                },
                series: [{
                        store: Ext.create('Chartsly.store.GoogleDividend', {}), 
                        type: 'event',
                        eventType: 'dividend',
                        xField: 'date',
                        yField: 'dividend'
                    }, {
                        store: Ext.create('Chartsly.store.GoogleBonus', {}), 
                        type: 'event',
                        eventType: 'bonus',
                        xField: 'date',
                        yField: 'bonus'
                    }, {
                        store: Ext.create('Chartsly.store.AppleDividend', {}), 
                        type: 'event',
                        eventType: 'split',
                        xField: 'date',
                        yField: 'dividend'
                    },{
                        store: Ext.create('Chartsly.store.Google', {}), //'Google',
                        type: 'parabolicsar',
                        highField: 'high',
                        lowField: 'low',
                        style: {
                            stroke: 'none'
                        },
                        xField: 'date',
                        yField: 'sar',
                        marker: {
                            type: 'path',
                            path: ['M', -0.5, 0, 0, 0.5, 0.5, 0, 0, -0.5, 'Z'],
                            stroke: 'red',
                            lineWidth: 0
                        }
                    },{
                        store: Ext.create('Chartsly.store.Google', {}), //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(187, 175, 174)',
                            lineDash: [5, 5]
                        },
                        xField: 'date',
                        yField: 'bband'
                    }, {
                        store: Ext.create('Chartsly.store.Google', {}), //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(67, 175, 174)'
                        },
                        xField: 'date',
                        yField: 'upperbband'
                    }, {
                        store: Ext.create('Chartsly.store.Google', {}), //'Google',
                        type: 'bbands',
                        closeField: 'close',
                        period: 15,
                        bandGap: 5,
                        style: {
                            stroke: 'rgb(67, 175, 174)'
                        },
                        xField: 'date',
                        yField: 'lowerbband'
                    },
                    {
                        store: Ext.create('Chartsly.store.Google', {}),//'Google',
                        type: 'candlestick',
                        xField: 'date',
                        openField: 'open',
                        highField: 'high',
                        lowField: 'low',
                        closeField: 'close',
                        style: {
                            barWidth: 10,
                            opacity: 0.9,
                            dropStyle: {
                                fill: 'rgb(228,124,124)',
                                stroke: 'rgb(228,124,124)'
                            },
                            raiseStyle: {
                                fill: 'rgb(67,175,174)',
                                stroke: 'rgb(67,175,174)'
                            }
                        },
                        aggregator: {
                            stretagy: 'time'
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        fields: ['open', 'high', 'low', 'close', 'bband', 'upperbband', 'lowerbband'],
                        position: 'left',
                        style: {
                            floating: true,
                            strokeStyle: '#666',
                            estStepSize: 40
                        },
                        label: {
                            fillStyle: '#666',
                            fontWeight: '700'
                        },
                        background: {
                            fill: {
                                type: 'linear',
                                degrees: 180,
                                stops: [
                                    {
                                        offset: 0.3,
                                        color: 'white'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,255,255,0)'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: 'time',
                        fields: ['date'],
                        position: 'bottom',
                        background: {
                            fill: 'gray'
                        },
                        visibleRange: [0.5, 0.9],
                        style: {
                            strokeStyle: '#888',
                            estStepSize: 50,
                            textPadding: 10
                        },
                        label: {
                            fontWeight: '700',
                            fillStyle: '#666'
                        },
                        renderer: function (value, layoutContext, lastValue) {
                            var month, day;
                            switch (layoutContext.majorTicks.unit) {
                                case Ext.Date.YEAR:
                                    return Ext.Date.format(value, 'Y');
                                case Ext.Date.MONTH:
                                    month = Ext.Date.format(value, 'M');
                                    if (month === 'Jan') {
                                        return Ext.Date.format(value, 'Y');
                                    } else {
                                        return month;
                                    }
                                    break;
                                case Ext.Date.DAY:
                                    day = Ext.Date.format(value, 'j');
                                    if (lastValue && value.getMonth() !== lastValue.getMonth()) {
                                        month = Ext.Date.format(value, 'M');
                                        if (month === 'Jan') {
                                            return Ext.Date.format(value, 'M j y');
                                        } else {
                                            return Ext.Date.format(value, 'M j');
                                        }
                                    } else {
                                        return day;
                                    }
                                    break;
                                default:
                                    return Ext.Date.format(value, 'h:i:s');
                            }
                        }
                    }
                ]
            },
            {
                xclass: 'Chartsly.chart.MACD',
                height: 250,
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'macd',
                        xField: 'date',
                        yField: 'macd',
                        closeField: "close",
                        period1: 12,
                        period2: 26,
                        signalPeriod: 9,
                        smooth: true,
                        style: {
                            stroke: 'rgba(67,174,175,0.75)',
                            miterLimit: 1
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left'
                    },
                    {
                        type: 'category',   //FIXME: Bar series does not render for 'time' type. SDK seems to have an issue
                        position: 'bottom',
                        fields: ['date'],
                        style: {
                            strokeStyle: '#666',
                            estStepSize: 150
                        },
                        dateFormat: 'Y',
                        segmenter: {
                            type: 'time',
                            step: {
                                unit: 'y',
                                step: 1
                            }
                        },
                        label: {
                            fontSize: 10,
                            fillStyle: '#666'
                        }
                    }
                ]
            },
            {
                xclass: 'Chartsly.chart.indicator.WilliamPctR',
                height: 250,
                innerPadding : {top: 0, left: 0, right: 10, bottom: 0},
                insetPadding: {
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                background: 'white',
                series: [
                    {
                        store: Ext.create('Chartsly.store.Apple', {}), //'Apple',
                        type: 'williampctr',
                        xField: 'date',
                        yField: 'pctr',
                        highField: "high",
                        lowField: "low",
                        closeField: "close",
                        overboughtLevel: -20,
                        oversoldLevel: -80,
                        lookBackPeriod: 14,  //in days
                        style: {
                            stroke: 'rgba(237,123,43,0.75)',
                            fill: 'rgba(237,123,43,0.1)',
                            miterLimit: 1
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left'
                    },
                    {
                        type: 'time',
                        position: 'bottom',
                        fields: ['date'],
                        style: {
                            strokeStyle: '#666',
                            estStepSize: 150
                        },
                        dateFormat: 'Y',
                        segmenter: {
                            type: 'time',
                            step: {
                                unit: 'y',
                                step: 1
                            }
                        },
                        label: {
                            fontSize: 10,
                            fillStyle: '#666'
                        }
                    }
                ]
            }
        ]
    }
});
