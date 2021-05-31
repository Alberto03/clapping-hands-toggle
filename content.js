const URL = "https://teachablemachine.withgoogle.com/models/G_mktc4_-/";

let recognitionStarted = false;

const startRecognition = async () => {
    
    recognitionStarted = true;

    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
   
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
                lightMode();           
            } else {
                darkMode();
            }
          }
    }, 
    {
        includeSpectrogram: false, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.60
    });
}

const lightMode = () => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");

    let title = document.querySelector('h1');
    title.classList.remove('neon-title');
    title.classList.add('black-70');

    let paragraph = document.querySelector('p');
    paragraph.classList.remove('neon-title');
    paragraph.classList.add('black-70');

    document.querySelector('img').setAttribute("src", "img/light_member.jpg");
    document.querySelector('#header-background').setAttribute("style", "background-image: url(img/light_forest.jpg);");
}

const darkMode = () => {
    document.body.classList.remove("light");
    document.body.classList.add("dark");

    let title = document.querySelector('h1');
    title.classList.remove('black-70');
    title.classList.add('neon-title');

    let paragraph = document.querySelector('p');
    paragraph.classList.remove('black-70');
    paragraph.classList.add('neon-title');

    document.querySelector('img').setAttribute("src", "img/dark_member.jpg");
    document.querySelector('#header-background').setAttribute("style", "background-image: url(img/dark_forest.jpg);");
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