// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");

const fs = require("fs");

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
async function quickstart() {
  const gcsUri = "gs://speechapitesting/sample.flac";
  const sampleRateHertz = 44100;
  const languageCode = "en-US";
  const audioChannelCount = 2;

  const config = {
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    audioChannelCount: audioChannelCount,
    enableAutomaticPunctuation: true,
    enableSpeakerDiarization: true,
    minSpeakerCount: 2,
    InteractionType: "DISCUSSION",
    microphoneDistance: "NEARFIELD",
    originalMediaType: "AUDIO",
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
  console.log("Speaker Diarization:");
  const result = response.results[response.results.length - 1];
  const wordsInfo = result.alternatives[0].words;
  // Note: The transcript within each result is separate and sequential per result.
  // However, the words list within an alternative includes all the words
  // from all the results thus far. Thus, to get all the words with speaker
  // tags, you only have to take the words list from the last result:
  wordsInfo.forEach((a) =>
    console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
  );
  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  //   const [operation] = await client.longRunningRecognize(request);
  //   // Get a Promise representation of the final result of the job
  //   const [response] = await operation.promise();
  //   const transcription = response.results
  //     .map((result) => result.alternatives[0].transcript)
  //     .join("\n");

  //   console.log(`Transcription: ${transcription}`);

  //   fs.writeFile("portal1.txt", transcription, function (err) {
  //     if (err) throw err;
  //     console.log("saved");
  //   });
}
quickstart();
