//import * as tf from "@tensorflow/tfjs";
//import * as speechCommands from "@tensorflow-models/speech-commands";

const URL = "https://teachablemachine.withgoogle.com/models/G_mktc4_-/"; //"https://teachablemachine.withgoogle.com/models/wiGG2voLq/";

let recognitionStarted = false;

const startRecognition = async () => {
    
    recognitionStarted = true;

    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    /*
    const labelContainer = document.getElementById("label-container");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }*/

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen( 
        result => {
        const scores = result.scores; // probability of prediction for each class
       
        const predictionIndex = scores.indexOf(Math.max(...scores)); // get the max value in the array because it represents the highest probability
        const prediction = classLabels[predictionIndex];
       
       // alert(prediction);
       console.log(prediction, predictionIndex);

        if (prediction === "Clapping") {
            if (document.body.classList.contains("dark")) {

                darkMode();
               
                //localStorage.setItem("nf-theme", "light");
            } else {

                lightMode();

              //localStorage.setItem("nf-theme", "dark");
            }
          }

        // render the probability scores per class
       /* for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }*/
    }, 
    {
        includeSpectrogram: false, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.60 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);

}

const darkMode = () => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");

    let title = document.querySelector('h1');
    title.classList.remove('neon-title');
    title.classList.add('light-title');

    let img = document.querySelector('img');
    img.setAttribute("src", "img/dark.jpg");
}

const lightMode = () => {
    document.body.classList.remove("light");
    document.body.classList.add("dark");

    let title = document.querySelector('h1');
    title.classList.remove('light-title');
    title.classList.add('neon-title');

    let img = document.querySelector('img');
    img.setAttribute("src", "img/light.jpg");
}

async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL
    );

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

if (!recognitionStarted) {
    startRecognition();
  }