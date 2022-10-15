/* eslint-disable @typescript-eslint/restrict-template-expressions */

function getScore(fields) {
  fetch("/api/goodSportScores").then(showResponse).catch(showResponse);
}
