//Use word and phrase hints to add names and terms to the vocabulary 
// and to boost the accuracy for specific words and phrases.


async function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;
  const fs = require('fs');

  const keyFilename = './yourKeyFile.json'


// Creates a client
const client = new speech.SpeechClient({
keyFilename:keyFilename
});

const personName = process.argv[2];
const subFolder = 'subFolder/';
const jsonFileName = subFolder +  personName + '.json';
const txtFileName = subFolder + personName + '.txt';

const gcsUri = 'gs://yourBucket/' + personName + '.flac';


const audio = {
uri: gcsUri,
};
  

const phrases = [
    "devops",
    "NFR", "NFRs", "non functional requirements",
    "agile", "waterfall",
    "kubernetes", "kubernetes environment",
    "production environment", "staging environment", "sandboxing",
    "cluster", "spin up", "CI/CD pipeline", "CI",
    "jenkins", "docker", "docker file", "terraform", "terraform code",
    "security", "performance", "latency", "scalability",
    "turnkey", "build", "builds", 
    "AWS", "Azure",
    "infrastructure", "define", "defined", "VM", "bottleneck",
]

const config = {
enableAutomaticPunctuation: true,
languageCode: 'en-US',
model: 'video',
audioChannelCount: 1, // 1 for mono, 2 for stero
enableWordConfidence: true,
interactionType: 'DISCUSSION',
recordingDeviceType: 'SMARTPHONE',
microphoneDistance: 'NEARFIELD',
enableWordTimeOffsets: true,
speechContexts: [{
    phrases: phrases,
    }],
};

const request = {
audio: audio,
config: config,
};

const startTime = Date.now();
const startProcessMsg = 'Start processing'  + personName + '.flac';
console.log(startProcessMsg);
const [operation] = await client.longRunningRecognize(request);
// Get a Promise representation of the final result of the job
const [response] = await operation.promise();

// log the full response results to jsonFileName
fs.writeFileSync(jsonFileName, JSON.stringify(response.results))

// log only the transcription results to txtFileName
const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
  fs.writeFileSync(txtFileName, transcription)

const millis = Date.now() - startTime;
const minutes = Math.ceil(millis/60000);

console.log('Done processing'  + personName + '.flac');
console.log('processing took ' + minutes + ' minutes');

}
main().catch(console.error);