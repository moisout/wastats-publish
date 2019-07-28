$('#file').on('change', () => {
    const reader = new FileReader();
    reader.onload = e => {
        whatsappChatParser.parseString(e.target.result)
            .then(messages => {
                console.log(messages);
                analyzeMessages(messages);
            })
            .catch(error => {
                console.error(error);
            });
    }
    reader.onerror = error => {
        console.log(error);
    }
    reader.readAsText($('#file')[0].files[0]);
});

function analyzeMessages(messages) {
messages.forEach(message => {
$('.messages-show').append(`<p>${message.author} - ${message.message}<p/>`);
});
    resetCharts();

    let mostMessages = createMostMessagesChartFromData(messages);
    let mostUsedWords = createMostUsedWordsChartFromData(messages);

    let dataString = $.param({
        mostMessages,
        mostUsedWords
    });
    // let compressedDataString = LZString.compressToEncodedURIComponent(dataString);

    window.history.pushState('index', 'WA-Stats', `index.html?data=${dataString}`);
    $('.stats-canvas-container').addClass('visible');

    $.ajax({
        type: "GET",
        url: `https://url.mcdn.ch/?url=https://wa-stats.mcdn.ch/index.html?data=${dataString}`,
        dataType: "text",
        success: function (response) {
            console.log(response);
        }
    });
}

function analyzeFromUrl(data) {
    resetCharts();
    let decodedData = LZString.decompressFromEncodedURIComponent(data);
    let dataObject = $.deparam(decodedData);

    let mostMessages = dataObject.mostMessages;
    let mostUsedWords = dataObject.mostUsedWords;

    createMostMessagesChart(mostMessages.users, mostMessages.messagesCountByUser, mostMessages.messagesCount);
    createMostUsedWordsChart(mostUsedWords.differentWords, mostUsedWords.wordsCount);

    $('.stats-canvas-container').addClass('visible');
}

function numberWithSeparators(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

let url = window.location.search;
let urlParams = new URLSearchParams(url);
if (urlParams.has('data')) {
    let data = urlParams.getAll('data');
    analyzeFromUrl(data);
}