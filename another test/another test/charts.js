(async () => {


    const data = [
        // [date DD-MM-YYYY --> Unix time stamp, lines created n(integer), lines deleted n(integer), code readability 0-10, something else 0-10]
        ['x', 'created', 'deleted', 'readability', 'idk'],
        [1672531200000, 120, 30, 8, 7],
    [1672617600000, 90, 20, 7, 6],
    [1672704000000, 150, 40, 9, 8],
    [1672790400000, 200, 50, 6, 7],
    [1672876800000, 110, 10, 8, 9],
    [1672963200000, 70, 5, 7, 6],
    [1673049600000, 130, 25, 9, 8],
    [1673136000000, 95, 15, 6, 7],
    [1673222400000, 160, 35, 8, 9],
    [1673308800000, 180, 45, 7, 8]
    ];
    Highcharts.setOptions({
        chart: {
            spacingTop: 20,
            spacingBottom: 20,
            height: 300,
            type: 'area',
            zooming: {
                type: 'xy'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            stickOnContact: true
        },
        yAxis: {
            title: {
                text: 'Lines'
            },
            accessibility: {
                description: 'value in percents'
            }
        },
        xAxis: {
            title: {
                text: 'Date'
            },
            type: 'datetime',
            accessibility: {
                description: 'Years',
                rangeDescription: 'Data ranges from 2000-01-01 to 2021-01-01.'
            }
        }
    });
    
    Dashboards.board('dashboard-container', {
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true
            }
        },
        dataPool: {
            connectors: [{
                id: 'connector-1',
                type: 'JSON',
                options: {
                    data
                }
            }, {
                id: 'connector-2',
                type: 'JSON',
                options: {
                    data
                }
            },
            {
                id: 'connector-3',
                type: 'JSON',
                options: {
                    data
                }
            }, {
                id: 'connector-4',
                type: 'JSON',
                options: {
                    data
                }
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'title'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-col-1'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-col-2'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-col-3'
                    }, {
                        id: 'dashboard-col-4'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'title',
            type: 'HTML',
            elements: [{
                tagName: 'h1',
                textContent: 'Git data'
            }]
        }, 
        
        
        {
            renderTo: 'dashboard-col-1',
            type: 'Highcharts',
            connector: {
                id: 'connector-1',
                columnAssignment: [{
                    seriesId: 'Created',
                    data: ['x', 'created']
                },
                {
                    seriesId: 'Deleted',
                    data: ['x', 'deleted']
                }]
            },
            sync: {
                extremes: true,
                highlight: true
            },
            chartOptions: {
                chart: {
                    zooming: {
                        type: 'x'
                    }
                },
                title: {
                    text: 'Lines'
                },
                legend: {
                    enabled: true
                },
                credits: {
                    enabled: false
                }
            }
        }, 
        
        
        
        
        
        {
            renderTo: 'dashboard-col-2',
            type: 'Highcharts',
            connector: {
                id: 'connector-1',
                columnAssignment: [{
                    seriesId: 'South-East Asia',
                    data: ['x', 'South-East Asia']
                }]
            },
            sync: {
                extremes: true,
                highlight: true
            },
            chartOptions: {
                chart: {
                    zooming: {
                        type: 'x'
                    }
                },
                title: {
                    text: 'yuh'
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: 
                {
                    series: {
                        colorIndex: 1
                    }
                }
            }
        },




        {
            renderTo: 'dashboard-col-0',
            type: 'Highcharts',
            connector: {
                id: 'synchro-data'
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                
            }
        }]
    }, true);
})();
    
