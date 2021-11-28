
console.log ('topicv: ' + topicv);
console.log ('mqttBroker: ' + mqttBroker);

var chartColors = {
    black: 'rgb(0, 0, 0)',
    brown:  'rgb(160,82,45)',
    red: 'rgb(255, 0, 0)',
    orange: 'rgb(255,140,0)',
    yellow: 'rgb(245,199,26)',
    green: 'rgb(0,100,0)',
    blue: 'rgb(0, 0, 255)',
    purple: 'rgb(128,0,128)',
};

$(document).ready(function() {
    // Generate a random client ID
    clientID = "clientID-" + parseInt(Math.random() * 100);

    host = mqttBroker;
    port = "9001";

    console.log(host + ":" +  port)
    // Print output for the user in the messages div
//    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
//    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';
    console.log('Connecting to: ' + host + ' on port: ' + port);
    console.log('Using the following client value: ' + clientID);

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
    });
});

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    topic = topicv + "/#";

    // Print output for the user in the messages div
      console.log('Subscribing to: ' + topic);

    // Subscribe to the requested topic
    client.subscribe(topic, { onSuccess: onSuccessSubscribed });
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log('Connection lost');
    if (responseObject.errorCode !== 0) {
        console.log('ERROR: ' + responseObject.errorMessage);
    }
}

// Called when a message arrives
function onMessageArrived(message) {
   // console.log("onMessageArrived: " + message.payloadString);
   console.log("onMessageArrived: " + message.destinationName + " " + message.payloadString);
    update(message.destinationName, message.payloadString);

}

function onSuccessSubscribed(){
  console.log("subscribed!");
}

function onRefresh(chart) {
}

function update(topic, payload) {
    const channel = topic.split('/')[1];
    console.log("channel: " + channel);
    window.mqttChart.config.data.datasets[channel].data.push({
            x: Date.now(),
            y: payload
    });
}


var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'ch 0',
            backgroundColor: color(chartColors.black).alpha(0.5).rgbString(),
            borderColor: chartColors.black,
            fill: false,
            pointRadius: 0,
            data: []
        }, {
            label: 'ch 1',
            backgroundColor: color(chartColors.brown).alpha(0.5).rgbString(),
            borderColor: chartColors.brown,
            fill: false,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
            data: []
        }, {
            label: 'ch 2',
            backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
            borderColor: chartColors.red,
            fill: false,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
            data: []
        },
        {
            label: 'ch 3 ',
            backgroundColor: color(chartColors.orange).alpha(0.5).rgbString(),
            borderColor: chartColors.orange,
            fill: false,
            pointRadius: 0,
            data: []
        },
        {
            label: 'ch 4',
            backgroundColor: color(chartColors.yellow).alpha(0.5).rgbString(),
            borderColor: chartColors.yellow,
            fill: false,
            pointRadius: 0,
            data: []
        },
        {
            label: 'ch 5',
            backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
            borderColor: chartColors.green,
            fill: false,
            pointRadius: 0,
            data: []
        },
        {
            label: 'ch 6',
            backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: chartColors.blue,
            pointRadius: 0,
            fill: false,
            data: []
        },
        {
            label: 'ch 7',
            backgroundColor: color(chartColors.purple).alpha(0.5).rgbString(),
            borderColor: chartColors.purple,
            fill: false,
            pointRadius: 0,
            data: []
        }]
    },
    options: {
        title: {
            display: true,
            text: 'mqtt data'
        },
        pointstyle: 'line',
        scales: {
            xAxes: [{
                type: 'realtime'
            }],
            yAxes: [{
      ticks: {
         min: 0,
         suggestedMax: 1
      },
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }
            }]
        },
        tooltips: {
            mode: 'nearest',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false
        },
        plugins: {
            streaming: {
                duration: 20000,
                refresh: 1000,
                delay: 0,
                onRefresh: onRefresh
            }
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('mqttChart').getContext('2d');
    window.mqttChart = new Chart(ctx, config);
};


