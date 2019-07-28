let charts = [];

function resetCharts() {
    charts.forEach(element => {
        element.destroy();
    });
    charts = [];
    console.log(charts);
}

function createMostMessagesChartFromData(messages) {
    const users = [...new Set(messages.map(item => item.author))];

    let userIndex = users.indexOf('System');
    if (userIndex > -1) {
        users.splice(userIndex, 1);
    }

    let messagesCountByUser = Array.from(users, element =>
        messages.filter(value => value.author === element).length
    );

    createMostMessagesChart(users, messagesCountByUser, messages.length);
    return {
        users: users,
        messagesCountByUser: messagesCountByUser,
        messagesCount: messages.length
    };
}

function createMostMessagesChart(userNames, messagesCountByUser, messagesCount) {
    let ctx = $('#messages-count-chart')[0].getContext('2d');

    let mostMessagesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: userNames,
            datasets: [{
                label: 'Number of Messages',
                data: messagesCountByUser,
                backgroundColor: defaultBackgroundColors,
                borderColor: defaultBorderColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: `${numberWithSeparators(messagesCount)} Total Messages`
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    charts.push(mostMessagesChart);
}

function createMostUsedWordsChartFromData(messages) {
    let words = [];
    let wordOccurrences = {};

    messages.forEach(element => {
        if (element.author != 'System') {
            element.message.replace(/[^\w\säöü!?]/gi, '')
                .split(/\s+/).forEach(item => {
                    if (item.length > 1 && item.match(/^(?!Media|omitted).*$/)) {
                        words.push(item);
                    }
                });
        }
    });

    for (var i = 0; i < words.length; i++) {
        wordOccurrences['_' + words[i]] = (wordOccurrences['_' + words[i]] || 0) + 1;
    }

    let amount = 20;

    var result = Object.keys(wordOccurrences).reduce(function (acc, currentKey) {
        for (var i = 0; i < amount; i++) {
            if (!acc[i]) {
                acc[i] = {
                    word: currentKey.slice(1, currentKey.length),
                    occurences: wordOccurrences[currentKey]
                };
                break;
            } else if (acc[i].occurences < wordOccurrences[currentKey]) {
                acc.splice(i, 0, {
                    word: currentKey.slice(1, currentKey.length),
                    occurences: wordOccurrences[currentKey]
                });
                if (acc.length > amount)
                    acc.pop();
                break;
            }
        }
        return acc;
    }, []);

    let differentWords = [...new Set(result.map(item => item.word))];
    let wordsCount = [...new Set(result.map(item => item.occurences))];

    createMostUsedWordsChart(differentWords, wordsCount);
    return {
        differentWords: differentWords,
        wordsCount: wordsCount
    };
}

function createMostUsedWordsChart(differentWords, wordsCount) {
    let ctx = $('#most-used-words-chart')[0].getContext('2d');

    let mostUsedWordsChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: differentWords,
            datasets: [{
                label: 'Word count',
                data: wordsCount,
                backgroundColor: defaultBackgroundColors,
                borderColor: defaultBorderColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: `Most used words`
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    charts.push(mostUsedWordsChart);
}

const defaultBackgroundColors = [
    '#d32f2f',
    '#C2185B',
    '#7B1FA2',
    '#512DA8',
    '#303F9F',
    '#1976D2',
    '#0288D1',
    '#0097A7',
    '#00796B',
    '#388E3C',
    '#689F38',
    '#AFB42B',
    '#FBC02D',
    '#FFA000',
    '#F57C00',
    '#E64A19',
    '#5D4037',
    '#616161',
    '#455A64'
];

const defaultBorderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];