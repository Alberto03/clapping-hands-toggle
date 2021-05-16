const URL = "https://teachablemachine.withgoogle.com/models/wiGG2voLq/";
const recognizer = await createModel();

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

//async function init() {
    
//    alert(11111111);

//    const recognizer = await createModel();
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
       // console.log(prediction);

        if (prediction === "Clapping") {
            if (document.body.classList.contains("tw-dark")) {
              document.body.classList.remove("tw-dark");
              localStorage.setItem("nf-theme", "light");
            } else {
              document.body.classList.add("tw-dark");
              localStorage.setItem("nf-theme", "dark");
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
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);

//}

export {};